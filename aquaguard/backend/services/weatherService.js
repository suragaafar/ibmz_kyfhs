import { cityCoordinates } from "../data/cityCoordinates.js";

function normalizeLocation(value) {
  return String(value || "").trim().toLowerCase();
}

function resolveCoordinates(location) {
  const target = normalizeLocation(location);

  return (
    Object.entries(cityCoordinates).find(function ([name]) {
      return normalizeLocation(name) === target;
    })?.[1] || null
  );
}

function wmoWeatherLabel(code) {
  const c = Number(code);
  if (Number.isNaN(c)) return "Unknown conditions";
  if (c === 0) return "Clear sky";
  if (c === 1) return "Mainly clear";
  if (c === 2) return "Partly cloudy";
  if (c === 3) return "Overcast";
  if (c === 45 || c === 48) return "Fog";
  if (c >= 51 && c <= 57) return "Drizzle";
  if (c >= 61 && c <= 67) return "Rain";
  if (c >= 71 && c <= 77) return "Snow";
  if (c >= 80 && c <= 82) return "Rain showers";
  if (c === 95 || c === 96 || c === 99) return "Thunderstorm";
  return "Mixed conditions";
}

export async function getWeatherSignal(location) {
  const trimmed = String(location || "").trim();

  const coords = resolveCoordinates(trimmed);
  if (!coords) {
    return {
      available: false,
      location: trimmed,
      message:
        "No coordinates on file for this location. Add it to the city catalog to enable live weather.",
    };
  }

  const fetchedAt = new Date().toISOString();

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${coords.latitude}` +
    `&longitude=${coords.longitude}` +
    "&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,weather_code" +
    "&hourly=precipitation_probability,precipitation,rain" +
    "&forecast_days=1" +
    "&timezone=auto";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        available: false,
        location: trimmed,
        fetchedAt,
        message: "Open-Meteo request failed (HTTP " + response.status + ")",
        error: true,
      };
    }

    const data = await response.json();
    const currentRain = data.current?.rain || 0;
    const currentPrecipitation = data.current?.precipitation || 0;
    const maxPrecipProbability = Math.max(...(data.hourly?.precipitation_probability || [0]));
    const temperature = data.current?.temperature_2m;
    const humidity = data.current?.relative_humidity_2m;
    const weatherCode = data.current?.weather_code;
    const conditionLabel = wmoWeatherLabel(weatherCode);

    let points = 0;
    let type = "normal_weather";
    let title = "No major weather-related water risk detected";

    if (currentPrecipitation >= 10 || maxPrecipProbability >= 80) {
      points = 20;
      type = "flood_warning";
      title = "Heavy rainfall may increase water contamination risk";
    } else if (currentPrecipitation >= 3 || maxPrecipProbability >= 60) {
      points = 10;
      type = "rainfall_risk";
      title = "Moderate rainfall may increase runoff risk";
    }

    const headline =
      temperature != null
        ? `${Math.round(temperature)}°C · ${conditionLabel} · rain ${Number(currentRain).toFixed(1)} mm`
        : `${conditionLabel} · rain ${Number(currentRain).toFixed(1)} mm`;

    return {
      available: true,
      location: trimmed,
      fetchedAt,
      headline,
      conditionLabel,
      temperatureC: temperature,
      humidityPercent: humidity,
      weatherCode,
      currentRainMm: currentRain,
      currentPrecipitationMm: currentPrecipitation,
      maxPrecipitationProbabilityPercent: maxPrecipProbability,
      type,
      title,
      source: "Open-Meteo Weather API",
      sourceUrl: "https://open-meteo.com/",
      active: points > 0,
      points,
      raw: {
        currentRain,
        currentPrecipitation,
        maxPrecipProbability,
        temperature,
        humidity,
        weatherCode,
      },
    };
  } catch (error) {
    return {
      available: false,
      location: trimmed,
      fetchedAt,
      message: error?.message || "Open-Meteo request failed",
      error: true,
    };
  }
}
