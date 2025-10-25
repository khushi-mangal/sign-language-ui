// ✅ Adaptive ISL Smart Glove — Final Persistent ML Integrated Version (v9.2)
// -----------------------------------------------------------
// • Connects to Python ML WebSocket Server (ws://localhost:8765)
// • 1 gesture = +1 progress unit (max 500)
// • Persistent progress saved in models/progress.json
// • Color-coded progress bars: Red → Yellow → Green
// • Real data + synthetic combos handled automatically
// -----------------------------------------------------------

// ---------- UI ELEMENTS ----------
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");
const feedbackEl = document.getElementById("feedback");
const sensorContainer = document.getElementById("sensorReadings");

const bars = {
  A: document.getElementById("progA"),
  B: document.getElementById("progB"),
  C: document.getElementById("progC"),
};

// ---------- STATE ----------
let progress = { A: 0, B: 0, C: 0 };
let currentGesture = null;
let trainingActive = false;
let ws = null;
let reconnectTimer = null;

// ---------- GESTURE MEANINGS ----------
const gestureMeanings = {
  A: "Sing 🎵",
  B: "Sleep 😴",
  C: "Laugh 😂",
  AB: "Drink 🥤",
  AC: "Help 🆘",
  BA: "Stop ✋",
  BC: "Eat 🍽",
  CA: "Ready 💪",
  CB: "Wait ⏳",
  ABC: "Good 👍",
  ACB: "Thank You 🙏",
  BAC: "Warning ⚠",
  BCA: "Question ❓",
  CAB: "Start ▶",
  CBA: "Bad 👎",
  ABA: "Water 💧",
  ACA: "Support 🤝",
  BAB: "Cry 😢",
  BCB: "Hungry 🍔",
  CAC: "Pain 😖",
  CBC: "Care ❤",
};

// ===================================================
// 🔗 CONNECT TO PYTHON ML SERVER
// ===================================================
function connectMLServer() {
  ws = new WebSocket("ws://localhost:8765");

  ws.onopen = () => {
    console.log("✅ Connected to ML server");
    feedbackEl.textContent = "🧠 ML server connected!";
    requestDataSummary();
  };

  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      if (msg.type === "status") {
        feedbackEl.textContent = msg.msg;
      } else if (msg.type === "summary") {
        handleSummary(msg.counts);
      } else if (msg.type === "prediction") {
        handleMLPrediction(msg);
      }
    } catch (err) {
      console.warn("⚠️ Invalid message from ML server:", err);
    }
  };

  ws.onclose = () => {
    console.warn("⚠️ ML server disconnected, retrying...");
    feedbackEl.textContent = "⚠️ ML server disconnected — reconnecting...";
    reconnectTimer = setTimeout(connectMLServer, 2000);
  };
}

connectMLServer();

// ===================================================
// 🧩 SEND COMMANDS TO ML SERVER
// ===================================================
function sendCommand(cmd, payload = {}) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ cmd, ...payload }));
}

// ===================================================
// ⚙️ TRAINING LOGIC (Single-label training)
// ===================================================
function startTraining(gesture) {
  if (trainingActive) {
    feedbackEl.textContent = "⏳ Wait... training already in progress.";
    return;
  }

  trainingActive = true;
  currentGesture = gesture;
  feedbackEl.textContent = `🧠 Collecting data for gesture ${gesture}...`;

  if (window.simulateGesture) simulateGesture(gesture); // optional simulation
  sendCommand("start_label", { label: gesture, duration_ms: 1000 });

  // Training ends after 1 second
  setTimeout(() => {
    trainingActive = false;
    feedbackEl.textContent = `✅ Gesture ${gesture} data saved!`;
    requestDataSummary(); // Refresh progress bars
  }, 1200);
}

// ===================================================
// 📊 PROGRESS BAR UPDATER (POLISHED UI)
// ===================================================
function updateBars() {
  Object.keys(progress).forEach((g) => {
    const val = Math.min(progress[g], 500);
    const pct = (val / 500) * 100;
    const color = getProgressColor(val);

    bars[g].innerHTML = `
      <div style="
        position: relative;
        width: 100%;
        height: 30px;
        background: #f3f4f6;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: inset 0 0 6px rgba(0,0,0,0.05);
      ">
        <div style="
          width: ${pct}%;
          height: 100%;
          background: ${color};
          border-radius: 16px;
          transition: width 0.5s ease-in-out;
        "></div>
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.3px;
          color: ${val > 40 ? "white" : "#374151"};
          text-shadow: ${val > 40 ? "0 0 4px rgba(0,0,0,0.25)" : "none"};
        ">
          ${val}/500
        </div>
      </div>
    `;
  });
}

// Dynamic color based on training level
function getProgressColor(val) {
  if (val < 150) return "linear-gradient(90deg,#f87171,#dc2626)";
  if (val < 350) return "linear-gradient(90deg,#facc15,#f59e0b)";
  return "linear-gradient(90deg,#10b981,#059669)";
}

// ===================================================
// 📊 FETCH DATASET SUMMARY FROM SERVER (Persistent)
// ===================================================
function requestDataSummary() {
  sendCommand("get_summary");
}

function handleSummary(counts) {
  if (!counts) return;
  console.log("📊 Dataset counts:", counts);
  progress = counts; // Load persistent data from server
  updateBars();
}

// ===================================================
// 🔮 HANDLE ML PREDICTIONS (Optional future use)
// ===================================================
let sequenceBuffer = [];
let sequenceTimeout = null;

function handleMLPrediction(pred) {
  if (!pred || pred.conf < 0.55) return;
  console.log("🤖 Prediction:", pred.label, Math.round(pred.conf * 100) + "%");

  sequenceBuffer.push({ label: pred.label, ts: pred.ts });
  feedbackEl.textContent = `🤖 Predicted: ${pred.label} (${Math.round(
    pred.conf * 100
  )}%)`;

  processSequenceIfTimeout();
}

function processSequenceIfTimeout() {
  if (sequenceTimeout) clearTimeout(sequenceTimeout);
  sequenceTimeout = setTimeout(() => finalizeSequence(), 1000);
}

function finalizeSequence() {
  if (sequenceBuffer.length === 0) return;
  const seq = sequenceBuffer.map((x) => x.label).join("");
  const meaning = gestureMeanings[seq] || "— Unknown —";
  feedbackEl.textContent = `✨ Sequence: ${seq} → ${meaning}`;
  sequenceBuffer = [];
}

// ===================================================
// 🗂️ GESTURE MEANINGS DISPLAY (for UI reference)
// ===================================================
function renderGestureList() {
  const container = document.getElementById("gestureList");
  if (!container) return;
  container.innerHTML = "";

  Object.entries(gestureMeanings).forEach(([key, meaning]) => {
    const div = document.createElement("div");
    div.style = `
      background: #f3f4f6;
      border-radius: 12px;
      padding: 10px;
      text-align: center;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: 0.2s;
    `;
    div.innerHTML = `<b>${key}</b><br>${meaning}`;
    container.appendChild(div);
  });
}

// ===================================================
// 🧠 OPTIONAL BLE DATA SIMULATION LISTENER
// ===================================================
window.addEventListener("blePacket", (event) => {
  const p = event.detail.split(",");
  if (p.length < 13) return;

  const sensors = [
    { name: "Flex-1", value: +p[0] },
    { name: "Flex-2", value: +p[1] },
    { name: "Flex-3", value: +p[2] },
    { name: "Flex-4", value: +p[3] },
    { name: "Flex-5", value: +p[4] },
    { name: "Pressure-1", value: +p[5] },
    { name: "Pressure-2", value: +p[6] },
    { name: "Pressure-3", value: +p[7] },
    { name: "Pressure-4", value: +p[8] },
    { name: "Pressure-5", value: +p[9] },
  ];
  const imu = { x: +p[10], y: +p[11], z: +p[12] };

  renderSensors(sensors, imu);

  // Send sensor data only during active training
  if (trainingActive && currentGesture) {
    const numericValues = sensors.map((s) => s.value);
    numericValues.push(imu.x, imu.y, imu.z);
    sendCommand("packet", { values: numericValues });
  }
});

// ===================================================
// 🎨 RENDER SENSOR DATA (optional visualization)
// ===================================================
function renderSensors(sensors, imu) {
  let html = `<h3>Sensor Readings</h3><div class="sensor-grid">`;
  sensors.forEach((s) => {
    html += `
      <div class="sensor-card">
        <div class="sensor-name">${s.name}</div>
        <div class="sensor-bar">
          <div class="sensor-fill" style="width:${s.value}%;background:${getColor(
      s.value
    )};"></div>
        </div>
        <div class="sensor-value">${s.value}%</div>
      </div>`;
  });
  html += `</div>
  <div class="imu-section">
    <h4>IMU (Orientation)</h4>
    <div class="imu-values">
      <div class="imu-axis">X: ${imu.x}</div>
      <div class="imu-axis">Y: ${imu.y}</div>
      <div class="imu-axis">Z: ${imu.z}</div>
    </div>
  </div>`;
  sensorContainer.innerHTML = html;
}

function getColor(v) {
  if (v >= 90) return "linear-gradient(90deg,#10b981,#059669)";
  if (v >= 80) return "linear-gradient(90deg,#3b82f6,#2563eb)";
  return "linear-gradient(90deg,#f87171,#dc2626)";
}

// ===================================================
// 🧮 GESTURE CALCULATOR (n + n*(n-1) + n*(n-1)*(n-1))
// ===================================================
document.getElementById("calcBtn").addEventListener("click", () => {
  const n = parseInt(document.getElementById("calcInput").value);
  const resultEl = document.getElementById("calcResult");

  if (isNaN(n) || n < 1) {
    resultEl.textContent = "⚠️ Please enter a valid number (1–10)";
    return;
  }

  const total = n + n * (n - 1) + n * (n - 1) * (n - 1);
  resultEl.innerHTML = `
    <b>Total possible unique gesture combinations:</b><br>
    ${n} + ${n}×(${n}-1) + ${n}×(${n}-1)×(${n}-1) = <b>${total}</b>
  `;
});

// ===================================================
// 🚀 INIT
// ===================================================
btnA.onclick = () => startTraining("A");
btnB.onclick = () => startTraining("B");
btnC.onclick = () => startTraining("C");

document.addEventListener("DOMContentLoaded", () => {
  updateBars();
  feedbackEl.textContent = "Connecting to ML server...";
  requestDataSummary();
  renderGestureList(); // 👈 Added to show gesture meanings
});





















