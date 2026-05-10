import { getReports, addReport as storeReport } from '../data/reports.js';

export function getReportsByLocation(location) {
  return getReports(location);
}

export function createReport(location, issueType, description) {
  return storeReport(location, issueType, description);
}
