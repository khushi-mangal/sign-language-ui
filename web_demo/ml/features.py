# ml/features.py
import numpy as np
from scipy.stats import skew, kurtosis
from scipy.fft import rfft, rfftfreq

def extract_features(window, sr=10):  # default sr=10 packets/sec (your mock uses 10Hz)
    """
    window: np.array shape (T, C)  (C=13 in your pipeline: 10 sensors + 3 imu)
    returns: 1D numpy array of features
    """
    T, C = window.shape
    feats = []
    # time-domain per channel
    for ch in range(C):
        sig = window[:, ch].astype(np.float32)
        feats.extend([
            float(sig.mean()), float(sig.std()), float(sig.max()-sig.min()),
            float(np.sqrt((sig**2).mean()))
        ])
        # statistical moments (robust small-sample)
        try:
            feats.append(float(skew(sig)))
        except:
            feats.append(0.0)
        try:
            feats.append(float(kurtosis(sig)))
        except:
            feats.append(0.0)
    # magnitude of first 3 channels (treat as flex/accel proxy if desired)
    if C >= 3:
        mag = np.linalg.norm(window[:, :3], axis=1)
        feats.extend([float(mag.mean()), float(mag.std()), float(mag.max())])
    # low-res spectral energy on channel 0 (useful for repetitive gestures)
    try:
        yf = np.abs(rfft(window[:, 0]))
        freqs = rfftfreq(T, 1.0/sr)
        for (a,b) in [(0,1),(1,3),(3,6)]:  # bands tuned to 10Hz-ish data
            idx = np.where((freqs >= a) & (freqs < b))[0]
            feats.append(float(yf[idx].sum() if idx.size>0 else 0.0))
    except Exception:
        feats.extend([0.0, 0.0, 0.0])
    return np.array(feats, dtype=np.float32)
