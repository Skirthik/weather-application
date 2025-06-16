const apiKey = "265b5ad972f5504a012892b5250d6d72";

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name!");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod !== 200) throw new Error(data.message);

    displayWeather(data);
    getForecast(city);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function displayWeather(data) {
  const weatherInfo = document.getElementById("weatherInfo");
  weatherInfo.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡️ Temperature: ${data.main.temp} °C</p>
    <p>☁️ Condition: ${data.weather[0].description}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬️ Wind: ${data.wind.speed} m/s</p>
  `;
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "<h3>5-Day Forecast</h3>";

    for (let i = 0; i < data.list.length; i += 8) {
      const item = data.list[i];
      const date = new Date(item.dt_txt).toDateString();
      forecastDiv.innerHTML += `
        <p><strong>${date}</strong>: ${item.main.temp} °C - ${item.weather[0].description}</p>
      `;
    }
  } catch (err) {
    console.error("Forecast error:", err);
  }
}

async function getLocationWeather() {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      displayWeather(data);
      getForecast(data.name);
    } catch (error) {
      alert("Failed to fetch weather from location.");
    }
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Autocomplete basic suggestions
const suggestions = ["London", "Paris", "New York", "Tokyo", "Delhi", "Mumbai", "Chennai", "Sydney", "Toronto", "Berlin"];
const datalist = document.getElementById("suggestions");
suggestions.forEach(city => {
  const option = document.createElement("option");
  option.value = city;
  datalist.appendChild(option);
});