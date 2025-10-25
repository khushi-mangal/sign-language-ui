# 📘 Smart India Hackathon 2025 — Project Documentation  

### 👥 Team: **Shunya**  
### 🧠 Project Title: **Adaptive ISL Smart Glove — A Gamified Edge-AI System for Real-Time Sign Language Translation**

1. Problem Statement

Hearing and speech-impaired individuals face major communication challenges in daily life due to the lack of real-time, adaptive, and user-friendly Indian Sign Language (ISL) systems.

Most existing ISL solutions have these limitations:

Require large pre-trained datasets

Lack adaptability for new signs

Provide minimal user interaction or feedback

Do not support continuous learning from users

To address these gaps, the Adaptive ISL Smart Glove introduces a gamified training experience and adaptive learning logic powered by BLE-based edge communication, making ISL translation efficient, interactive, and personalized.

> 🧩 *In short, our glove learns like a human — adapting new signs without needing massive datasets.*


---

2. Project Overview

The Adaptive ISL Smart Glove is a 3-phase gamified AI system designed for gesture learning, live translation, and user customization.
It combines adaptive logic with an engaging training workflow to make gesture learning both effective and enjoyable.

The system operates across three integrated phases:

🧩 Training Phase — Learn and train gestures with gamified feedback.

🔊 Live Communication Phase — Perform gestures for real-time translation.

✋ Customization Phase — Create and label new gestures for personal use.

Each phase uses Bluetooth Low Energy (BLE) communication for real-time data exchange between the glove and the mobile/web application.


---
## 3. 🎯 Objectives

Build a BLE-based adaptive ISL glove for real-time sign translation and gamified learning.

Develop a multi-phase adaptive training system that evolves with each user.

Use adaptive permutation logic to reduce dataset dependency and exponentially expand vocabulary.

Allow custom gesture creation and labeling through guided tutorials.

Deliver continuous learning and feedback through gamified visual cues.

---
## 🚀 4. Core Innovations

These two innovations define the intelligence and interactivity of the glove.



4.1 Adaptive Permutation Logic

The glove generates new signs from a few base gestures using lightweight adaptive logic — similar to how humans combine words to form new meanings.

Rules:

Max gesture length = 3

No consecutive repetition (AA ❌)

Alternating repetition allowed (ABA ✅)

Each sequence = unique meaning

Formula:
Total = N + N × (N - 1) + N × (N - 1) × (N - 1)

Example:

3 base gestures → 21 adaptive words

10 base gestures → 910 adaptive words

This drastically reduces training time while maintaining scalability and accuracy.

4.2 Gamified Training Framework
Feature	Description
Accuracy Feedback	Real-time accuracy bar with color-coded evaluation.
Progress Tracking	Incremental growth bars for gesture mastery.
Rewards & Levels	Unlocks next gesture after hitting target accuracy.
Feedback Loop	“Excellent / Retry” cues motivate consistent practice.

The system “learns while you play” — turning learning into an interactive challenge.

### 4.3 🤖 Adaptive ML Integration (v9.2)

The latest version (v9.2) integrates a **real-time Machine Learning (ML) layer** to make gesture recognition adaptive and persistent.

#### 🧩 Key Features
- Trains base gestures (A, B, C) and automatically generates combo gestures (AB, AC, BA, etc.)
- Saves training progress persistently in `models/progress.json`
- Uses **Random Forest Classifier** for real-time prediction and confidence scoring
- Supports **synthetic dataset generation** from limited real samples
- Live inference handled via **WebSocket** between Python ML server and web dashboard

#### ⚙️ Model Pipeline
1. User trains base gestures → saved as `.npy` files  
2. Synthetic combos auto-generated (permutation rules applied)  
3. Features extracted (mean, std, min, max)  
4. Model trained and saved as `rf_model.joblib`  
5. Dashboard receives predictions in real-time (confidence > 55%)

> 🧠 The ML model evolves as the user trains — making the glove smarter every session.


---

> 🎮 The glove “learns while you play” — turning learning into a fun challenge instead of a chore.

## 🧩 5. System Workflow — Three Phases



🧩 Phase 1: Training (Gamified Learning)

User clicks “Train A/B/C” → Glove sends BLE sensor data.

The adaptive dashboard simulates or reads live data.

If readings fall within adaptive thresholds → Accuracy shown and gesture recorded.

Continuous feedback loop improves precision.


🔊 Phase 2: Communication (Live Mode)

Real-time sensor data → BLE → App → Text/Speech output.

Recognized gesture → Translated instantly into text or audio feedback.

Accuracy used for self-learning reinforcement.


✋ Phase 3: Customization

User performs new gesture 5× → glove checks variance threshold.

If stable, system allows naming (e.g., “Help”, “Emergency”).

Added to dataset for future translation.

---

## ⚙️ 6. Implementation Details  

| Module | Description |
|:--------|:-------------|
| 🧭 **Mobile UI (Figma + Web)** | Gamified front-end simulation for training and live translation |
| 💻 **Adaptive Dashboard (Web Demo)** | Real-time visualization, training logic, accuracy tracking |
| 🧪 **Simulation Layer (/simulation/)** | Generates mock BLE packets (10 sensors) for testing |
| 🔧 **Glove Hardware (/hardware/)** | ESP32 circuit integrating 5 Flex + 5 Pressure sensors + IMU |
| ⚙️ **Firmware (adaptive_glove_ble.ino)** | Reads, normalizes, and transmits via BLE every 200 ms |
| 🧠 **ML Training Layer (/ml/)** | Python-based RandomForest model with real-time WebSocket prediction |


---

7. Hardware Integration

Controller: ESP32-WROOM-32
Sensors:

5 × Flex Sensors (finger bends)

5 × Pressure Sensors (finger tips)

1 × IMU (orientation tracking)

Connection Summary:

Flex Sensors → ADC Pins (34–33)

Pressure Sensors → ADC Pins (25–29)

IMU (MPU6050) → SDA (21), SCL (22)

RGB LED → GPIO 2 (status indicator)

---

⚙️ ESP32 Setup

To run /hardware/firmware.ino, install:

Libraries:

ESP32 BLE Arduino

Wire (built-in)

MPU6050 (by Electronic Cats / Jeff Rowberg)

Steps:

Add board URL → https://dl.espressif.com/dl/package_esp32_index.json

Select Board: ESP32 Dev Module

Set Baud Rate: 115200

Upload the code 🚀
✅ This enables smooth testing and demonstration even without hardware connectivity.

---


8. Simulation Layer (No Hardware Needed)

Located in /simulation/mock_ble_stream.js

Purpose:

Simulates 10-sensor BLE data (5 Flex + 5 Pressure + IMU)

Triggered only when user clicks Train A/B/C

Streams mock data every 100–150 ms for 1 second

Allows complete dashboard testing without physical glove

This enables smooth demonstration even without hardware connectivity.

---
## 🤖 9. Machine Learning Layer (Adaptive Engine)

| Component | Description |
|:-----------|:-------------|
| 🧠 **ml_train.py** | Generates features, creates synthetic gesture combos, trains RandomForest model |
| 🌐 **server.py** | Hosts WebSocket ML server (`ws://localhost:8765`) for live communication with dashboard |
| 💾 **models/progress.json** | Persistent file storing per-gesture training progress |
| 📊 **models/rf_model.joblib** | Trained ML model used for real-time predictions |

**Flow:**  
1️⃣ Train gestures →  
2️⃣ ML layer auto-generates combos →  
3️⃣ Model trains →  
4️⃣ Web dashboard receives live predictions and confidence.

> 🔁 Continuous training makes every session more accurate — a true *self-learning* ISL system.

---

10. Results
Parameter	Outcome
Base Gestures Trained	3
Adaptive Combinations	21
Accuracy Range	70–95% (adaptive simulated)
BLE Transfer Latency	< 50 ms
Real Hardware Compilation	✅ Successful
Gamified UI	✅ Integrated
 Real-Time ML Prediction | ✅ Integrated via WebSocket (RandomForest) |

---


## 🚀 11. Future Scope

Full hardware deployment with calibrated sensor array.

Flutter BLE app integration for mobile use.

On-device edge inference using TensorFlow Lite Micro.

Gesture dataset cloud sync for personalization.

Dual-mode communication (Gesture ↔ Voice/Text).

---

12. Tech Stack

Layer	Tools & Technologies
Frontend	HTML, CSS, JavaScript
UI Design	Figma (Mobile App Prototype)
Logic Engine	Adaptive Permutation Algorithm
Communication	Bluetooth Low Energy (ESP32)
Gamification	Real-time Accuracy & Progress System
Hardware	ESP32 + 5 Flex + 5 Pressure + IMU

---

13. Conclusion

The Adaptive ISL Smart Glove merges hardware, AI, and gamification into one adaptive learning ecosystem.
Through BLE-based communication, real-time feedback, and adaptive logic, it enables expressive communication for everyone.

---

“Train less, express more — where every gesture learns to speak.” 💡

Team Shunya | Smart India Hackathon 2025