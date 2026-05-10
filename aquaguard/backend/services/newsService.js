/**
 * NewsAPI integration for searching water-related incidents
 * Searches for recent news about boil water advisories, flooding, contamination, etc.
 */

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '5683e6bbe764465ca020de603c9220c5';
const NEWSAPI_ENDPOINT = 'https://newsapi.org/v2/everything';

/**
 * Search for water-related news incidents
 * @param {string} city - City name (e.g., "Windsor")
 * @param {string} province - Province abbreviation (e.g., "ON")
 * @returns {Promise<Array>} Array of news articles
 */
export async function searchWaterIncidentNews(city, province) {
  const searchQueries = [
    `${city} boil water advisory`,
    `${city} flooding water`,
    `${city} sewage overflow`,
    `${city} water main break`,
    `${city} water contamination`
  ];

  const allArticles = [];

  try {
    for (const query of searchQueries) {
      const articles = await fetchNewsArticles(query, province);
      allArticles.push(...articles);
    }

    // Deduplicate by title and return most recent
    const uniqueArticles = Array.from(
      new Map(allArticles.map((item) => [item.title, item])).values()
    );

    return uniqueArticles.slice(0, 10);
  } catch (error) {
    console.error('NewsAPI error:', error.message);
    return [];
  }
}

/**
 * Fetch articles from NewsAPI for a specific query
 * @param {string} query - Search query
 * @param {string} province - Province filter
 * @returns {Promise<Array>} Articles
 */
async function fetchNewsArticles(query, province) {
  try {
    const url = new URL(NEWSAPI_ENDPOINT);
    url.searchParams.append('q', query);
    url.searchParams.append('language', 'en');
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('pageSize', '10');
    url.searchParams.append('apiKey', NEWSAPI_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`NewsAPI HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'ok' || !data.articles) {
      return [];
    }

    return data.articles.map(function (article) {
      return {
        title: article.title,
        description: article.description,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        imageUrl: article.urlToImage,
        sourceUrl: article.url
      };
    });
  } catch (error) {
    console.error(`Error fetching news for query "${query}":`, error.message);
    return [];
  }
}
