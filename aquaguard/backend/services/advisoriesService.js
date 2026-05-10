import { getAdvisoriesByLocation } from '../data/advisories.js';

function normalizeLocation(value) {
  return String(value || '').trim().toLowerCase();
}

function resolveLocation(location) {
  const target = normalizeLocation(location);

  const advisories = getAdvisoriesByLocation(location);

  return advisories.length > 0 ? location : null;
}

export async function getAdvisorySignal(location) {
  const resolved = resolveLocation(location);

  if (!resolved) {
    return {
      location,
      type: 'normal_advisory',
      title: 'No municipal water advisories detected',
      source: 'Municipal Health Department',
      sourceUrl: 'https://www.canada.ca/en/health-canada/services/drinking-water-advisories.html',
      active: false,
      points: 0,
      raw: { advisories: [] }
    };
  }

  const advisories = getAdvisoriesByLocation(resolved);

  if (!advisories.length) {
    return {
      location,
      type: 'normal_advisory',
      title: 'No municipal water advisories detected',
      source: 'Municipal Health Department',
      sourceUrl: 'https://www.canada.ca/en/health-canada/services/drinking-water-advisories.html',
      active: false,
      points: 0,
      raw: { advisories: [] }
    };
  }

  const strongestAdvisory = advisories[0] || {};
  const typeWeight = {
    boil_water_advisory: 30,
    sewage_overflow_risk: 20,
    contamination_notice: 25
  };

  const points = typeWeight[strongestAdvisory.type] || 15;

  return {
    location,
    type: strongestAdvisory.type || 'advisory',
    title: strongestAdvisory.title,
    source: 'Municipal Health Department',
    sourceUrl: 'https://www.canada.ca/en/health-canada/services/drinking-water-advisories.html',
    active: true,
    points,
    raw: { advisories }
  };
}
