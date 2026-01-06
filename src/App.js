// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import WeatherCard from "./components/WeatherCard";

const DEFAULT_CITY = "Toronto";

/**
 * Nebula Weather
 * - Simple, responsive weather search UI powered by OpenWeatherMap
 * - Uses CRA proxy (optional) and environment variable for API key
 */
function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

  const fetchWeather = async (cityName) => {
    if (!API_KEY) {
      setWeather(null);
      setError(
        "Missing OpenWeather API key. Create a .env.local file with REACT_APP_OPENWEATHER_KEY=<your_key>."
      );
      return;
    }

    setLoading(true);
    setError("");
    setCity(cityName);

    try {
      const url =
        "https://api.openweathermap.org/data/2.5/weather" +
        `?q=${encodeURIComponent(cityName)}` +
        `&appid=${encodeURIComponent(API_KEY)}` +
        `&units=metric`;

      const res = await fetch(url);

      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
        } catch (_) {}
        throw new Error(msg);
      }

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err?.message || "Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load default city on first render
    fetchWeather(DEFAULT_CITY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    fetchWeather(trimmed);
  };

  return (
    <div className="app-root">
      <div className="app-overlay" />
      <div className="app-shell">
        <header className="app-header">
          <h1 className="app-title">Nebula Weather</h1>
          <p className="app-subtitle">
            Search any city to see real-time conditions and key metrics.
          </p>
        </header>

        <form className="search-bar" onSubmit={handleSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city (e.g., Toronto, Tehran, Vancouver)"
            aria-label="City search"
          />
          <button type="submit" aria-label="Search">
            Search
          </button>
        </form>

        <div className="meta-line" aria-live="polite">
          <span className="pill">City: {city}</span>
          <span className="pill">Units: °C</span>
        </div>

        {loading && <p className="status-text">Loading weather…</p>}
        {error && <p className="status-text error">{error}</p>}

        {!loading && !error && <WeatherCard weather={weather} />}

        <footer className="app-footer">
          <span>Powered by OpenWeatherMap API</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
