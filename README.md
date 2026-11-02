# Weather App 🌤️

A weather application built with HTML, CSS, and vanilla JavaScript. Search any city to get current conditions and a 6-day forecast.

## 🚀 Live Demo

[https://nicoperiz.github.io/weather-app/](https://nicoperiz.github.io/weather-app/)

## ✨ Features

- Automatic weather detection based on your location
- City search by name
- Current conditions: temperature, humidity, wind speed
- 6-day forecast with min/max temperatures
- Dynamic background color based on weather condition
- Enter key support

## 🛠️ Tech Stack

- HTML
- CSS
- JavaScript (Vanilla)
- [Open-Meteo API](https://open-meteo.com/) — weather data (no API key required)
- [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org/) — city geocoding (no API key required)

## 🎯 Why I Built This

I wanted a simple weather app that works without API keys, and that handles the case where the user denies geolocation. I also wanted to practice async/await, error handling, and responsive design.

## 📚 What I Learned

- Handling asynchronous API calls with `fetch` and `async/await`
- Managing errors (API down, city not found, geolocation denied)
- Building a responsive layout with CSS Grid/Flexbox

## 📌 Notes

No API keys needed — both APIs are free and open. No frameworks or external libraries used.

## 👤 Author

Nico Periz