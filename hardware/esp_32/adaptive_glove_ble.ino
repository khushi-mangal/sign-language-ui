/*
  ==========================================================
   Adaptive ISL Smart Glove – BLE Firmware (Team Shunya)
   ----------------------------------------------------------
   - Reads 5 Flex Sensors + 5 Pressure Sensors (FSR)
   - Reads IMU via I2C (MPU6050 / compatible)
   - Normalizes analog + motion data to 0-100
   - Sends comma-separated data via BLE notify
   - LED feedback for connection / transmission
   - ADC attenuation set for full-range reading on ESP32
  ==========================================================
*/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Wire.h>
#include <MPU6050.h>      // If you use MPU6886/other, replace with appropriate library

// ---------------------------------------------------------------------------
// BLE Service and Characteristic UUIDs
// ---------------------------------------------------------------------------
#define SERVICE_UUID        "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"

// ---------------------------------------------------------------------------
// Pin Definitions (match connections.md)
// ---------------------------------------------------------------------------
// Flex sensors (ADC-capable pins)
const int FLEX1_PIN = 34; // index
const int FLEX2_PIN = 35; // middle
const int FLEX3_PIN = 32; // ring
const int FLEX4_PIN = 33; // little
const int FLEX5_PIN = 36; // thumb (VP)

// Pressure sensors (FSR) - 5 fingertip sensors
const int PRESS1_PIN = 39; // index (VN) - input only ADC
const int PRESS2_PIN = 25; // middle
const int PRESS3_PIN = 26; // ring
const int PRESS4_PIN = 27; // little
const int PRESS5_PIN = 14; // thumb

const int LED_PIN = 2; // onboard LED

// ---------------------------------------------------------------------------
// BLE Variables
// ---------------------------------------------------------------------------
BLEServer* pServer = nullptr;
BLECharacteristic* pCharacteristic = nullptr;
bool deviceConnected = false;

// ---------------------------------------------------------------------------
// IMU Object
// ---------------------------------------------------------------------------
MPU6050 imu;

// ---------------------------------------------------------------------------
// BLE Callbacks
// ---------------------------------------------------------------------------
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("✅ BLE Device Connected");
    digitalWrite(LED_PIN, HIGH);
  }
  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("❌ BLE Device Disconnected");
    digitalWrite(LED_PIN, LOW);
    BLEDevice::startAdvertising();
  }
};

// ---------------------------------------------------------------------------
// Helper: Normalize ADC raw (0-4095) -> 0-100
// You can customize the min/max per-sensor if needed (calibration)
// ---------------------------------------------------------------------------
int normalizeSensor(int rawValue, int minRaw = 200, int maxRaw = 3800) {
  rawValue = constrain(rawValue, minRaw, maxRaw);
  return map(rawValue, minRaw, maxRaw, 0, 100);
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // --- ADC attenuation for better reading range (ESP32) ---
  // Use ADC_11db to read near full 0-3.3V range
  analogSetPinAttenuation(FLEX1_PIN, ADC_11db);
  analogSetPinAttenuation(FLEX2_PIN, ADC_11db);
  analogSetPinAttenuation(FLEX3_PIN, ADC_11db);
  analogSetPinAttenuation(FLEX4_PIN, ADC_11db);
  analogSetPinAttenuation(FLEX5_PIN, ADC_11db);

  analogSetPinAttenuation(PRESS1_PIN, ADC_11db);
  analogSetPinAttenuation(PRESS2_PIN, ADC_11db);
  analogSetPinAttenuation(PRESS3_PIN, ADC_11db);
  analogSetPinAttenuation(PRESS4_PIN, ADC_11db);
  analogSetPinAttenuation(PRESS5_PIN, ADC_11db);

  // --- Initialize IMU (I2C) ---
  Wire.begin(21, 22); // SDA, SCL
  imu.initialize();
  if (imu.testConnection()) {
    Serial.println("🧭 IMU Connected Successfully!");
  } else {
    Serial.println("⚠️ IMU Connection Failed - check wiring & library");
  }

  // --- Initialize BLE ---
  BLEDevice::init("Adaptive_ISL_Glove_IMU");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_READ
                    );
  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  BLEDevice::startAdvertising();

  Serial.println("🟢 BLE Ready — waiting for client...");
}

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
void loop() {
  // If no device connected, poll slowly
  if (!deviceConnected) {
    delay(300);
    return;
  }

  // --- Read analog sensors (raw ADC) ---
  int flex1_raw = analogRead(FLEX1_PIN);
  int flex2_raw = analogRead(FLEX2_PIN);
  int flex3_raw = analogRead(FLEX3_PIN);
  int flex4_raw = analogRead(FLEX4_PIN);
  int flex5_raw = analogRead(FLEX5_PIN);

  int p1_raw = analogRead(PRESS1_PIN);
  int p2_raw = analogRead(PRESS2_PIN);
  int p3_raw = analogRead(PRESS3_PIN);
  int p4_raw = analogRead(PRESS4_PIN);
  int p5_raw = analogRead(PRESS5_PIN);

  // --- Normalize to 0–100 (tweak minRaw/maxRaw if you calibrate sensors) ---
  int n1 = normalizeSensor(flex1_raw);
  int n2 = normalizeSensor(flex2_raw);
  int n3 = normalizeSensor(flex3_raw);
  int n4 = normalizeSensor(flex4_raw);
  int n5 = normalizeSensor(flex5_raw);

  int np1 = normalizeSensor(p1_raw);
  int np2 = normalizeSensor(p2_raw);
  int np3 = normalizeSensor(p3_raw);
  int np4 = normalizeSensor(p4_raw);
  int np5 = normalizeSensor(p5_raw);

 // --- Read IMU accelerometer ---
int16_t axRaw, ayRaw, azRaw;
imu.getAcceleration(&axRaw, &ayRaw, &azRaw);

float ax = axRaw / 16384.0;  // Convert to 'g' units (±2g range)
float ay = ayRaw / 16384.0;
float az = azRaw / 16384.0;


  // --- Build BLE packet (13 values: 5 flex + 5 pressure + 3 IMU) ---
  // Ensure buffer large enough
  char buffer[140];
  // Format: n1,n2,n3,n4,n5,np1,np2,np3,np4,np5,ax,ay,az
  snprintf(buffer, sizeof(buffer),
           "%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%.2f,%.2f,%.2f",
           n1, n2, n3, n4, n5,
           np1, np2, np3, np4, np5,
           ax, ay, az);

  // --- Send data via BLE characteristic notify ---
  pCharacteristic->setValue((uint8_t*)buffer, strlen(buffer));
  pCharacteristic->notify();

  // --- Serial debug output ---
  Serial.print("📡 Sent: ");
  Serial.println(buffer);

  // --- Blink LED briefly to indicate transmission ---
  digitalWrite(LED_PIN, HIGH);
  delay(30);
  digitalWrite(LED_PIN, LOW);

  // Short delay to control transmission frequency (adjustable)
  delay(120); // ~6-7 notifications per second
}


