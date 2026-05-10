import { calculateRisk, getRiskLevel } from "./riskEngine.js";
import { getWeatherSignal } from "../services/weatherService.js";
import { searchWaterIncidentNewsForLocation } from "../services/newsService.js";

const inflight = new Map();

function normalizeKey(location) {
  return String(location || "")
    .trim()
    .toLowerCase();
}

async function computeLiveAssessment(location) {
  const base = await calculateRisk(location);

  const [weather, newsArticles] = await Promise.all([
    getWeatherSignal(location),
    searchWaterIncidentNewsForLocation(location),
  ]);

  let riskScore = base.riskScore;
  const factors = Array.isArray(base.factors) ? [...base.factors] : [];
  const alerts = Array.isArray(base.alerts) ? [...base.alerts] : [];

  if (weather?.available && weather.points > 0) {
    riskScore += weather.points;
    if (!factors.includes(weather.title)) {
      factors.push(weather.title);
    }
    alerts.unshift({
      id: `weather-open-meteo-${weather.fetchedAt || Date.now()}`,
      location: base.location,
      type: weather.type,
      title: weather.title,
      source: weather.source,
      severity: weather.points >= 20 ? "high" : "medium",
      active: true,
      updatedAt: weather.fetchedAt || new Date().toISOString(),
      sourceUrl: weather.sourceUrl,
    });
  }

  if (riskScore > 100) riskScore = 100;

  const risk = getRiskLevel(riskScore);
  let confidence = base.confidence;
  if (weather?.available) confidence += 4;
  if (newsArticles.length > 0) confidence += 4;
  confidence = Math.max(40, Math.min(98, Math.round(confidence)));

  return {
    ...base,
    risk,
    riskScore,
    factors,
    alerts,
    confidence,
    weather,
    newsArticles,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Single location assessment with live Open-Meteo + NewsAPI signals.
 * Coalesces concurrent requests (e.g. /risk and /summary in parallel).
 */
export async function assessLocationRisk(location) {
  const key = normalizeKey(location);
  if (!key) {
    return computeLiveAssessment(location);
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = computeLiveAssessment(location).finally(function () {
    inflight.delete(key);
  });

  inflight.set(key, promise);
  return promise;
}
