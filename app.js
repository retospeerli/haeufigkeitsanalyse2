const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const germanFrequency = {
  A: 6.51, B: 1.89, C: 3.06, D: 5.08, E: 17.40, F: 1.66,
  G: 3.01, H: 4.76, I: 7.55, J: 0.27, K: 1.21, L: 3.44,
  M: 2.53, N: 9.78, O: 2.51, P: 0.79, Q: 0.02, R: 7.00,
  S: 7.27, T: 6.15, U: 4.35, V: 0.67, W: 1.89, X: 0.03,
  Y: 0.04, Z: 1.13
};

const input = document.getElementById("cipherInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const tableWrap = document.getElementById("tableWrap");

analyzeBtn.addEventListener("click", analyzeText);
clearBtn.addEventListener("click", () => {
  input.value = "";
  clearChart();
  tableWrap.innerHTML = '<p class="empty">Noch keine Analyse vorhanden.</p>';
});

window.addEventListener("load", () => {
  clearChart();
  tableWrap.innerHTML = '<p class="empty">Noch keine Analyse vorhanden.</p>';
});

function normalizeText(text) {
  return text
    .toUpperCase()
    .replace(/Ä/g, "A")
    .replace(/Ö/g, "O")
    .replace(/Ü/g, "U")
    .replace(/ß/g, "SS");
}

function analyzeText() {
  const text = normalizeText(input.value);

  const counts = {};
  alphabet.forEach(letter => counts[letter] = 0);

  let total = 0;

  for (const char of text) {
    if (alphabet.includes(char)) {
      counts[char]++;
      total++;
    }
  }

  if (total === 0) {
    alert("Bitte gib zuerst einen verschlüsselten Text ein.");
    return;
  }

  const textFrequency = {};
  alphabet.forEach(letter => {
    textFrequency[letter] = (counts[letter] / total) * 100;
  });

  drawChart(textFrequency);
  drawTable(counts, textFrequency, total);
}

function clearChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#6b7280";
  ctx.font = "28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Hier erscheint das Säulendiagramm.", canvas.width / 2, canvas.height / 2);
}

function drawChart(textFrequency) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 40;
  const paddingBottom = 70;

  const chartWidth = canvas.width - paddingLeft - paddingRight;
  const chartHeight = canvas.height - paddingTop - paddingBottom;

  const maxValue = 20;
  const groupWidth = chartWidth / alphabet.length;
  const barWidth = groupWidth * 0.32;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#374151";
  ctx.font = "14px Arial";
  ctx.textAlign = "right";

  for (let i = 0; i <= 20; i += 5) {
    const y = paddingTop + chartHeight - (i / maxValue) * chartHeight;

    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(canvas.width - paddingRight, y);
    ctx.stroke();

    ctx.fillText(i + "%", paddingLeft - 8, y + 5);
  }

  alphabet.forEach((letter, index) => {
    const xCenter = paddingLeft + index * groupWidth + groupWidth / 2;

    const textValue = textFrequency[letter];
    const germanValue = germanFrequency[letter];

    const textHeight = (textValue / maxValue) * chartHeight;
    const germanHeight = (germanValue / maxValue) * chartHeight;

    const baseY = paddingTop + chartHeight;

    ctx.fillStyle = "#2563eb";
    ctx.fillRect(
      xCenter - barWidth - 2,
      baseY - textHeight,
      barWidth,
      textHeight
    );

    ctx.fillStyle = "#f97316";
    ctx.fillRect(
      xCenter + 2,
      baseY - germanHeight,
      barWidth,
      germanHeight
    );

    ctx.fillStyle = "#111827";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(letter, xCenter, baseY + 28);
  });

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, paddingTop + chartHeight);
  ctx.lineTo(canvas.width - paddingRight, paddingTop + chartHeight);
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Buchstabenhäufigkeit im Geheimtext im Vergleich zur deutschen Sprache", canvas.width / 2, 28);
}

function drawTable(counts, textFrequency, total) {
  let html = `
    <p><strong>Ausgewertete Buchstaben:</strong> ${total}</p>
    <table>
      <thead>
        <tr>
          <th>Buchstabe</th>
          <th>Anzahl im Geheimtext</th>
          <th>Geheimtext in %</th>
          <th>Deutsch in %</th>
        </tr>
      </thead>
      <tbody>
  `;

  alphabet.forEach(letter => {
    html += `
      <tr>
        <td><strong>${letter}</strong></td>
        <td>${counts[letter]}</td>
        <td>${textFrequency[letter].toFixed(2)}</td>
        <td>${germanFrequency[letter].toFixed(2)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  tableWrap.innerHTML = html;
}
