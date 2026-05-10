/**
 * NewsAPI integration: location-scoped articles about water, weather, climate, and contamination.
 * Uses explicit AND/OR query terms where supported, then filters/ranks results for relevance.
 * @see https://newsapi.org/docs/endpoints/everything
 */

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || "5683e6bbe764465ca020de603c9220c5";
const NEWSAPI_ENDPOINT = "https://newsapi.org/v2/everything";

/** Terms used inside NewsAPI `q` (broad OR group) — must relate to water / environment / health risk */
const API_TOPIC_GROUP =
  "(" +
  [
    "water",
    "drinking water",
    "tap water",
    "boil water",
    "water advisory",
    "flood",
    "flooding",
    "rainfall",
    "storm",
    "cyclone",
    "hurricane",
    "climate",
    "weather",
    "drought",
    "contamination",
    "pollution",
    "sewage",
    "runoff",
    "reservoir",
    "treatment plant",
    "cyanobacteria",
    "algae bloom",
    "toxic",
    "chemical spill",
  ]
    .map(function (t) {
      return `"${t}"`;
    })
    .join(" OR ") +
  ")";

/** Post-filter: article text must hit at least one of these (substring, case-insensitive) */
const RELEVANCE_KEYWORDS = [
  "water",
  "flood",
  "flooding",
  "rain",
  "rainfall",
  "storm",
  "cyclone",
  "hurricane",
  "climate",
  "weather",
  "drought",
  "contamination",
  "pollution",
  "sewage",
  "advisory",
  "boil water",
  "runoff",
  "reservoir",
  "treatment",
  "overflow",
  "main break",
  "cyanobacteria",
  "algae",
  "toxic",
  "chemical",
  "unsafe",
  "sanitation",
];

function daysAgoIso(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Keep articles whose title/description clearly relate to water / climate / contamination topics.
 */
export function filterArticlesByWaterEnvRelevance(articles, minKeywordHits) {
  const minHits = Math.max(1, Number(minKeywordHits) || 1);

  return articles.filter(function (article) {
    const blob = normalizeText(article.title + " " + article.description);
    if (!blob) {
      return false;
    }

    let hits = 0;
    for (let i = 0; i < RELEVANCE_KEYWORDS.length; i += 1) {
      if (blob.includes(RELEVANCE_KEYWORDS[i])) {
        hits += 1;
      }
    }

    return hits >= minHits;
  });
}

function relevanceScore(article) {
  const blob = normalizeText(article.title + " " + article.description);
  let score = 0;
  for (let i = 0; i < RELEVANCE_KEYWORDS.length; i += 1) {
    if (blob.includes(RELEVANCE_KEYWORDS[i])) {
      score += 1;
    }
  }
  return score;
}

function sortByPublishedDesc(a, b) {
  const ta = new Date(a.publishedAt || 0).getTime();
  const tb = new Date(b.publishedAt || 0).getTime();
  return tb - ta;
}

/**
 * Build NewsAPI `q` string: location must appear AND at least one topic term (via API_TOPIC_GROUP).
 */
function buildEverythingQuery(scope) {
  const loc = normalizeText(scope).replace(/"/g, "").trim();
  if (!loc) {
    return API_TOPIC_GROUP;
  }
  return '("' + loc + '") AND ' + API_TOPIC_GROUP;
}

/**
 * Parse "City, Region" (e.g. Toronto, ON) for news search.
 */
export function parseCityRegion(location) {
  const trimmed = String(location || "").trim();
  if (!trimmed) {
    return { city: "", region: "" };
  }

  const parts = trimmed
    .split(",")
    .map(function (p) {
      return p.trim();
    })
    .filter(Boolean);

  if (parts.length >= 2) {
    return { city: parts[0], region: parts.slice(1).join(", ") };
  }

  return { city: trimmed, region: "" };
}

/**
 * News lookup for a dashboard location string.
 */
export async function searchWaterIncidentNewsForLocation(location) {
  const { city, region } = parseCityRegion(location);
  if (!city) {
    return [];
  }

  return searchWaterIncidentNews(city, region);
}

/**
 * Search for water / weather / climate / contamination news scoped to an area.
 */
export async function searchWaterIncidentNews(city, province) {
  const scope = [city, province].filter(Boolean).join(" ").trim();
  const locQuoted = '"' + normalizeText(scope).replace(/"/g, "").trim() + '"';
  const queries = [
    buildEverythingQuery(scope),
    // Second pass: incident-style phrasing, still scoped to the place
    "(" +
      locQuoted +
      ") AND (" +
      '"boil water" OR flooding OR contamination OR sewage OR "water main" OR runoff OR advisory OR drought OR climate' +
      ")",
  ];

  const allArticles = [];

  try {
    for (let q = 0; q < queries.length; q += 1) {
      const articles = await fetchNewsArticles(queries[q]);
      allArticles.push(...articles);
    }

    const uniqueArticles = Array.from(new Map(allArticles.map((item) => [item.title, item])).values());

    uniqueArticles.sort(sortByPublishedDesc);

    let filtered = filterArticlesByWaterEnvRelevance(uniqueArticles, 1);
    filtered.sort(function (a, b) {
      const rs = relevanceScore(b) - relevanceScore(a);
      if (rs !== 0) return rs;
      return sortByPublishedDesc(a, b);
    });

    if (filtered.length === 0 && uniqueArticles.length > 0) {
      filtered = uniqueArticles.slice(0, 10);
    }

    return filtered.slice(0, 10);
  } catch (error) {
    console.error("NewsAPI error:", error.message);
    return [];
  }
}

/**
 * Fetch articles from NewsAPI /everything with a structured `q` string.
 */
async function fetchNewsArticles(query) {
  try {
    const url = new URL(NEWSAPI_ENDPOINT);
    url.searchParams.append("q", query);
    url.searchParams.append("language", "en");
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("pageSize", "15");
    url.searchParams.append("from", daysAgoIso(14));
    url.searchParams.append("apiKey", NEWSAPI_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error("NewsAPI HTTP " + response.status);
    }

    const data = await response.json();

    if (data.status !== "ok" || !data.articles) {
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
        sourceUrl: article.url,
      };
    });
  } catch (error) {
    console.error('Error fetching news for query "' + query.slice(0, 80) + '...":', error.message);
    return [];
  }
}
