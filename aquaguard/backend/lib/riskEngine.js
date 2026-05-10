import { ALERT_WEIGHTS, alerts, reports } from "../data/mockStore.js";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getRiskLevel(score) {
  if (score <= 30) return "Safe";
  if (score <= 65) return "Caution";
  return "Unsafe";
}

export function calculateRisk(location) {
  const target = normalize(location);

  const activeAlerts = alerts.filter((alert) => {
    return alert.active && normalize(alert.location).includes(target);
  });

  const matchingReports = reports.filter((report) => {
    return normalize(report.location).includes(target);
  });

  const uniqueAlertTypes = new Set(activeAlerts.map((item) => item.type));

  let riskScore = 0;
  const factors = [];

  for (const type of uniqueAlertTypes) {
    const points = ALERT_WEIGHTS[type] || 0;
    if (points > 0) {
      riskScore += points;
      factors.push(type.replace(/_/g, " "));
    }
  }

  if (matchingReports.length > 1) {
    riskScore += 10;
    factors.push("multiple community reports");
  } else if (matchingReports.length === 1) {
    riskScore += 5;
    factors.push("single community report");
  }

  if (riskScore > 100) riskScore = 100;

  const confidenceBase = 45 + activeAlerts.length * 18 + (matchingReports.length > 0 ? 8 : 0);
  const confidence = Math.max(40, Math.min(98, Math.round(confidenceBase)));

  return {
    location,
    risk: getRiskLevel(riskScore),
    confidence,
    riskScore,
    factors,
    alerts: activeAlerts,
    reports: matchingReports,
    generatedAt: new Date().toISOString(),
  };
}
