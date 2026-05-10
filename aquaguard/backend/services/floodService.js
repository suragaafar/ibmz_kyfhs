import { getFloodZonesByLocation } from '../data/floodZones.js';

function normalizeLocation(value) {
  return String(value || '').trim().toLowerCase();
}

export async function getFloodSignal(location) {
  const floodZones = getFloodZonesByLocation(location);

  if (!floodZones.length) {
    return {
      location,
      type: 'normal_flood_risk',
      title: 'No flood zones detected for this location',
      source: 'Flood Zone Database',
      sourceUrl: 'https://www.gis.ca/',
      active: false,
      points: 0,
      raw: { zones: [] }
    };
  }

  const zone = floodZones[0];
  const points = zone.riskLevel === 'high' ? 15 : zone.riskLevel === 'moderate' ? 10 : 5;

  return {
    location,
    type: 'flood_zone_alert',
    title: `Located in ${zone.zoneName}. ${zone.note}`,
    source: 'Flood Zone Database',
    sourceUrl: 'https://www.gis.ca/',
    active: true,
    points,
    raw: { zones: floodZones }
  };
}
