#!/usr/bin/env python3
"""
Improved, robust ml_train.py for Adaptive ISL Smart Glove
- Loads real windows saved by server.py (supports .npz and .npy)
- Extracts features from each window (mean, std, min, max per sensor)
- Generates synthetic combo windows by concatenating random base windows
- Saves synthetic windows (optional) and trains RandomForest
- Defensive checks to avoid train_test_split crashes
- Friendly logging and clear error messages

Usage:
    python ml_train.py
"""

import os
import sys
import glob
import time
import json
import random
import numpy as np
from collections import defaultdict
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from joblib import dump

# ---------------------------
# Config (tweak if needed)
# ---------------------------
ROOT = os.path.dirname(__file__)
DATA_DIR = os.path.join(ROOT, "data")            # should contain A/, B/, C/ created by server.py
MODEL_PATH = os.path.join(ROOT, "models", "rf_model.joblib")
SYNTH_SAVE = True            # Save generated synthetic windows under DATA_DIR/<COMBO>/
SYNTH_PER_COMBO = 5          # number of synthetic samples to create per combo (increase for larger synthetic dataset)
MAX_COMBO_LEN = 3            # generate combos up to length 3 (1,2,3)
MIN_REAL_PER_LABEL = 1       # require at least this many real windows per base label to proceed
RANDOM_SEED = 42

random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

# ---------------------------
# Utilities
# ---------------------------
def load_windows_from_folder(folder):
    """
    Returns list of numpy arrays (each window is an array shape (T, D)) found in folder.
    Supports .npz (np.savez with key 'data') and .npy.
    """
    windows = []
    if not os.path.isdir(folder):
        return windows
    for f in sorted(os.listdir(folder)):
        path = os.path.join(folder, f)
        if not os.path.isfile(path):
            continue
        try:
            if path.endswith(".npz"):
                arr = np.load(path, allow_pickle=True)
                # look for 'data' or take first array
                if "data" in arr:
                    data = arr["data"]
                else:
                    # pick first key
                    keys = list(arr.keys())
                    data = arr[keys[0]]
                windows.append(np.array(data))
            elif path.endswith(".npy"):
                data = np.load(path, allow_pickle=True)
                windows.append(np.array(data))
            else:
                continue
        except Exception as e:
            print(f"⚠️ Skipping unreadable file {path}: {e}")
    return windows

def extract_features(window):
    """
    window: np.array shape (T, D) where D is number of sensor values per frame (e.g., 13)
    returns: 1D feature array: [mean_D, std_D, min_D, max_D] flattened -> length 4*D
    """
    arr = np.array(window)
    if arr.ndim == 1:
        arr = arr.reshape(-1, arr.shape[0])  # fallback
    mean = np.mean(arr, axis=0)
    std = np.std(arr, axis=0)
    mn = np.min(arr, axis=0)
    mx = np.max(arr, axis=0)
    feats = np.concatenate([mean, std, mn, mx]).astype(float)
    return feats

def generate_combos(base_labels, max_len=3):
    combos = []

    def helper(prefix):
        if 0 < len(prefix) <= max_len:
            combos.append("".join(prefix))
        if len(prefix) == max_len:
            return
        for l in base_labels:
            if prefix and prefix[-1] == l:
                continue
            helper(prefix + [l])

    helper([])
    return combos

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

# ---------------------------
# Main pipeline
# ---------------------------
def main():
    print("🔎 Starting ml_train.py (improved) ...")
    if not os.path.isdir(DATA_DIR):
        print(f"❌ Data folder not found: {DATA_DIR}")
        print("Please run collection (server.py + dashboard training) to populate data/A, data/B, data/C")
        return

    # discover labels (folders) - prefer A,B,C but allow any
    labels = sorted([d for d in os.listdir(DATA_DIR) if os.path.isdir(os.path.join(DATA_DIR, d))])
    if not labels:
        print(f"❌ No label subfolders found inside {DATA_DIR} (expect A/, B/, C/).")
        return

    print(f"📂 Found label folders: {labels}")

    # load all windows per label
    windows_by_label = {}
    for lbl in labels:
        fld = os.path.join(DATA_DIR, lbl)
        wins = load_windows_from_folder(fld)
        windows_by_label[lbl] = wins
        print(f"  • {lbl}: {len(wins)} real windows")

    # Basic validations: require at least one real sample for each base label (A,B,C expected)
    base_labels = [l for l in labels if len(l) == 1]  # single-character labels (A,B,C)
    if not base_labels:
        # fallback: take all labels as base labels
        base_labels = labels

    missing = [lbl for lbl in base_labels if len(windows_by_label.get(lbl, [])) < MIN_REAL_PER_LABEL]
    if missing:
        print("❌ Not enough real data for base labels:", missing)
        print(f"Collect at least {MIN_REAL_PER_LABEL} window(s) per base label and try again.")
        return

    # Build real dataset (features)
    X_real = []
    y_real = []
    for lbl, wins in windows_by_label.items():
        for w in wins:
            feats = extract_features(w)
            X_real.append(feats)
            y_real.append(lbl)

    X_real = np.array(X_real) if X_real else np.empty((0,))
    y_real = np.array(y_real) if y_real else np.empty((0,))
    print(f"📊 Loaded real feature samples: {len(X_real)}  labels: {sorted(set(y_real))}")

    # Generate combos (including length-1 base gestures)
    combos = generate_combos(base_labels, max_len=MAX_COMBO_LEN)
    combos = sorted(combos, key=lambda s: (len(s), s))  # neat ordering
    print(f"🧩 Generated {len(combos)} combos: {combos}")

    # Create synthetic samples for combos longer than 1
    X_synth = []
    y_synth = []
    synth_saved = 0
    for combo in combos:
        if len(combo) == 1:
            continue  # base already present as real samples
        # create SYNTH_PER_COMBO synthetic windows
        for i in range(SYNTH_PER_COMBO):
            parts = []
            valid = True
            for ch in combo:
                if ch not in windows_by_label or len(windows_by_label[ch]) == 0:
                    valid = False
                    break
                # random choice with replacement
                sample_win = random.choice(windows_by_label[ch])
                parts.append(np.array(sample_win))
            if not valid:
                continue
            # concatenate along time axis: stacked frames
            merged = np.vstack(parts)
            feats = extract_features(merged)
            X_synth.append(feats)
            y_synth.append(combo)
            # optionally save synthetic window for transparency
            if SYNTH_SAVE:
                combo_dir = os.path.join(DATA_DIR, combo)
                ensure_dir(combo_dir)
                try:
                    ts = int(time.time() * 1000)
                    fname = os.path.join(combo_dir, f"synthetic_{combo}_{ts}_{i}.npz")
                    np.savez(fname, data=merged)
                    synth_saved += 1
                except Exception as e:
                    print(f"⚠️ Could not save synthetic window for {combo}: {e}")

    X_synth = np.array(X_synth) if X_synth else np.empty((0,))
    y_synth = np.array(y_synth) if y_synth else np.empty((0,))
    print(f"✅ Created {len(y_synth)} synthetic combo samples (saved {synth_saved})")

    # Merge datasets
    if X_real.size == 0 and X_synth.size == 0:
        print("❌ No data (real or synthetic) available. Aborting.")
        return

    if X_real.size == 0:
        X_full = X_synth
        y_full = y_synth
    elif X_synth.size == 0:
        X_full = X_real
        y_full = y_real
    else:
        X_full = np.vstack([X_real, X_synth])
        y_full = np.concatenate([y_real, y_synth])

    print(f"🔢 Total training samples: {len(y_full)}  classes: {sorted(set(y_full))}")

    # Prevent train_test_split errors:
    unique, counts = np.unique(y_full, return_counts=True)
    label_counts = dict(zip(unique, counts))
    print("  • per-class sample counts:", label_counts)

    # Need at least 2 samples to split; if tiny dataset, use train_size fallback
    if len(y_full) < 4:
        print("⚠️ Small dataset (<4 samples). Training on entire dataset without test split.")
        X_train, y_train = X_full, y_full
        X_test, y_test = X_full, y_full
    else:
        # try stratified split; if impossible due to rare classes, fallback to non-stratified
        try:
            X_train, X_test, y_train, y_test = train_test_split(
                X_full, y_full, test_size=0.2, stratify=y_full, random_state=RANDOM_SEED
            )
        except Exception as e:
            print("⚠️ Stratified split failed:", e)
            print("   Falling back to non-stratified split.")
            X_train, X_test, y_train, y_test = train_test_split(
                X_full, y_full, test_size=0.2, random_state=RANDOM_SEED
            )

    print(f"  • Train samples: {len(y_train)}  Test samples: {len(y_test)}")

    # Train classifier
    clf = RandomForestClassifier(n_estimators=200, random_state=RANDOM_SEED)
    try:
        clf.fit(X_train, y_train)
    except Exception as e:
        print("❌ Training failed:", e)
        return

    ensure_dir(os.path.dirname(MODEL_PATH))
    dump(clf, MODEL_PATH)
    print(f"✅ Trained RandomForest saved to: {MODEL_PATH}")

    # Evaluate
    try:
        y_pred = clf.predict(X_test)
        print("\n📊 Classification Report:")
        print(classification_report(y_test, y_pred, zero_division=0))
        print("🧾 Confusion Matrix:")
        print(confusion_matrix(y_test, y_pred))
    except Exception as e:
        print("⚠️ Evaluation failed:", e)

    print("🎉 Training pipeline complete.")

if __name__ == "__main__":
    main()



