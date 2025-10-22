# 🔗 Connections Guide – Adaptive ISL Smart Glove  
**Team Shunya | Smart India Hackathon 2025**

This document defines the complete **pin connections and circuit overview** for the ESP32-based **Adaptive ISL Smart Glove** prototype.  
It integrates **5 Flex Sensors**, **5 Pressure Sensors**, **1 IMU**, and **1 RGB LED** for adaptive gesture recognition with BLE communication.

---

## 🧠 ESP32 Pin Mapping Overview

| Module | Component | ESP32 Pin | Type | Description |
|---------|------------|------------|------|--------------|
| Flex Sensor 1 | Index Finger | GPIO 34 | Analog Input | Reads bending of index finger |
| Flex Sensor 2 | Middle Finger | GPIO 35 | Analog Input | Reads bending of middle finger |
| Flex Sensor 3 | Ring Finger | GPIO 32 | Analog Input | Reads bending of ring finger |
| Flex Sensor 4 | Little Finger | GPIO 33 | Analog Input | Reads bending of little finger |
| Flex Sensor 5 | Thumb | GPIO 36 (VP) | Analog Input | Reads bending of thumb |
| Pressure Sensor 1 | Index Tip | GPIO 39 (VN) | Analog Input | Detects fingertip pressure (index) |
| Pressure Sensor 2 | Middle Tip | GPIO 25 | Analog Input | Detects fingertip pressure (middle) |
| Pressure Sensor 3 | Ring Tip | GPIO 26 | Analog Input | Detects fingertip pressure (ring) |
| Pressure Sensor 4 | Little Tip | GPIO 27 | Analog Input | Detects fingertip pressure (little) |
| Pressure Sensor 5 | Thumb Tip | GPIO 14 | Analog Input | Detects fingertip pressure (thumb) |
| IMU (SDA) | MPU6886 / MPU9250 / BNO055 | GPIO 21 | I²C Data | Data communication line |
| IMU (SCL) | MPU6886 / MPU9250 / BNO055 | GPIO 22 | I²C Clock | Clock line for I²C |
| RGB LED (R) | Red Channel | GPIO 19 | Digital Output | Indicates “Training Mode” |
| RGB LED (G) | Green Channel | GPIO 18 | Digital Output | Indicates “Success / Ready” |
| RGB LED (B) | Blue Channel | GPIO 5 | Digital Output | Indicates “Error / BLE Connected” |
| Power In | Li-ion Battery (3.7V) | — | Power | Main supply |
| Boost Converter Out | 5V → 3.3V Regulated | VIN / 3.3V | Power | Stable regulated supply to ESP32 |
| Ground | Common GND | GND | Power | Shared ground for all sensors |

---

## ⚡ Sensor Wiring Details

### 🖐 Flex Sensors (x5)
Each flex sensor acts as a **variable resistor**.  
To read the voltage corresponding to bending angle:


- Fixed resistor: **10kΩ**
- Output: **Voltage divider node** to ESP32 analog pin  
- Use separate 10kΩ resistor per flex sensor  

---

### ✋ Pressure Sensors (FSR) (x5)
Each pressure sensor (FSR402 or FSR406) changes resistance based on applied pressure:


- Fixed resistor: **1kΩ–2.2kΩ** (for sensitivity control)
- Output voltage increases with pressure

---

### 🧭 IMU Sensor (MPU6886 / MPU9250 / BNO055)
Connect via I²C interface:

| IMU Pin | Connects To | Notes |
|----------|--------------|-------|
| VCC | 3.3V | Power for IMU |
| GND | GND | Common ground |
| SDA | GPIO 21 | I²C data line |
| SCL | GPIO 22 | I²C clock line |

*Ensure pull-up resistors (4.7kΩ) on SDA/SCL if not built-in.*

---

### 💡 RGB LED (Status Indicator)

| LED Channel | ESP32 Pin | Color | Mode |
|--------------|------------|--------|-------|
| R | GPIO 19 | Red | Training Mode |
| G | GPIO 18 | Green | Success / Stable Gesture |
| B | GPIO 5 | Blue | BLE Active / Error |

Use **220Ω resistor** per color channel to limit current.  
Connect LED’s common cathode to GND.

---

### 🔋 Power Circuit

| Module | Connection | Description |
|---------|-------------|-------------|
| Li-ion Battery (3.7V) | Input to Boost Converter | Power source |
| Boost Converter Output (5V) | VIN of ESP32 | Stable power for ESP32 |
| GND | Common | Must be shared across all modules (sensors, ESP32, IMU) |

✅ *For safety, use a TP4056 charging module with protection.*

---

## 🧩 Circuit Summary Diagram (Text Representation)

┌────────────────────────────────────────────┐
│ ESP32 Board │
│--------------------------------------------│
│ Flex 1 → GPIO34 Pressure 1 → GPIO39 │
│ Flex 2 → GPIO35 Pressure 2 → GPIO25 │
│ Flex 3 → GPIO32 Pressure 3 → GPIO26 │
│ Flex 4 → GPIO33 Pressure 4 → GPIO27 │
│ Flex 5 → GPIO36 Pressure 5 → GPIO14 │
│ IMU SDA → GPIO21 IMU SCL → GPIO22 │
│ RGB LED (R,G,B) → 19,18,5 │
│ Power VIN → 5V (Boost Conv.) │
│ GND → Common Ground │
└────────────────────────────────────────────┘


---

## ✅ Hardware Verification Checklist

| Task | Status |
|------|--------|
| ESP32 receives 10 analog signals (ADC verified) | ☐ |
| IMU recognized via I²C scan (address detected) | ☐ |
| RGB LED blinks correctly in 3 modes | ☐ |
| Power supply stable (no reset under BLE TX) | ☐ |
| All grounds common & noise-free | ☐ |
| Serial BLE data stream verified | ☐ |

---

## 📘 Notes

- All analog sensors operate in **0–3.3V range**.  
- Avoid connecting flex/pressure sensors directly to 5V.  
- Keep sensor wires under **20 cm** to reduce noise.  
- Ensure BLE antenna area (ESP32 top) is **unobstructed** for stable signal.  
- RGB LED acts as a **real-time debug indicator** during demo.

---

**Maintained by:** Team Shunya  
**Version:** Hardware Revision 2.0 (5 Flex + 5 Pressure + IMU + RGB LED)  
**Last Updated:** October 2025  
**Category:** SIH 2025 – Adaptive ISL Smart Glove Hardware Wiring Documentation




