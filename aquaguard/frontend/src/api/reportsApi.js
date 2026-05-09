import { REPORTS_LIST, REPORTS_CREATE } from '../routes/routeConstants/apiRoutes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function getReports(location) {
  try {
    const query = location ? `?location=${encodeURIComponent(location)}` : '';
    const response = await fetch(`${API_BASE_URL}${REPORTS_LIST}${query}`);

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (_error) {
    return [];
  }
}

export async function createReport(location, issueType, description) {
  try {
    const response = await fetch(`${API_BASE_URL}${REPORTS_CREATE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, issueType, description })
    });

    if (!response.ok) {
      throw new Error('Failed to create report');
    }

    return response.json();
  } catch (_error) {
    return null;
  }
}
