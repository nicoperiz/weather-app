// === Selezione elementi HTML ===
const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("weatherResult");

// === Inserisci qui la tua chiave API di OpenWeatherMap ===
const API_KEY = "YOUR_API_KEY"; // inserisci qui la tua API key

// === Evento click sul bottone ===
button.addEventListener("click", () => {
  const city = input.value.trim();
  if (!city) {
    result.innerText = "Per favore, inserisci una città";
    result.style.backgroundColor = "#f8d7da";
    return;
  }

  // Chiamiamo la geocoding API
  fetchGeo(city);
});

// === Funzione per la Geocoding API ===
async function fetchGeo(city) {
  try {
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );

    if (!geoResponse.ok) {
      result.innerText = "Città non trovata!";
      result.style.backgroundColor = "#f8d7da";
      return;
    }

    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      result.innerText = "Città non trovata!";
      result.style.backgroundColor = "#f8d7da";
      return;
    }

    // Prendiamo il primo risultato
    const { lat, lon, name, country } = geoData[0];

    // Chiamiamo la API meteo vera e propria
    fetchWeather(lat, lon, name, country);

  } catch (error) {
    result.innerText = "Si è verificato un errore. Riprova.";
    result.style.backgroundColor = "#f8d7da";
    console.error(error);
  }
}

// === Funzione per la API meteo ===
async function fetchWeather(lat, lon, cityName, countryCode) {
  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`
    );

    if (!weatherResponse.ok) {
      result.innerText = "Errore nel recupero meteo!";
      result.style.backgroundColor = "#f8d7da";
      return;
    }

    const data = await weatherResponse.json();

    // Colore dinamico secondo la condizione meteo
    let bgColor = "#e6f0ff";
    const condition = data.weather[0].main.toLowerCase();

    if (condition.includes("cloud")) bgColor = "#d3d3d3";
    else if (condition.includes("rain")) bgColor = "#a3c2f2";
    else if (condition.includes("clear")) bgColor = "#ffe066";
    else if (condition.includes("snow")) bgColor = "#ffffff";

    // Mostra informazioni meteo
    result.innerHTML = `
      <h2>${cityName}, ${countryCode}</h2>
      <p>🌡️ Temperatura: ${data.main.temp}°C</p>
      <p>🌬️ Vento: ${data.wind.speed} m/s</p>
      <p>☁️ Condizione: ${data.weather[0].description}</p>
    `;
    result.style.backgroundColor = bgColor;

  } catch (error) {
    result.innerText = "Si è verificato un errore. Riprova.";
    result.style.backgroundColor = "#f8d7da";
    console.error(error);
  }
}
