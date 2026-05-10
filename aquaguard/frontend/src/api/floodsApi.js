import { FLOOD_SIGNAL } from '../routes/routeConstants/apiRoutes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function getFloodSignal(location) {
  try {
    const response = await fetch(`${API_BASE_URL}${FLOOD_SIGNAL}?location=${encodeURIComponent(location)}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (_error) {
    return null;
  }
}
