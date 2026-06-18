import React, { useState, useRef } from "react";
import { FaTemperatureHigh } from "react-icons/fa";

function WeatherApp() {

const [city, setCity] = useState("");
const [weather, setWeather] = useState(null);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const inputRef = useRef(null);


async function handleAddItem() {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    setError("This input is empty");
    setWeather(null);
    inputRef.current?.focus();
    return;
  }

  try {
  setError("");
  setWeather(null);
  setLoading(true);

  const apiKey = "7ef92fd70bd3131cd258ccd40e80113f";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!response.ok) {
    setError("City not found");
    setWeather(null);
    return;
  }

  const data = await response.json();

  console.log(data);

  setWeather(data);
  setCity("");

  } catch (error) {
    setError("Something went wrong");
  } finally {
    setLoading(false);
    inputRef.current?.focus();
  }
};

return (
  <div className="weather-container">
    <div className="search-box">
    <input ref={inputRef} value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" &&handleAddItem()} />
    <button className="search-btn" onClick={handleAddItem}>Search</button>
    </div>
    <div className="result-area">
    {loading && <div className="spinner"></div>}
    {error && <p>{error}</p>}
    {weather && (
  <div className="temp-box">
  <h2 className="city-info">{weather.name.replace(" Province", "")}</h2>
  <p className="degree-info"> <FaTemperatureHigh className="temp-icon" /> <span>{weather.main.temp}°C</span></p>
  <p className="weather-info">{weather.weather[0].description}</p>
  </div>
  )}
  </div>
  </div>
);
}

export default WeatherApp;