import { ALERT_WEIGHTS, alerts, reports } from "../data/mockStore.js";
import { getFloodSignal } from "../services/floodService.js";
import { getGovernmentAdvisorySignal } from "../services/govAdvisoriesService.js";
import { getWeatherSignal } from "../services/weatherService.js";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getRiskLevel(score) {
  if (score <= 30) return "Safe";
  if (score <= 65) return "Caution";
  return "Unsafe";
}

function hoursAgo(isoTimestamp) {
  if (!isoTimestamp) return Number.POSITIVE_INFINITY;
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) return Number.POSITIVE_INFINITY;
  return (Date.now() - parsed) / 3_600_000;
}

function temporalReportPoints(report) {
  const severityBase = {
    low: 4,
    medium: 7,
    high: 10,
  };

  const ageHours = hoursAgo(report.timestamp);
  const base = severityBase[String(report.severity || "medium").toLowerCase()] || 6;

  if (!Number.isFinite(ageHours)) return base;
  const decay = Math.exp(-ageHours / 72);
  return Math.max(1, Math.round(base * decay));
}

function getExternalEndpointSignal(location, envKey) {
  const url = String(process.env[envKey] || "").trim();
  if (!url) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(url.replace(/\/$/, "") + `?location=${encodeURIComponent(location)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: controller.signal,
  })
    .then(async (resp) => {
      clearTimeout(timeout);
      if (!resp.ok) return null;
      const payload = await resp.json();
      const points = Number(payload?.points || payload?.riskPoints || 0);
      return {
        active: Boolean(payload?.active) || points > 0,
        points,
        type: String(payload?.type || "external_signal"),
        title: String(payload?.title || payload?.message || "External signal"),
        source: String(payload?.source || envKey),
        sourceUrl: String(payload?.sourceUrl || payload?.url || url),
      };
    })
    .catch(() => {
      clearTimeout(timeout);
      return null;
    });
}

async function getExternalSignals(location) {
  const [weather, govAdvisory, flood, imdSignal, municipalSignal, floodGisSignal] = await Promise.all([
    getWeatherSignal(location).catch(() => null),
    getGovernmentAdvisorySignal(location).catch(() => null),
    getFloodSignal(location).catch(() => null),
    getExternalEndpointSignal(location, "IMD_RAINFALL_API_URL"),
    getExternalEndpointSignal(location, "MUNICIPAL_ADVISORY_API_URL"),
    getExternalEndpointSignal(location, "FLOOD_GIS_API_URL"),
  ]);

  return [weather, govAdvisory, flood, imdSignal, municipalSignal, floodGisSignal].filter(Boolean);
}

export async function calculateRisk(location) {
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
  const scoreBreakdown = [];
  const sources = [];

  for (const type of uniqueAlertTypes) {
    const points = ALERT_WEIGHTS[type] || 0;
    if (points > 0) {
      riskScore += points;
      factors.push(type.replace(/_/g, " "));
      scoreBreakdown.push({ label: type.replace(/_/g, " "), points });
    }
  }

  for (const alert of activeAlerts) {
    sources.push({
      kind: "alert",
      title: alert.title,
      source: alert.source,
      sourceUrl: alert.sourceUrl || null,
      updatedAt: alert.updatedAt,
      points: ALERT_WEIGHTS[alert.type] || 0,
      origin: "mock",
    });
  }

  const reportPoints = matchingReports.reduce((total, report) => total + temporalReportPoints(report), 0);
  const reportPointsCapped = Math.min(25, reportPoints);
  if (matchingReports.length > 1) {
    riskScore += reportPointsCapped;
    factors.push("multiple community reports");
  } else if (matchingReports.length === 1) {
    riskScore += reportPointsCapped;
    factors.push("single community report");
  }

  if (reportPointsCapped > 0) {
    scoreBreakdown.push({ label: "community reports (time-weighted)", points: reportPointsCapped });
  }

  for (const report of matchingReports) {
    sources.push({
      kind: "report",
      title: report.issueType,
      source: report.submittedBy || "Community",
      sourceUrl: null,
      updatedAt: report.timestamp,
      points: temporalReportPoints(report),
      origin: "community",
    });
  }

  const externalSignals = await getExternalSignals(location);
  for (const signal of externalSignals) {
    const points = Number(signal.points || 0);
    if (!signal.active || points <= 0) {
      continue;
    }
    riskScore += points;
    factors.push(String(signal.type || "external signal").replace(/_/g, " "));
    scoreBreakdown.push({ label: String(signal.type || "external signal").replace(/_/g, " "), points });
    sources.push({
      kind: "external",
      title: signal.title,
      source: signal.source,
      sourceUrl: signal.sourceUrl || null,
      updatedAt: new Date().toISOString(),
      points,
      origin: "external",
    });
  }

  if (riskScore > 100) riskScore = 100;

  const confidenceBase =
    42 +
    activeAlerts.length * 15 +
    (matchingReports.length > 0 ? 8 : 0) +
    Math.min(18, externalSignals.filter((item) => item.active && Number(item.points || 0) > 0).length * 6);
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
