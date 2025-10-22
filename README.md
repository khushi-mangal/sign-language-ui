# 🌐 Adaptive ISL Smart Glove  
### Gamified Edge-AI System for Real-Time Sign Language Translation  
#### Team: *Shunya* | Smart India Hackathon 2025  

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


---

🧩 Future Development

Integration with actual sensor gloves (Flex, IMU, Pressure)

Edge-level learning via TensorFlow Lite Micro

Gamified progress dashboard with AI-generated feedback

BLE + ESP32-based hardware prototype

Mobile app (Flutter BLE) for real-time ISL translation



---


## ▶ Run Instructions  

### 🧩 Adaptive Dashboard (Main Prototype)  
1. Clone the repository  
   ```bash
   git clone https://github.com/khushi-mangal/sign-language-ui

2. Open /web_demo/index.html in VS Code Live Server


3. Train gestures (A, B, C…) and watch the adaptive learning dashboard in action!



🎨 Figma-Based Web UI (Mobile Simulation)

1. Run locally for the UI prototype

cd sign-language-ui
npm install
npm run dev


2. Explore the gamified mobile interface built in Figma → Web.

---

> “Gamification is how humans learn — our glove makes AI learn the same way.” 🎮🧠
Team Shunya




  