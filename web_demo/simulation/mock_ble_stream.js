/* ======================================================
   Adaptive ISL Smart Glove — Realistic BLE Simulator (v3)
   ------------------------------------------------------
   🔹 10 sensors (5 flex + 5 pressure) + IMU (3 axes)
   🔹 Dynamic accuracy variation (65–95%)
   🔹 Occasionally simulates "Gesture Not Matched"
   🔹 Works seamlessly with app.js
   ------------------------------------------------------
   Team Shunya | SIH 2025
   ====================================================== */

let streamInterval = null;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 🧩 Generate one BLE packet string with human-like variation
function generatePacket(baseFlex, basePressure, noise, unstable = false) {
  const flex = Array.from({ length: 5 }, () =>
    rand(baseFlex - noise, baseFlex + noise)
  );
  const pressure = Array.from({ length: 5 }, () =>
    rand(basePressure - noise, basePressure + noise)
  );

  // Introduce mismatched readings occasionally
  if (unstable) {
    const i = rand(0, 4);
    flex[i] = rand(40, 100); // random wrong bend
    pressure[i] = rand(30, 90); // random wrong press
  }

  // IMU: slight drift or shaky motion
  const ax = (Math.random() * 0.6 - 0.3).toFixed(2);
  const ay = (Math.random() * 0.6 - 0.3).toFixed(2);
  const az = (0.9 + Math.random() * 0.1).toFixed(2);

  return [...flex, ...pressure, ax, ay, az].join(",");
}

function sendPacket(packet) {
  window.dispatchEvent(new CustomEvent("blePacket", { detail: packet }));
}

// 🎮 Gesture Simulation (triggered by app.js)
window.simulateGesture = function (gesture) {
  clearInterval(streamInterval);

  const configMap = {
    A: { flex: 85, pressure: 65, stability: 0.85, noise: 10 }, // Sing (stable)
    B: { flex: 55, pressure: 40, stability: 0.7, noise: 12 },  // Sleep (less stable)
    C: { flex: 75, pressure: 80, stability: 0.9, noise: 9 },   // Laugh (high but noisy)
  };

  const cfg = configMap[gesture] || { flex: 60, pressure: 50, stability: 0.8, noise: 10 };
  console.log(`🎬 Simulating gesture ${gesture} ...`);

  let frameCount = 0;

  streamInterval = setInterval(() => {
    frameCount++;

    // 15–20% chance of unstable frame (outlier)
    const unstable = Math.random() > cfg.stability;

    const packet = generatePacket(cfg.flex, cfg.pressure, cfg.noise, unstable);
    sendPacket(packet);
  }, 100); // every 100ms (~10 packets/sec)

  setTimeout(() => {
    clearInterval(streamInterval);
    console.log(`🛑 Gesture ${gesture} simulation complete.`);
  }, 1000);
};






