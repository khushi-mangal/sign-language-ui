#!/usr/bin/env python3
"""
✅ Adaptive ISL Smart Glove — ML Integrated Server (v9.2 Final)
---------------------------------------------------------------
• Compatible with Python 3.9–3.12 & all websockets versions
• Collects gesture training data (A/B/C)
• Saves progress persistently (models/progress.json)
• Provides reset command for dashboard button
• Loads trained RandomForest model for live predictions
• Sends dataset progress and predictions to app.js
---------------------------------------------------------------
"""

import os
import json
import time
import asyncio
import numpy as np
import websockets
from datetime import datetime
from joblib import load
from collections import defaultdict

# ---------------------------
# 🔧 CONFIGURATION
# ---------------------------
ROOT = os.path.dirname(__file__)
DATA_DIR = os.path.join(ROOT, "data")
MODELS_DIR = os.path.join(ROOT, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "rf_model.joblib")
PROGRESS_PATH = os.path.join(MODELS_DIR, "progress.json")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

progress = defaultdict(int)
window_buffer = []
current_label = None
collecting = False
collect_start_time = 0
collect_duration = 1000  # ms

# ---------------------------
# 🧠 LOAD MODEL + PROGRESS
# ---------------------------
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = load(MODEL_PATH)
        print(f"🧠 Loaded trained model: {MODEL_PATH}")
    except Exception as e:
        print(f"⚠️ Model load failed: {e}")

if os.path.exists(PROGRESS_PATH):
    try:
        with open(PROGRESS_PATH, "r") as f:
            progress = defaultdict(int, json.load(f))
        print(f"📊 Loaded saved progress from {PROGRESS_PATH}")
    except Exception as e:
        print(f"⚠️ Failed to load progress.json: {e}")

# ---------------------------
# ⚙️ FEATURE EXTRACTION
# ---------------------------
def extract_features(window):
    """Compute mean, std, min, max features from 13-sensor window"""
    arr = np.array(window)
    if arr.ndim == 1:
        arr = arr.reshape(1, -1)
    mean = np.mean(arr, axis=0)
    std = np.std(arr, axis=0)
    mn = np.min(arr, axis=0)
    mx = np.max(arr, axis=0)
    return np.concatenate([mean, std, mn, mx])

# ---------------------------
# 💾 DATA SAVE HELPERS
# ---------------------------
def save_progress():
    """Persist progress.json"""
    try:
        with open(PROGRESS_PATH, "w") as f:
            json.dump(progress, f, indent=2)
    except Exception as e:
        print("⚠️ Failed to save progress:", e)

def save_window(label, data):
    """Save collected window as .npy file"""
    folder = os.path.join(DATA_DIR, label)
    os.makedirs(folder, exist_ok=True)
    ts = int(time.time() * 1000)
    path = os.path.join(folder, f"win_{label}_{ts}.npy")
    np.save(path, np.array(data))
    progress[label] += 1
    save_progress()

# ---------------------------
# 🔄 MAIN COMMAND HANDLER
# ---------------------------
async def handle_message(ws, msg):
    global current_label, collecting, collect_start_time, window_buffer

    cmd = msg.get("cmd")

    # 🧩 START DATA COLLECTION
    if cmd == "start_label":
        current_label = msg.get("label")
        duration = msg.get("duration_ms", 1000)
        collect_start_time = time.time()
        window_buffer = []
        collecting = True
        await ws.send(json.dumps({
            "type": "status",
            "msg": f"🎬 Collecting {current_label} for {duration} ms"
        }))

    # 📦 RECEIVE PACKET (training or prediction)
    elif cmd == "packet":
        if collecting:
            window_buffer.append(msg["values"])
            # stop after duration
            if (time.time() - collect_start_time) * 1000 >= collect_duration:
                save_window(current_label, window_buffer)
                collecting = False
                window_buffer = []
                await ws.send(json.dumps({
                    "type": "status",
                    "msg": f"✅ Saved window for {current_label} ({progress[current_label]}/500)"
                }))
                await send_summary(ws)
        else:
            # 🔮 REAL-TIME PREDICTION
            if model is not None:
                try:
                    feats = extract_features(msg["values"])
                    pred = model.predict([feats])[0]
                    conf = np.max(model.predict_proba([feats])) if hasattr(model, "predict_proba") else 0.8
                    await ws.send(json.dumps({
                        "type": "prediction",
                        "label": str(pred),
                        "conf": float(conf),
                        "ts": int(time.time() * 1000)
                    }))
                except Exception as e:
                    print("⚠️ Prediction failed:", e)

    # 📊 SEND SUMMARY
    elif cmd == "get_summary":
        await send_summary(ws)

    # 🧹 RESET PROGRESS
    elif cmd == "reset_progress":
        progress["A"] = 0
        progress["B"] = 0
        progress["C"] = 0
        save_progress()
        await send_summary(ws)
        await ws.send(json.dumps({
            "type": "status",
            "msg": "🧹 All gesture progress reset!"
        }))
        print("🧹 Progress reset to 0.")

# ---------------------------
# 📊 SUMMARY BROADCASTER
# ---------------------------
async def send_summary(ws):
    try:
        await ws.send(json.dumps({
            "type": "summary",
            "counts": dict(progress)
        }))
    except Exception as e:
        print("⚠️ Failed to send summary:", e)

# ---------------------------
# 🌐 WEBSOCKET HANDLER
# ---------------------------
async def ws_handler(websocket, path=None):
    """Compatible with all websocket versions"""
    print(f"⚡ Client connected at {datetime.now().strftime('%H:%M:%S')}")
    await send_summary(websocket)
    try:
        async for message in websocket:
            try:
                msg = json.loads(message)
                await handle_message(websocket, msg)
            except Exception as e:
                print("⚠️ Error handling message:", e)
    except websockets.ConnectionClosed:
        print("❌ Client disconnected")

# ---------------------------
# 🚀 MAIN SERVER LOOP
# ---------------------------
async def main():
    print("🌐 Starting ML WebSocket server on ws://0.0.0.0:8765 …")
    try:
        server = await websockets.serve(ws_handler, "0.0.0.0", 8765)
    except TypeError:
        # fallback for older API signatures
        server = await websockets.serve(lambda ws, _: ws_handler(ws), "0.0.0.0", 8765)

    await server.wait_closed()

# ---------------------------
# 🏁 ENTRY POINT
# ---------------------------
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("🛑 Server stopped by user.")









