# 🧠 Adaptive ISL Smart Glove — Gamified Edge-AI System  

> A *wearable assistive technology* that uses *Machine Learning (ML), **Edge AI, and **Bluetooth Low Energy (BLE)* to translate *Indian Sign Language (ISL)* gestures into *text, speech, and visual output* in real time.  
> This repository showcases the *UI/UX prototype* and *web simulation* for the system.

---

## 🎯 Role of This Repo  
This repository contains the *Figma-based UI / frontend prototype* for the *gamified training web app* of the Adaptive ISL Smart Glove system.  
It visualizes how users will interact — training, customization, progress tracking, and gesture feedback.

---

## 🚀 Core Highlights (UI/UX Prototype)
- *Gamified Dashboard:* Levels, progress bar, accuracy tracker.  
- *Video-Synced ISL Learning Interface:* Users train gestures while watching ISL tutorials.  
- *Gesture Customization Screen:* Create, label, and store new signs.  
- *Responsive Mobile-First Design:* Works seamlessly on phones and browsers.  
- *Real-Time Data Sync (BLE-Ready):* Low-latency feedback from glove to app.  
- *Edge-Optimized Structure:* Future ML integration using TensorFlow Lite / TensorFlow.js.  
- *Adaptive Learning:* Improves model confidence as user trains.  
- *Permutation Logic:* 5 base gestures → 25+ combinations for richer vocabulary.  
- *Multilingual Output:* English | Hindi | Regional.  

---

## 🎬 Live Simulation (Prototype)
A mini web demo (/ml_demo/demo.html) simulates ML-based gesture recognition for judges.

*Try it:*
1. Open /ml_demo/demo.html
2. Click *“Simulate Gesture”*
3. Output appears like →  
   Prediction: HELLO | Confidence: 92% ✅

(Demonstrates real-time Edge AI inference simulation using mock data.)

---

## 🧠 How to Run / Preview
```bash
git clone https://github.com/khushi-mangal/sign-language-ui.git
cd sign-language-ui
npm install
npm run dev



  