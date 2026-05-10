import { COUNTRIES, STATISTICS_OVERVIEW, USER_COMPANIES } from '../../routes/routeConstants/apiRoutes.js';
import { getIsoFromCompanyCountry, toAlpha2 } from '../../shared/utils/countryMapping.js';

const companies = [
  { id: 1, name: 'AquaSense Labs', country: { countryName: 'United States', isoCode: 'US' } },
  { id: 2, name: 'HydroGreen Solutions', country: { countryName: 'Canada', isoCode: 'CA' } },
  { id: 3, name: 'BlueWave Analytics', country: 'United Kingdom' },
  { id: 4, name: 'RiverNet', country: { countryName: 'Australia', isoCode: 'AU' } },
  { id: 5, name: 'PureWater Insight', country: { countryName: 'Germany', isoCode: 'DE' } },
  { id: 6, name: 'AquaMetrics', country: 'France' },
  { id: 7, name: 'Oceanic Systems', country: { countryName: 'Brazil', isoCode: 'BR' } },
  { id: 8, name: 'HydroPulse', country: 'Japan' },
];

const countries = [
  { id: 840, countryName: 'United States', isoCode: 'US' },
  { id: 124, countryName: 'Canada', isoCode: 'CA' },
  { id: 826, countryName: 'United Kingdom', isoCode: 'GB' },
  { id: 36, countryName: 'Australia', isoCode: 'AU' },
  { id: 276, countryName: 'Germany', isoCode: 'DE' },
  { id: 250, countryName: 'France', isoCode: 'FR' },
  { id: 76, countryName: 'Brazil', isoCode: 'BR' },
  { id: 392, countryName: 'Japan', isoCode: 'JP' },
];

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 300));
}

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function requestJson(path) {
  const response = await fetch(apiBase + path);
  if (!response.ok) {
    throw new Error('Request failed: ' + response.status + ' ' + path);
  }

  return response.json();
}

export default {
  async getOverviewStats() {
    try {
      return await requestJson(STATISTICS_OVERVIEW);
    } catch (_error) {
      const countriesSeen = new Set();
      for (const company of companies) {
        const rawIso = getIsoFromCompanyCountry(company.country);
        const alpha2 = toAlpha2(rawIso);
        if (alpha2) {
          countriesSeen.add(alpha2);
        }
      }

      return delay({
        totalCompanies: companies.length,
        uniqueCountries: countriesSeen.size,
      });
    }
  },

  async getCompanies(options = {}) {
    const limit = options?.limit ? '?limit=' + encodeURIComponent(String(options.limit)) : '';
    try {
      return await requestJson(USER_COMPANIES + limit);
    } catch (_error) {
      return delay(companies);
    }
  },

  async getCountries() {
    try {
      return await requestJson(COUNTRIES);
    } catch (_error) {
      return delay(countries);
    }
  },
};
