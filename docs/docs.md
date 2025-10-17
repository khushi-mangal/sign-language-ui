## Documentation – Adaptive ISL Smart Glove (UI Module)

> *Module Type:* Frontend (Figma-based Web UI)  
> *Technology:* HTML, CSS, JavaScript (Vite)  
> *Integration:* BLE-connected ESP32 + ML inference (Edge AI)  
> *Developer:* Khushi Mangal  
> *Project Alignment:* Accessible India | Digital India | Startup India | AIM | NEP 2020  

---

## Overview

This repository contains the *front-end (UI/UX)* component of the *Adaptive ISL Smart Glove* project — a *gamified web interface* that enables *gesture learning, adaptive training, and real-time communication* for individuals using *Indian Sign Language (ISL)*.

The UI prototype is designed using *Figma* and implemented as a *responsive web layout* using *HTML, CSS, and JavaScript (Vite environment)*.

This module represents the *visual and interaction layer* of the full *Edge-AI Smart Glove system, which integrates with an **ESP32-based sensor glove* using *Bluetooth Low Energy (BLE)* for ultra-low-latency data transfer.

---

## Project Goals

1. Provide an *intuitive, accessible, and gamified web interface* for sign language learners and glove users.  
2. Enable users to *train gestures interactively* by watching guided ISL videos.  
3. Display *real-time feedback* (accuracy %, level, and gesture match percentage).  
4. Allow *custom sign creation and labeling* through the app interface.  
5. Visually represent *training progress, accuracy growth, and milestones.*

---

## UI/UX Architecture

The design follows a *module-based gamified structure, where users progress through **levels, accuracy goals, and gesture milestones*.  
Each section of the UI is designed to mimic a “learning game” where progress directly correlates with gesture mastery.

### UI Components

1. *Header Bar*
   - Profile picture  
   - Search bar  
   - Menu dropdown  

2. *Progress Card (Gamified Dashboard)*
   - Displays Accuracy %  
   - Custom Gestures Count  
   - Current Level progress  

3. *Gesture Training Panel*
   - Embedded ISL instructional video  
   - “Train Gesture” button  
   - Live feedback display (e.g., Gesture Matched: 87%)  

4. *Customization Mode*
   - Input field for new gesture name  
   - Capture new gesture button  
   - Gesture label confirmation modal  

5. *ISL Learning Library*
   - Scrollable video list synced from dataset  
   - Categories: Basic / Advanced / Custom  

6. *Gamified Level Tracker*
   - Candy-Crush-style horizontal level bar  
   - Unlockable gesture groups based on training completion  

---

##  Gamification Logic

| Element | Description |
|----------|-------------|
| *Levels* | Each gesture group = 1 level (5–7 gestures per level). |
| *XP System* | Completing accurate gestures earns XP points. |
| *Badges* | Silver: Accuracy >85% • Gold: Accuracy >90%. |
| *Daily Streaks* | Encourages daily learning through streak bar. |
| *Accuracy Feedback* | Real-time feedback on confidence score from ML model. |
| *Reward Animation* | Confetti or animated 3D hand (via Lottie/Rive) for success. |

> All gamified animations are implemented using *Lottie* or *Rive*, providing lightweight vector-based interactivity.

---

## ⚙ Technical Interaction Flow (UI ↔ Glove System)

### *Data Flow*

*Incoming BLE Data:*
```json
{
  "gesture_id": "G_03",
  "accuracy": 0.89,
  "timestamp": 1680000000,
  "gesture_name": "HELLO"
}