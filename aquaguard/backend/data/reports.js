let reportsStore = [
  {
    id: 'report-001',
    location: 'Windsor, ON',
    issueType: 'cloudy water',
    description: 'Water has been noticeably cloudy for the past 24 hours.',
    submittedBy: 'Community Member',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    severity: 'medium'
  },
  {
    id: 'report-002',
    location: 'Tecumseh, ON',
    issueType: 'strange smell',
    description: 'Unusual sulfur-like smell coming from the tap water.',
    submittedBy: 'Resident',
    submittedAt: new Date(Date.now() - 43200000).toISOString(),
    severity: 'low'
  }
];

let nextId = 3;

export function getReports(location) {
  if (!location) {
    return reportsStore;
  }

  const target = String(location || '').trim().toLowerCase();

  return reportsStore.filter(function (report) {
    return report.location.toLowerCase() === target;
  });
}

export function addReport(location, issueType, description) {
  const report = {
    id: `report-${nextId++}`,
    location,
    issueType,
    description,
    submittedBy: 'Community User',
    submittedAt: new Date().toISOString(),
    severity: 'medium'
  };

  reportsStore.push(report);

  return report;
}
