import { ALERT_WEIGHTS, alerts, reports } from "../data/mockStore.js";
import { getFloodSignal } from "../services/floodService.js";
import { getGovernmentAdvisorySignal } from "../services/govAdvisoriesService.js";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

/** * Overrides to ensure the specific "Better Ratings" from your table 
 * are applied regardless of current mock data.
 */
const countryOverrides = {
  "china": 75,         // Medium-High
  "united states": 35, // Medium-Low
  "brazil": 70,        // Medium-High
  "saudi arabia": 50,  // Medium
  "mexico": 72,        // Medium-High
  "south africa": 78,  // Medium-High
  "indonesia": 90,     // High
  "bangladesh": 95,    // High
  "japan": 15,         // Low
  "norway": 10,        // Low
  "canada": 12,        // Low
  "australia": 18      // Low
};

/** Map common variants to one key so "Bangalore, IN" matches "Bengaluru, KA" in mock data. */
const CANONICAL_CITY = {
  bengaluru: "bangalore",
  bangalore: "bangalore",
  bombay: "mumbai",
  mumbai: "mumbai",
  "new delhi": "delhi",
  delhi: "delhi",
};

function primaryCityPart(normalizedLocation) {
  const segment = normalize(normalizedLocation).split(",")[0].trim();
  return CANONICAL_CITY[segment] || segment;
}

export function locationMatchesQuery(storedLocation, queryLocation) {
  const a = normalize(storedLocation);
  const q = normalize(queryLocation);
  if (!q) return false;
  if (a.includes(q) || q.includes(a)) return true;
  return primaryCityPart(a) === primaryCityPart(q);
}

/**
 * Updated to reflect the 5-tier classification system:
 * High, Medium-High, Medium, Medium-Low, Low
 */
export function getRiskLevel(score) {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium-High";
  if (score >= 40) return "Medium";
  if (score >= 25) return "Medium-Low";
  return "Low";
}

function hoursAgo(isoTimestamp) {
  if (!isoTimestamp) return Number.POSITIVE_INFINITY;
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) return Number.POSITIVE_INFINITY;
  return (Date.now() - parsed) / 3_600_000;
}

function temporalReportPoints(report) {
  const severityBase = { low: 4, medium: 7, high: 10 };
  const ageHours = hoursAgo(report.timestamp);
  const base = severityBase[String(report.severity || "medium").toLowerCase()] || 6;
  if (!Number.isFinite(ageHours)) return base;
  const decay = Math.exp(-ageHours / 72);
  return Math.max(1, Math.round(base * decay));
}

async function getExternalSignals(location) {
  const [govAdvisory, flood] = await Promise.all([
    getGovernmentAdvisorySignal(location).catch(() => null),
    getFloodSignal(location).catch(() => null),
  ]);
  return [govAdvisory, flood].filter(Boolean);
}

export async function calculateRisk(location) {
  const target = normalize(location);

  const activeAlerts = alerts.filter((alert) => {
    return alert.active && locationMatchesQuery(alert.location, location);
  });

  const matchingReports = reports.filter((report) => {
    return locationMatchesQuery(report.location, location);
  });

  const uniqueAlertTypes = new Set(activeAlerts.map((item) => item.type));

  let riskScore = 0;
  const factors = [];
  const scoreBreakdown = [];
  const sources = [];

  // Calculate scores from active alerts
  for (const type of uniqueAlertTypes) {
    const points = ALERT_WEIGHTS[type] || 0;
    if (points > 0) {
      riskScore += points;
      factors.push(type.replace(/_/g, " "));
      scoreBreakdown.push({ label: type.replace(/_/g, " "), points });
    }
  }

  // Community report scoring
  const reportPoints = matchingReports.reduce((total, report) => total + temporalReportPoints(report), 0);
  const reportPointsCapped = Math.min(25, reportPoints);
  if (reportPointsCapped > 0) {
    riskScore += reportPointsCapped;
    factors.push(matchingReports.length > 1 ? "multiple community reports" : "single community report");
    scoreBreakdown.push({ label: "community reports (time-weighted)", points: reportPointsCapped });
  }

  // Apply specific country overrides from your table
  if (countryOverrides[target]) {
    riskScore = countryOverrides[target];
  }

  if (riskScore > 100) riskScore = 100;

  const confidenceBase = 42 + activeAlerts.length * 15 + (matchingReports.length > 0 ? 8 : 0);
  const confidence = Math.max(40, Math.min(98, Math.round(confidenceBase)));

  return {
    location,
    risk: getRiskLevel(riskScore),
    confidence,
    riskScore,
    factors,
    scoreBreakdown,
    sources,
    alerts: activeAlerts,
    reports: matchingReports,
    generatedAt: new Date().toISOString(),
  };
}