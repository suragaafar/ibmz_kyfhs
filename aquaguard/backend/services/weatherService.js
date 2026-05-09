import { cityCoordinates } from '../data/cityCoordinates.js';

function normalizeLocation(value) {
  return String(value || '').trim().toLowerCase();
}

function resolveCoordinates(location) {
  const target = normalizeLocation(location);

  return Object.entries(cityCoordinates).find(function ([name]) {
    return normalizeLocation(name) === target;
  })?.[1] || null;
}

export async function getWeatherSignal(location) {
  const coords = resolveCoordinates(location);

  if (!coords) {
    return null;
  }

  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${coords.latitude}` +
    `&longitude=${coords.longitude}` +
    '&current=precipitation,rain,showers,weather_code' +
    '&hourly=precipitation_probability,precipitation,rain' +
    '&forecast_days=1' +
    '&timezone=auto';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Open-Meteo request failed');
  }

  const data = await response.json();
  const currentRain = data.current?.rain || 0;
  const currentPrecipitation = data.current?.precipitation || 0;
  const maxPrecipProbability = Math.max(...(data.hourly?.precipitation_probability || [0]));

  let points = 0;
  let type = 'normal_weather';
  let title = 'No major weather-related water risk detected';

  if (currentPrecipitation >= 10 || maxPrecipProbability >= 80) {
    points = 20;
    type = 'flood_warning';
    title = 'Heavy rainfall may increase water contamination risk';
  } else if (currentPrecipitation >= 3 || maxPrecipProbability >= 60) {
    points = 10;
    type = 'rainfall_risk';
    title = 'Moderate rainfall may increase runoff risk';
  }

  return {
    location,
    type,
    title,
    source: 'Open-Meteo Weather API',
    sourceUrl: 'https://open-meteo.com/',
    active: points > 0,
    points,
    raw: {
      currentRain,
      currentPrecipitation,
      maxPrecipProbability
    }
  };
}
