// API-first risk engine: frontend baseline only.
// Real risk points are merged from backend signals in Dashboard.jsx.

export function calculateWaterRisk(location) {
  return {
    location,
    riskScore: 0,
    riskLevel: 'Safe',
    confidence: 70,
    contributingFactors: [],
    activeAlerts: [],
    matchingReports: [],
    municipality: null,
    floodZone: null,
    status: 'Safe',
    explanation: 'Water status is calculated from live weather, advisories, flood, and report signals.'
  };
}

export default calculateWaterRisk;

export function isCountryQuery(_query) {
  return false;
}

export function calculateCountryRisk(_query) {
  return null;
}