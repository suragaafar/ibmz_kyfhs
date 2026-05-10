export const floodZones = [
  {
    id: 'flood-001',
    location: 'Windsor, ON',
    zoneName: '100-Year Flood Plain',
    note: 'This area is in a flood-prone zone with historical flooding records.',
    active: true,
    riskLevel: 'moderate'
  },
  {
    id: 'flood-002',
    location: 'Tecumseh, ON',
    zoneName: 'Thames River Floodway',
    note: 'Located near the Thames River; flooding risk increases during heavy rainfall.',
    active: true,
    riskLevel: 'low'
  }
];

export function getFloodZonesByLocation(location) {
  const target = String(location || '').trim().toLowerCase();

  return floodZones.filter(function (zone) {
    return zone.location.toLowerCase() === target && zone.active;
  });
}
