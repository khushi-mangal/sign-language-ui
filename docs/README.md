# 🌐 Adaptive ISL Smart Glove  
### Gamified Edge-AI System for Real-Time Sign Language Translation  
#### Team: *Shunya* | Smart India Hackathon 2025  


---

### 🧩 Detailed Video Explanation  
Watch the complete working demo of the Adaptive ISL Smart Glove — from hardware overview to the 3-phase adaptive learning system.
### 🎥 Watch Full Demo Video  
▶ [Click here to watch on Google Drive](https://drive.google.com/drive/folders/13nUiDXqaxtOtJBO4opgLGrHw-C_Wzrqg)  
*(Includes full voice explanation + adaptive dashboard demo)*



### 🧠 System Architecture Flow  
The following flowchart explains how data flows from the **sensor hardware (ESP32)** to the **adaptive web dashboard** through BLE communication — covering all three phases: *Training, Live Communication,* and *Customization.*

![System Flowchart](https://raw.githubusercontent.com/khushi-mangal/sign-language-ui/main/docs/flowchart.png)

---

## ▶ Run Instructions  

### 🧩 Adaptive Dashboard (Main Prototype)  
1. Clone the repository  
   ```bash
   git clone https://github.com/khushi-mangal/sign-language-ui

2. Open /web_demo/index.html in VS Code Live Server


3. Train gestures (A, B, C…) and watch the adaptive learning dashboard in action!

### 🎨 Figma-Based Web UI (Mobile Simulation)

1. Run locally for the UI prototype

cd sign-language-ui
npm install
npm run dev


2. Explore the gamified mobile interface built in Figma → Web.

---

## 🧠 Overview  
The *Adaptive ISL Smart Glove* bridges accessibility and AI through *gamified gesture learning* and *adaptive permutation logic*.  
It enables real-time translation of Indian Sign Language (ISL) while creating an *interactive, game-like learning experience* for users who cannot hear or speak.  

Our system learns new words from just a few base gestures — showing how AI can “play to learn,” not just train on data.

---

## 🎯 Problem & Solution  
Traditional sign language systems are dataset-heavy, non-adaptive, and lack engagement.  
Users need a more *interactive way to train gestures, and systems need to **adapt dynamically* rather than being re-trained.

Our glove combines:
- *Gamified learning* for motivation and real-time feedback 🎮  
- *Adaptive logic* that creates new words using trained gestures 🧩  
- *Sensor fusion (Flex, IMU, Pressure)* for real-time validation ⚙  

---

## 🎮 Gamification at the Core  
| Feature | Description |
|:--|:--|
| 🎯 *Accuracy Feedback* | Visual bars show how close the gesture matches the trained pattern. |
| 🧩 *Levels & Progress* | Users unlock new gestures after reaching certain accuracy. |
| 🌟 *Adaptive Scoring* | AI rewards consistent improvement and confidence over time. |
| 🕹 *Practice Mode* | Each gesture can be replayed, corrected, and trained again. |

> The more users “play” with gestures, the smarter the glove becomes — learning like a human brain.

---

## 🧮 Adaptive Gesture Logic  
Instead of training 100+ signs, we train a few and *generate new combinations* using permutation-based AI logic.

*Rule Set:*  
- Maximum gesture length = 3  
- No consecutive repetition (AA ❌)  
- Alternating repetition allowed (ABA ✅)  
- Each valid combination = unique meaning  

*Formula:*

Total = N + N × (N - 1) + N × (N - 1) × (N - 1)

*Example:*  
- 3 trained gestures → 21 unique words  
- 10 trained gestures → 910 unique words  

This logic makes the system scalable — from a small training set to a rich sign vocabulary.

---

### Hardware Integration Overview

Currently missing:

⚙️ Hardware Integration (ESP32 + Sensor Simulation)

The hardware layer of Adaptive ISL Smart Glove enables real-world gesture sensing and BLE communication using ESP32.
It has been modularly designed — allowing both physical sensor input and simulated BLE data for testing.

Module	Description
🧠 Controller	ESP32-WROOM-32 with onboard BLE
✋ Sensors	5× Flex Sensors (finger bend) + 5× Pressure Sensors (finger tips) + IMU (orientation)
🔋 Power	3.7V Li-ion Battery + Boost Converter
🔗 Communication	BLE (Bluetooth Low Energy)
💡 Feedback	RGB LED for Train / Success / Error modes
📂 Hardware Folder Structure
hardware/
│
├── components.md     → List of all electronic + mechanical parts
├── connections.md    → Wiring between ESP32, sensors & power circuit
└── firmware.ino      → ESP32 BLE code for reading sensors & sending data

🔌 Working Flow

Physical Mode:
Flex & pressure sensors → ESP32 ADC → BLE packets → Web Dashboard

Simulation Mode (for demo):
mock_ble_stream.js simulates same BLE packets with randomized but realistic data.
It allows dashboard testing even without actual hardware.

Both paths share the same adaptive logic in app.js, making the system hardware-agnostic and scalable.

## 🔧 ESP32 Firmware Features

Reads 10 sensors (5 flex + 5 pressure) + IMU (X, Y, Z orientation)

Normalizes analog data (0–4095 → 0–100%)

Sends comma-separated BLE packets to dashboard:

f1,f2,f3,f4,f5,p1,p2,p3,p4,p5,ax,ay,az


LED feedback for connection, transmission, and training confirmation

Real-time BLE streaming compatible with web dashboard

✅ Simulation Bridge
Environment	Purpose
/simulation/mock_ble_stream.js	Emulates BLE packets in browser (testing without glove)
/web_demo/app.js	Adaptive accuracy + gesture recognition logic
ESP32 Firmware	Real hardware data → BLE packets → Same dashboard


---

## ⚙ Tech Stack  
*Frontend:* HTML, CSS, JavaScript  
*Design:* Figma (Web-based mobile UI simulation)  
*Core Logic:* Adaptive Permutation Engine (Custom JS)  
*Gamification Layer:* Real-time accuracy, progress tracking, rewards  
*Hardware (Future):* Flex, IMU, and Pressure sensors for validation

---

📁 Repository Structure

src/        → Figma-based UI (Gamified Mobile Simulation)
web_demo/   → Adaptive Gesture Dashboard (Working Logic Prototype)
docs/       → SIH Project Documentation (Detailed Report)
hardware/   → all physical system resources — including the ESP32 firmware, circuit connections, and component details that power the real adaptive glove
stimulation/  → generating and streaming mock BLE sensor data to the dashboard — allowing you to test the glove’s logic without actual hardware.


---

🧩 Future Development

Integration with actual sensor gloves (Flex, IMU, Pressure)

Edge-level learning via TensorFlow Lite Micro

Gamified progress dashboard with AI-generated feedback

BLE + ESP32-based hardware prototype

Mobile app (Flutter BLE) for real-time ISL translation

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

---

> “Gamification is how humans learn — our glove makes AI learn the same way.” 🎮🧠
Team Shunya




  