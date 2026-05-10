export const ALERT_WEIGHTS = {
  boil_water_advisory: 50,
  flood_warning: 20,
  sewage_overflow_risk: 15,
};

export const alerts = [
  {
    id: 1,
    location: "Mumbai, MH",
    type: "flood_warning",
    title: "IMD heavy rainfall warning for Mumbai coastal belt",
    source: "India Meteorological Department",
    severity: "high",
    active: true,
    updatedAt: "2026-05-09T05:00:00Z",
  },
  {
    id: 2,
    location: "Delhi, DL",
    type: "boil_water_advisory",
    title: "Precautionary boil-water advisory due to treatment disruption",
    source: "Delhi Jal Board",
    severity: "high",
    active: true,
    updatedAt: "2026-05-09T06:10:00Z",
  },
  {
    id: 3,
    location: "Bengaluru, KA",
    type: "sewage_overflow_risk",
    title: "Lake overflow linked sewage risk in Bellandur basin",
    source: "KSPCB",
    severity: "medium",
    active: true,
    updatedAt: "2026-05-09T04:20:00Z",
  },
  {
    id: 4,
    location: "Windsor, ON",
    type: "flood_warning",
    title: "Flood warning in low-lying neighborhoods",
    source: "Environment Canada",
    severity: "high",
    active: true,
    updatedAt: "2026-05-09T07:10:00Z",
  },
];

export const reports = [
  {
    id: 1,
    location: "Mumbai, MH",
    issueType: "brown water",
    description: "Brown water reported after overnight flooding.",
    submittedBy: "Kurla resident",
    severity: "high",
    timestamp: "2026-05-09T05:30:00Z",
  },
  {
    id: 2,
    location: "Mumbai, MH",
    issueType: "cloudy water",
    description: "Cloudy tap water with smell near Andheri.",
    submittedBy: "Andheri resident",
    severity: "medium",
    timestamp: "2026-05-09T06:00:00Z",
  },
  {
    id: 3,
    location: "Delhi, DL",
    issueType: "no water pressure",
    description: "Low pressure in multiple blocks.",
    submittedBy: "Rohini resident",
    severity: "high",
    timestamp: "2026-05-09T06:20:00Z",
  },
  {
    id: 4,
    location: "Windsor, ON",
    issueType: "cloudy water",
    description: "Cloudy water in downtown apartments.",
    submittedBy: "South Windsor user",
    severity: "high",
    timestamp: "2026-05-09T08:05:00Z",
  },
];

export function addReport(input) {
  const report = {
    id: reports.length + 1,
    location: input.location,
    issueType: input.issueType,
    description: input.description,
    submittedBy: input.submittedBy || "Anonymous",
    severity: input.severity || "medium",
    timestamp: new Date().toISOString(),
  };

  reports.unshift(report);
  return report;
}
