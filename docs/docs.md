# 📘 Documentation – Adaptive ISL Smart Glove (UI/UX Module)

> *Category:* Edge AI | IoT | Assistive Tech | Accessibility  
> *Module Type:* Frontend (Figma-based Web UI + Simulation)  
> *Technology Stack:* HTML, CSS, JavaScript (Vite)  
> *Integration:* BLE-connected ESP32 + ML inference (Edge AI)  
> *Developer:* Khushi Mangal  
> *Aligned with:* Accessible India | Digital India | Startup India | AIM | NEP 2020  

---

## 🧠 Overview

This repository represents the *UI/UX module* of the *Adaptive ISL Smart Glove* — a gamified web application that enables *gesture learning, adaptive ML-based training, and real-time sign language communication* for users of *Indian Sign Language (ISL)*.

The web prototype is designed in *Figma* and implemented using *HTML, CSS, and JavaScript (Vite)*.  
It acts as the *visual and interaction layer* of the larger *Edge-AI wearable system, integrated with an **ESP32-based sensor glove* via *Bluetooth Low Energy (BLE)* for low-latency data transfer and gesture recognition.

---

## 🎯 Project Goals

1. Provide an *intuitive, accessible, and gamified learning interface* for ISL users.  
2. Enable users to *train gestures interactively* by watching guided ISL videos.  
3. Display *real-time feedback* for gesture accuracy, confidence, and progress.  
4. Allow *custom gesture creation and labeling* through an easy-to-use UI.  
5. Present *progress tracking and learning analytics* for adaptive improvement.  
6. Enable future integration with *TensorFlow Lite / TF.js* for real-time gesture inference.

---

## 🧩 UI/UX Architecture

The design follows a *module-based gamified learning system*, where users advance through:
- 🎯 Levels (gesture sets)
- 📈 Accuracy Goals
- 🧠 Gesture Milestones  

Each step adds to a personalized dataset and trains the glove to adapt to each user’s signing style.

---

### 🖥 Core UI Components

1. *Header Bar*
   - Profile picture  
   - Search bar  
   - Menu dropdown  

2. *Progress Card (Gamified Dashboard)*
   - Shows accuracy %  
   - Custom gestures count  
   - Level progress  

3. *Gesture Training Panel*
   - Embedded ISL tutorial video  
   - “Train Gesture” button  
   - Real-time feedback like: Gesture Matched: 87%  

4. *Customization Mode*
   - Input for new gesture name  
   - Capture + label new gesture  
   - Gesture confirmation popup  

5. *ISL Learning Library*
   - Scrollable ISL video list  
   - Categories: Basic | Advanced | Custom  

6. *Level Tracker*
   - Horizontal progress bar (Candy-Crush style)  
   - Unlockable gesture groups  

---

## 💻 Simulation Layer (for SIH Demo)

This module includes a *browser-based ML simulation* (/ml_demo/demo.html)  
that mimics how real-time gesture recognition will function once integrated with glove hardware.

### *Workflow:*

*Inference Engine:* Simulated with *TensorFlow.js mock model*  
showing prediction results like → Prediction: HELLO | Confidence: 92% ✅

This helps demonstrate real-time inference *without needing physical sensors* during early prototyping.

---

## 🎮 Gamification Logic

| Element | Description |
|----------|-------------|
| *Levels* | Each gesture group = 1 level (5–7 gestures per level). |
| *XP System* | Completing accurate gestures earns XP points. |
| *Badges* | Silver: Accuracy >85% • Gold: Accuracy >90%. |
| *Daily Streaks* | Encourages consistent daily practice. |
| *Accuracy Feedback* | Real-time confidence % shown after each gesture. |
| *Reward Animation* | Lottie/Rive-based animation for success events. |

> Animations are powered by *Lottie* and *Rive* for high-performance, interactive visuals.

---

## ⚙ Technical Interaction Flow (UI ↔ Glove System)

*1. Gesture Capture (Hardware Side)*  
- Flex sensors + IMU (MPU6050) detect finger bend and motion.  
- ESP32 microcontroller preprocesses and transmits data via BLE.

*2. Data Transfer (Communication Layer)*  
- BLE ensures ultra-low power, high-speed sync (<300ms).

*3. Data Processing (App Side)*  
- Mobile/web app receives sensor packet, normalizes values.  
- Compares gesture data with stored patterns.  
- If similarity ≥85% → accepted, stored in user dataset.  

*4. ML Inference (Edge AI Layer)*  
- TensorFlow.js mock model simulates classification in browser.  
- Future version will deploy *TensorFlow Lite (TFLite)* on device.

*5. Output Generation*  
- Converts gesture → *Text, **Speech (TTS), or **Animated visual hand*.

---

## 🧠 Adaptive Learning & Dataset Growth

- *Training Phase:* 7-day guided learning (30 samples/gesture).  
- *Continuous Learning:* Adds data during live use → 250+ samples/gesture.  
- *Auto-Calibration:* Adjusts to each user’s hand range and motion profile.  
- *Adaptive Accuracy:* Improves from 70% → 90%+ as model learns.  
- *Local Storage:* Data saved on app; optional cloud backup.  

---

## 🔋 Performance & Hardware Targets

| Parameter | Target |
|------------|---------|
| BLE Latency | <300 ms |
| Gesture Accuracy | ≥90% |
| Power Consumption | <400 mAh |
| Battery Life | 6–8 hours |
| Dataset Size | 30–250 samples/gesture |
| Training Duration | 7 days adaptive cycle |

---

## 🔮 Future Integration (Post-SIH Phase)

- Real-time BLE integration with physical ESP32 glove.  
- Deploy optimized *TFLite models* for on-device inference.  
- Implement *Incremental Learning (Few-shot updates)* in app.  
- Add *ISL → English/Hindi Sentence Mapping* using NLP.  
- Release open *gesture dataset* for ISL research & public training.  
- Expand to *two-hand gesture support* and *cross-language translation (ASL/BSL)*.

---

## 🏛 Government & SDG Alignment

Aligned with:  
- *Accessible India Campaign (Sugamya Bharat Abhiyan)*  
- *Digital India Mission*  
- *Atmanirbhar Bharat Abhiyan*  
- *Startup India*  
- *Atal Innovation Mission (AIM)*  
- *NEP 2020 – EdTech Integration*  
- *UN SDG Goal 10 – Reduced Inequalities*

> Promotes inclusion, digital empowerment, and accessibility for individuals with hearing/speech disabilities.

---

## 🌍 Vision
> “Learn, Train, and Communicate — Bridging Silence Through Technology.”

---

## 📈 Summary

This documentation outlines the *UI/UX design, architecture, gamification flow, BLE communication layer, and ML simulation approach* for the Adaptive ISL Smart Glove.  
The system bridges *AI + IoT + Accessibility*, enabling a scalable, real-time, and gamified sign-language-to-speech translation platform for India’s inclusive communication future.