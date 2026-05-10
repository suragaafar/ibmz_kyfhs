export const companies = [
  { id: 1, name: "AquaSense Labs", country: { countryName: "United States", isoCode: "US" } },
  { id: 2, name: "HydroGreen Solutions", country: { countryName: "Canada", isoCode: "CA" } },
  { id: 3, name: "BlueWave Analytics", country: "United Kingdom" },
  { id: 4, name: "RiverNet", country: { countryName: "Australia", isoCode: "AU" } },
  { id: 5, name: "PureWater Insight", country: { countryName: "Germany", isoCode: "DE" } },
  { id: 6, name: "AquaMetrics", country: "France" },
  { id: 7, name: "Oceanic Systems", country: { countryName: "Brazil", isoCode: "BR" } },
  { id: 8, name: "HydroPulse", country: "Japan" },
];

export const countries = [
  { id: 840, countryName: "United States", isoCode: "US" },
  { id: 124, countryName: "Canada", isoCode: "CA" },
  { id: 826, countryName: "United Kingdom", isoCode: "GB" },
  { id: 36, countryName: "Australia", isoCode: "AU" },
  { id: 276, countryName: "Germany", isoCode: "DE" },
  { id: 250, countryName: "France", isoCode: "FR" },
  { id: 76, countryName: "Brazil", isoCode: "BR" },
  { id: 392, countryName: "Japan", isoCode: "JP" },
];

function getCountryIso(country) {
  if (!country) return null;
  if (typeof country === "string") {
    const match = countries.find((item) => item.countryName.toLowerCase() === country.toLowerCase());
    return match?.isoCode || null;
  }

  return country.isoCode || null;
}

export function getOverviewStats() {
  const unique = new Set();
  for (const company of companies) {
    const iso = getCountryIso(company.country);
    if (iso) unique.add(iso.toUpperCase());
  }

  return {
    totalCompanies: companies.length,
    uniqueCountries: unique.size,
  };
}
