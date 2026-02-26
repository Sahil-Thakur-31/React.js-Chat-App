let chart;   // Global Chart.js instance
let timeout; // Debounce timer for suggestions

// -----------------------------
// Fetch live stock suggestions
// -----------------------------
async function fetchSuggestions(query) {
  const suggestionBox = document.getElementById("suggestions");
  suggestionBox.innerHTML = "";
  suggestionBox.style.display = "none";

  query = query.trim();
  if (query.length < 2) return; // Minimum 2 characters

  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(async () => {
    try {
      const res = await fetch(`/autocomplete?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const results = await res.json();
      if (!results || results.length === 0) return;

      suggestionBox.innerHTML = results
        .map(item => `
          <div class="suggestion-item" onclick="selectSuggestion('${item.symbol}')">
            <b>${item.symbol}</b> – ${item.name}
          </div>
        `).join("");

      suggestionBox.style.display = "block";
    } catch (err) {
      console.error("Autocomplete fetch error:", err);
      suggestionBox.style.display = "none";
    }
  }, 300);
}

// -----------------------------
// Fill input with selected suggestion
// -----------------------------
function selectSuggestion(symbol) {
  const input = document.getElementById("symbol");
  input.value = symbol;
  document.getElementById("suggestions").style.display = "none";
}

// -----------------------------
// Fetch prediction and update UI
// -----------------------------
async function getPrediction() {
  const symbol = document.getElementById("symbol").value.trim() || "AAPL";
  const resultDiv = document.getElementById("result");
  const statsList = document.getElementById("stats-list");

  resultDiv.innerHTML = "<p>⏳ Fetching data...</p>";
  statsList.innerHTML = "";

  try {
    const res = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol })
    });

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    if (!data || !data.prices || data.prices.length === 0) {
      resultDiv.innerHTML = `<p style="color:red;">No data available for symbol: <b>${symbol}</b></p>`;
      return;
    }

    // Display prediction result
    resultDiv.innerHTML = `
      <p><strong>Symbol:</strong> ${data.symbol}</p>
      <p><strong>Latest Price:</strong> ${data.currency}${data.latest_price}</p>
      <p><strong>Predicted Trend:</strong> 
        <span style="color:${data.trend === "Up" ? "green" : "red"};">
          ${data.trend}
        </span>
      </p>
    `;

    // Render chart and statistics
    renderChart(data);
    renderStats(data);

  } catch (err) {
    console.error("Prediction fetch error:", err);
    resultDiv.innerHTML = `<p style="color:red;">⚠️ Error fetching data. Please try again.</p>`;
  }
}

// -----------------------------
// Render Chart.js line chart
// -----------------------------
function renderChart(data) {
  const ctx = document.getElementById("priceChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.dates,
      datasets: [{
        label: `${data.symbol} Price Trend`,
        data: data.prices.map(Number),
        borderColor: data.trend === "Up" ? "#4caf50" : "#e53935",
        backgroundColor: "rgba(0,0,0,0)",
        tension: 0.25,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1000, easing: "easeOutQuart" },
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: ctx => `${data.currency}${ctx.parsed.y}`
          }
        }
      },
      scales: {
        x: { title: { display: true, text: "Date" }, ticks: { maxTicksLimit: 10 } },
        y: { title: { display: true, text: `Price (${data.currency})` }, beginAtZero: false }
      }
    }
  });
}

// -----------------------------
// Render stock statistics
// -----------------------------
function renderStats(data) {
  const statsList = document.getElementById("stats-list");
  const prices = data.prices.map(Number);

  const avg = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
  const min = Math.min(...prices).toFixed(2);
  const max = Math.max(...prices).toFixed(2);

  statsList.innerHTML = `
    <li><strong>Average Price:</strong> ${data.currency}${avg}</li>
    <li><strong>Highest Price:</strong> ${data.currency}${max}</li>
    <li><strong>Lowest Price:</strong> ${data.currency}${min}</li>
    <li><strong>Data Points:</strong> ${prices.length}</li>
  `;
}
