# 🧩 Components List – Adaptive ISL Smart Glove  
**Team Shunya | Smart India Hackathon 2025**

This document lists all electronic and mechanical components used in the **Adaptive ISL Smart Glove** prototype.  
It is designed to be **modular, low-cost**, and **BLE-enabled**, supporting **adaptive gesture learning** and **10-sensor integration** (5 flex + 5 pressure).

---

## 🔹 Electronics Components

| No. | Component | Quantity | Description | Approx. Cost (INR) | Notes |
|-----|------------|-----------|--------------|---------------------|--------|
| 1 | **ESP32-WROOM-32** | 1 | Dual-core MCU with built-in BLE + Wi-Fi | ₹350 | Main controller for sensor data + BLE transmission |
| 2 | **Flex Sensor (2.2 inch)** | 5 | Measures finger bending angle | ₹125 each | Mounted on each finger |
| 3 | **Pressure Sensor (FSR402 / FSR406)** | 5 | Detects fingertip pressure / touch intensity | ₹180 each | Mounted on each fingertip |
| 4 | **IMU Sensor (e.g., MPU6886 / MPU9250 / BNO055)** | 1 | 6–9 DOF inertial measurement for motion & orientation tracking | ₹220 | Replaces MPU6050 — better drift control |
| 5 | **RGB LED** | 1 | Provides visual feedback (Training / Success / Error) | ₹10 | Status indication for live feedback |
| 6 | **Li-ion Battery (3.7V, 1200mAh)** | 1 | Rechargeable power source | ₹180 | Portable and reusable |
| 7 | **Boost Converter (3.7V → 5V)** | 1 | Regulates voltage for ESP32 | ₹90 | Ensures stable operation from battery |
| 8 | **Resistors (10kΩ)** | 5 | Voltage divider for flex sensors | ₹10 | One per flex sensor |
| 9 | **Resistors (1kΩ – 2.2kΩ)** | 5 | Pull-down resistors for FSR sensors | ₹10 | For stable analog readings |
| 10 | **Jumper Wires (Male-Female)** | — | Connects sensors to ESP32 | ₹50 | For prototyping connections |
| 11 | **Mini Breadboard / PCB** | 1 | Mounting base for testing or soldering | ₹40 | Optional for permanent assembly |

---

## 🔹 Mechanical & Mounting Components

| No. | Component | Quantity | Description | Approx. Cost (INR) | Notes |
|-----|------------|-----------|--------------|---------------------|--------|
| 1 | **Fabric Glove (Right Hand)** | 1 | Base glove for sensor placement | ₹100 | Non-conductive, stretchable material |
| 2 | **Velcro Straps / Threads** | — | To secure sensors & wires on glove | ₹20 | Adjustable & reusable |
| 3 | **3D Printed / Plastic Enclosure** | 1 | Houses ESP32, battery & wiring | ₹100 | Optional but improves ergonomics |
| 4 | **Heat Shrink Tubes / Electrical Tape** | — | For insulation & cable protection | ₹20 | Adds durability and neat finish |

---

## 🔹 Updated Sensor Mapping (Hardware Overview)

| Sensor Type | Quantity | Mounting Location | Purpose |
|--------------|-----------|------------------|----------|
| Flex Sensors | 5 | Along finger length (index → pinky) | Detects bending / gestures |
| Pressure Sensors (FSR) | 5 | On each fingertip | Detects touch or pressure intensity |
| IMU | 1 | Back of the hand / wrist | Captures hand motion, tilt & orientation |
| RGB LED | 1 | Glove surface / enclosure | Indicates system status |

---

## 🔹 Estimated Prototype Cost

| Category | Total (INR) |
|-----------|--------------|
| Electronics | ₹2,200 – ₹2,600 |
| Mechanical | ₹200 – ₹300 |
| **Total Estimated Cost** | **₹2,400 – ₹2,900** |

✅ *This setup achieves a near-production level adaptive gesture glove at minimal cost — ideal for Smart India Hackathon demonstrations.*

---

## 🔹 Key Hardware Highlights

- **10-Sensor Adaptive System**: 5 flex + 5 pressure inputs  
- **BLE-Based Real-Time Transmission** via ESP32  
- **IMU-Assisted Orientation Correction** for gesture stability  
- **RGB LED Feedback** for mode visualization (Training / Success / Error)  
- **Modular & Rechargeable Design** for portability  
- **Future Expansion**: add haptic vibration feedback or force-based control  

---

## 📘 Technical Notes

- Flex & FSR sensors operate within ESP32’s ADC range (0–3.3V).  
- IMU communicates via **I²C** (default pins: GPIO21 → SDA, GPIO22 → SCL).  
- Power system: 3.7V Li-ion → 5V via boost converter.  
- Each flex and pressure sensor forms a **voltage divider circuit** with a resistor.  
- System designed for **adaptive calibration**, allowing retraining or replacement of sensors easily.  

---

**Maintained by:** Team Shunya  
**Version:** Hardware Revision 2.0 (5 Flex + 5 Pressure + IMU)  
**Last Updated:** October 2025  
**Category:** SIH 2025 – Adaptive ISL Smart Glove Hardware Module

