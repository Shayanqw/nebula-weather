// src/components/WeatherCard.js
import React from "react";

const formatTime = (unixSeconds) => {
  if (!unixSeconds) return "—";
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleString();
};

const toKm = (meters) => {
  if (typeof meters !== "number") return "—";
  return `${(meters / 1000).toFixed(1)} km`;
};

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const name = weather?.name ?? "—";
  const country = weather?.sys?.country ?? "—";

  const main = weather?.main ?? {};
  const wind = weather?.wind ?? {};
  const coord = weather?.coord ?? null;

  const weatherArray = Array.isArray(weather?.weather) ? weather.weather : [];
  const primary = weatherArray[0] ?? {};
  const description = primary?.description ?? "—";
  const icon = primary?.icon ?? null;

  const temp = typeof main?.temp === "number" ? `${Math.round(main.temp)}°C` : "—";
  const feels =
    typeof main?.feels_like === "number" ? `${Math.round(main.feels_like)}°C` : "—";
  const humidity = typeof main?.humidity === "number" ? `${main.humidity}%` : "—";
  const pressure = typeof main?.pressure === "number" ? `${main.pressure} hPa` : "—";
  const windSpeed = typeof wind?.speed === "number" ? `${wind.speed} m/s` : "—";
  const visibility = toKm(weather?.visibility);
  const clouds =
    typeof weather?.clouds?.all === "number" ? `${weather.clouds.all}%` : "—";

  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

  return (
    <div className="weather-card" role="region" aria-label="Weather details">
      <div className="weather-top">
        <div>
          <h2 className="weather-city">
            {name} <span className="muted">({country})</span>
          </h2>
          <p className="weather-updated muted">Updated: {formatTime(weather?.dt)}</p>
        </div>

        {iconUrl ? (
          <img
            className="weather-icon"
            src={iconUrl}
            alt={primary?.main ? `${primary.main} icon` : "Weather icon"}
            width="72"
            height="72"
          />
        ) : null}
      </div>

      <div className="weather-main">
        <div>
          <div className="weather-temp">{temp}</div>
          <div className="weather-feels muted">Feels like {feels}</div>
        </div>
        <div className="weather-desc">
          <div className="weather-desc-title">{primary?.main ?? "—"}</div>
          <div className="muted">{description}</div>
        </div>
      </div>

      <div className="weather-grid">
        <div className="weather-grid-item">
          <p className="label">Humidity</p>
          <p className="value">{humidity}</p>
        </div>

        <div className="weather-grid-item">
          <p className="label">Pressure</p>
          <p className="value">{pressure}</p>
        </div>

        <div className="weather-grid-item">
          <p className="label">Wind</p>
          <p className="value">{windSpeed}</p>
        </div>

        <div className="weather-grid-item">
          <p className="label">Visibility</p>
          <p className="value">{visibility}</p>
        </div>

        <div className="weather-grid-item">
          <p className="label">Clouds</p>
          <p className="value">{clouds}</p>
        </div>

        <div className="weather-grid-item">
          <p className="label">Coords</p>
          <p className="value">
            {coord ? `${coord.lat.toFixed(2)}, ${coord.lon.toFixed(2)}` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
