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

function extractAlerts(payload) {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload.alerts)) {
    return payload.alerts;
  }

  if (Array.isArray(payload.warnings)) {
    return payload.warnings;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}

export async function getAlertSignal(location) {
  const coords = resolveCoordinates(location);

  if (!coords) {
    return null;
  }

  const url =
    'https://api.open-meteo.com/v1/alerts' +
    `?latitude=${coords.latitude}` +
    `&longitude=${coords.longitude}` +
    '&timezone=auto' +
    '&language=en';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Open-Meteo alerts request failed');
  }

  const data = await response.json();
  const alerts = extractAlerts(data);

  if (!alerts.length) {
    return {
      location,
      type: 'normal_alerts',
      title: 'No active weather alerts detected',
      source: 'Open-Meteo Alerts API',
      sourceUrl: 'https://open-meteo.com/en/features/alerts',
      active: false,
      points: 0,
      raw: { alerts: [] }
    };
  }

  const strongestAlert = alerts[0] || {};
  const title = strongestAlert.event || strongestAlert.headline || strongestAlert.title || 'Weather alert active';

  return {
    location,
    type: 'weather_alert',
    title,
    source: 'Open-Meteo Alerts API',
    sourceUrl: 'https://open-meteo.com/en/features/alerts',
    active: true,
    points: 15,
    raw: {
      alerts
    }
  };
}
