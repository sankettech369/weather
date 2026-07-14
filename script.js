// 1. Paste your OpenWeatherMap API key below (get one free at openweathermap.org/api)
const API_KEY = "a39322bfe2ebe83b8d68f3c1986310d1";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

let currentUnit = "metric"; // "metric" = Celsius, "imperial" = Fahrenheit
let lastData = null;

searchBtn.addEventListener("click", () => fetchWeather(cityInput.value.trim()));
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchWeather(cityInput.value.trim());
});

async function fetchWeather(city) {
  if (!city) {
    renderMessage("Enter a city name to begin.");
    return;
  }
  if (API_KEY === "YOUR_API_KEY_HERE") {
    renderMessage("Add your OpenWeatherMap API key in script.js before searching.", true);
    return;
  }

  renderMessage("Loading...");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        renderMessage(`Couldn't find "${city}". Check the spelling and try again.`, true);
      } else {
        renderMessage("Something went wrong fetching the weather. Try again shortly.", true);
      }
      return;
    }

    const data = await response.json();
    lastData = data;
    renderWeather(data);
  } catch (err) {
    renderMessage("Network error. Check your connection and try again.", true);
  }
}

function renderMessage(text, isError = false) {
  result.innerHTML = `<div class="message ${isError ? "error" : ""}">${text}</div>`;
}

function renderWeather(data) {
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
  const windUnit = currentUnit === "metric" ? "m/s" : "mph";
  const icon = weatherEmoji(data.weather[0].main);
  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: "long", month: "short", day: "numeric"
  });

  result.innerHTML = `
    <div class="card">
      <div class="city">${data.name}, ${data.sys.country}</div>
      <div class="date">${dateStr}</div>

      <div class="temp-row">
        <div class="icon">${icon}</div>
        <div class="temp">${Math.round(data.main.temp)}${unitSymbol}</div>
      </div>
      <div class="condition">${data.weather[0].description}</div>

      <div class="details">
        <div>
          <div class="detail-label">Feels like</div>
          <div class="detail-value">${Math.round(data.main.feels_like)}${unitSymbol}</div>
        </div>
        <div>
          <div class="detail-label">Humidity</div>
          <div class="detail-value">${data.main.humidity}%</div>
        </div>
        <div>
          <div class="detail-label">Wind</div>
          <div class="detail-value">${data.wind.speed} ${windUnit}</div>
        </div>
      </div>

      <div class="unit-toggle">
        <button id="cBtn" class="${currentUnit === "metric" ? "active" : ""}">°C</button>
        <button id="fBtn" class="${currentUnit === "imperial" ? "active" : ""}">°F</button>
      </div>
    </div>
  `;

  document.getElementById("cBtn").addEventListener("click", () => switchUnit("metric"));
  document.getElementById("fBtn").addEventListener("click", () => switchUnit("imperial"));
}

function switchUnit(unit) {
  if (unit === currentUnit) return;
  currentUnit = unit;
  if (lastData) fetchWeather(lastData.name);
}

function weatherEmoji(main) {
  const map = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Haze: "🌫️"
  };
  return map[main] || "🌡️";
}

renderMessage("Enter a city name to begin.");