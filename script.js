const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("weatherResult");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") button.click();
});

button.addEventListener("click", () => {
  const city = input.value.trim();
  if (!city) {
    showError("Per favore, inserisci una città");
    return;
  }
  fetchGeo(city);
});

window.addEventListener("load", () => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) =>
      fetchWeather(
        pos.coords.latitude,
        pos.coords.longitude,
        "La tua posizione",
        "",
      ),
    () => {},
  );
});

function setLoading(isLoading) {
  button.disabled = isLoading;
  button.innerText = isLoading ? "Caricamento..." : "Cerca";
}

function showError(message) {
  result.innerText = message;
  result.style.backgroundColor = "#f8d7da";
}

async function fetchGeo(city) {
  setLoading(true);
  result.innerText = "🔍 Ricerca città...";
  result.style.backgroundColor = "#e6f0ff";

  try {
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
    );
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      showError("Città non trovata!");
      return;
    }

    const { lat, lon, display_name } = geoData[0];
    const cityName = display_name.split(",")[0];
    const country = display_name.split(",").at(-1).trim();

    result.innerText = "🌤️ Recupero meteo...";
    await fetchWeather(lat, lon, cityName, country);
  } catch (error) {
    showError("Si è verificato un errore. Riprova.");
    console.error(error);
  } finally {
    setLoading(false);
    input.value = "";
  }
}

function getCondition(code) {
  if (code === 0) return { label: "Sereno ☀️", bg: "#ffe066" };
  if (code <= 3) return { label: "Parzialmente nuvoloso ⛅", bg: "#d3d3d3" };
  if (code <= 67) return { label: "Pioggia 🌧️", bg: "#a3c2f2" };
  if (code <= 77) return { label: "Neve ❄️", bg: "#ffffff" };
  return { label: "Temporale ⛈️", bg: "#b0b0b0" };
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

async function fetchWeather(lat, lon, cityName, country) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,windspeed_10m,weathercode,relativehumidity_2m` +
        `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
        `&timezone=auto`,
    );
    const data = await response.json();
    const current = data.current;
    const daily = data.daily;
    const { label, bg } = getCondition(current.weathercode);
    const updatedAt = new Date(current.time).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const forecastHTML = daily.time
      .slice(1, 6)
      .map((date, i) => {
        const { label: dayLabel } = getCondition(daily.weathercode[i + 1]);
        return `
        <div class="forecast-day">
          <span>${formatDate(date)}</span>
          <span>${dayLabel}</span>
          <span>${daily.temperature_2m_max[i + 1]}° / ${daily.temperature_2m_min[i + 1]}°</span>
        </div>
      `;
      })
      .join("");

    result.innerHTML = `
      <h2>${cityName}${country ? ", " + country : ""}</h2>
      <p>🌡️ Temperatura: ${current.temperature_2m}°C</p>
      <p>💧 Umidità: ${current.relativehumidity_2m}%</p>
      <p>🌬️ Vento: ${current.windspeed_10m} km/h</p>
      <p>☁️ Condizione: ${label}</p>
      <p class="updated-at">Aggiornato alle ${updatedAt}</p>
      <div class="forecast">${forecastHTML}</div>
    `;
    result.style.backgroundColor = bg;
  } catch (error) {
    showError("Si è verificato un errore. Riprova.");
    console.error(error);
  }
}
