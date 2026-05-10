import { getHealthCanadaAdvisories } from '../data/healthCanadaAdvisories.js';

/**
 * Fetch and normalize real government water advisories into unified signal
 * @param {string} location - City, Province (e.g., "Windsor, ON")
 * @returns {Object} Normalized advisory signal for risk calculation
 */
export async function getGovernmentAdvisorySignal(location) {
  const advisories = getHealthCanadaAdvisories(location);

  if (!advisories.length) {
    return {
      location,
      type: 'no_government_advisory',
      title: 'No active government drinking water advisories',
      source: 'Health Canada Drinking Water Advisory Database',
      sourceUrl: 'https://www.canada.ca/en/health-canada/services/drinking-water-advisories.html',
      active: false,
      points: 0,
      confidence: 'high',
      raw: { advisories: [] }
    };
  }

  const primary = advisories[0];
  const pointsMap = {
    boil_water_advisory: 35,
    contamination_notice: 30,
    sewage_overflow_risk: 25,
    water_quality_alert: 20
  };

  const points = pointsMap[primary.type] || 20;

  return {
    location,
    type: 'government_advisory',
    title: `🚨 ${primary.title}`,
    description: primary.description,
    source: 'Health Canada - Official Advisory',
    sourceUrl: 'https://www.canada.ca/en/health-canada/services/drinking-water-advisories.html',
    active: true,
    points,
    confidence: 'high',
    advisoryCount: advisories.length,
    primaryAdvisory: primary,
    allAdvisories: advisories,
    raw: { advisories }
  };
}
