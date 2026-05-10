import { NEWS_SEARCH } from '../routes/routeConstants/apiRoutes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function searchWaterNews(city, province) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${NEWS_SEARCH}?city=${encodeURIComponent(city)}&province=${encodeURIComponent(province)}`
    );

    if (!response.ok) {
      return { articles: [] };
    }

    return response.json();
  } catch (_error) {
    return { articles: [] };
  }
}
