// ✅ Adaptive ISL Smart Glove Simulation — Smarter Sensor Dashboard (Final Version)

// ---------- Get UI Elements ----------
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");
const accuracyEl = document.getElementById("accuracyDisplay");
const feedbackEl = document.getElementById("feedback");
const sensorContainer = document.getElementById("sensorReadings");

const bars = {
  A: document.getElementById("progA"),
  B: document.getElementById("progB"),
  C: document.getElementById("progC"),
};

// ---------- Training State ----------
let progress = { A: 0, B: 0, C: 0 };

// ---------- Gesture Dictionary ----------
const gestureMeanings = {
  A: "sing",
  B: "sleep",
  C: "laugh",
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
  BAB: "cry",
  BCB: "Hungry 🍔",
  CAC: "Pain 😖",
  CBC: "Care ❤"
};

// ---------- Utility ----------
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randCoord() {
  return (Math.random() * 2 - 1).toFixed(2);
}
function getColor(val) {
  if (val >= 90) return "linear-gradient(90deg,#10b981,#059669)"; // green
  if (val >= 80) return "linear-gradient(90deg,#3b82f6,#2563eb)"; // blue
  return "linear-gradient(90deg,#f87171,#dc2626)"; // red
}

// ---------- Sensor Simulation ----------
function simulateSensors() {
  const sensors = [];

  // Bias sensor values slightly higher for smoother "good" readings
  for (let i = 1; i <= 5; i++) sensors.push({ name: `Flex-${i}`, value: rand(75, 100) });
  for (let i = 1; i <= 5; i++) sensors.push({ name: `Pressure-${i}`, value: rand(70, 98) });

  // IMU (3 axes)
  const imu = { x: randCoord(), y: randCoord(), z: randCoord() };

  renderSensors(sensors, imu);

  // Compute accuracy
  const flexAvg = sensors.filter(s => s.name.includes("Flex")).reduce((a, s) => a + s.value, 0) / 5;
  const pressAvg = sensors.filter(s => s.name.includes("Pressure")).reduce((a, s) => a + s.value, 0) / 5;
  const imuScore = 100 - (Math.abs(imu.x) + Math.abs(imu.y) + Math.abs(imu.z)) * 10; // less strict

  let accuracy = ((flexAvg + pressAvg + imuScore) / 3).toFixed(0);

  // Make readings smoother and more frequent in high range
  const adjusted = Number(accuracy) + rand(-3, 5);
  const finalAcc = Math.max(70, Math.min(100, adjusted));

  accuracyEl.textContent = `Accuracy: ${finalAcc}%`;
  feedbackEl.textContent =
    finalAcc >= 90 ? "🌟 Excellent!" :
    finalAcc >= 85 ? "✅ Good" :
    "⚠ Needs Practice";

  return finalAcc;
}

// ---------- Render Sensors ----------
function renderSensors(sensors, imu) {
  let html = `<h3>Sensor Simulation</h3><div class="sensor-grid">`;

  sensors.forEach(s => {
    const color = getColor(s.value);
    html += `
      <div class="sensor-card">
        <div class="sensor-name">${s.name}</div>
        <div class="sensor-bar" style="background:#f3f4f6;height:10px;border-radius:6px;overflow:hidden;">
          <div class="sensor-fill"
               style="width:${s.value}%;
                      background:${color};
                      height:100%;
                      border-radius:6px;
                      transition:width 0.3s ease;">
          </div>
        </div>
        <div class="sensor-value">${s.value}%</div>
      </div>`;
  });

  html += `</div>
    <div class="imu-section">
      <h4>IMU Sensor (Orientation)</h4>
      <div class="imu-values">
        <div class="imu-axis">X: ${imu.x}</div>
        <div class="imu-axis">Y: ${imu.y}</div>
        <div class="imu-axis">Z: ${imu.z}</div>
      </div>
    </div>`;
  sensorContainer.innerHTML = html;
}

// ---------- Training Logic ----------
function train(gesture) {
  const acc = simulateSensors();
  if (acc >= 80) { // made slightly easier to register progress
    progress[gesture] = Math.min(progress[gesture] + 1, 250);
    updateBars();
  }
}

// ---------- Update Training Progress Bars ----------
function updateBars() {
  Object.keys(progress).forEach(g => {
    const pct = ((progress[g] / 250) * 100).toFixed(1);
    bars[g].innerHTML = `
      <div class="bar-fill"
        style="width:${pct}%;
        background:linear-gradient(90deg,#f472b6,#ec4899);
        height:100%;
        border-radius:12px;
        color:white;
        text-align:center;
        line-height:24px;">
        ${pct}%
      </div>`;
  });
}

// ---------- Gesture Calculator ----------
document.getElementById("calcBtn").onclick = () => {
  const n = parseInt(document.getElementById("calcInput").value);
  const res = document.getElementById("calcResult");
  if (!n || n < 1) {
    res.textContent = "⚠ Please enter a valid number of gestures.";
    return;
  }
  const total = n + n * (n - 1) + n * (n - 1) * (n - 1);
  res.textContent = `With ${n} trained gestures, you can form ${total} unique gesture combinations.`;
  renderPermutationTable();
};

// ---------- Permutation Generator (Max 3, No Repeat Adjacent) ----------
function generateCombos(base) {
  const results = [];
  function helper(cur, remain) {
    if (cur.length > 0 && cur.length <= 3) results.push(cur);
    if (cur.length === 3) return;
    for (let i = 0; i < remain.length; i++) {
      if (cur[cur.length - 1] === remain[i]) continue;
      helper(cur + remain[i], remain);
    }
  }
  helper("", base);
  return results;
}

// ---------- Render Gesture Dictionary Table ----------
function renderPermutationTable() {
  const section = document.getElementById("permSection");
  const base = ["A", "B", "C"];
  const combos = generateCombos(base);
  let html = "<h3>Gesture Vocabulary (Combinations & Meanings)</h3>";
  html += "<table class='meaning-table'><thead><tr><th>Gesture</th><th>Meaning</th></tr></thead><tbody>";

  combos.forEach(c => {
    const meaning = gestureMeanings[c] || "— Not Assigned —";
    html += `<tr><td>${c}</td><td>${meaning}</td></tr>`;
  });

  html += "</tbody></table>";
  section.innerHTML = html;
}

// ---------- Event Listeners ----------
btnA.onclick = () => train("A");
btnB.onclick = () => train("B");
btnC.onclick = () => train("C");

// ---------- Initialize ----------
document.addEventListener("DOMContentLoaded", () => {
  updateBars();
  accuracyEl.textContent = "Accuracy: —";
  feedbackEl.textContent = "Start training!";
  renderPermutationTable();
});