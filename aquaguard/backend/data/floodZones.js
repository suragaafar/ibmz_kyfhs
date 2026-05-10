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
  },
  {
    id: 'flood-003',
    location: 'Mumbai, MH',
    zoneName: 'Mithi River Basin Floodplain',
    note: 'High urban runoff and low-lying zones increase flood contamination risk during monsoon peaks.',
    active: true,
    riskLevel: 'high'
  },
  {
    id: 'flood-004',
    location: 'Chennai, TN',
    zoneName: 'Adyar-Cooum Corridor',
    note: 'Storm surge and drainage congestion can elevate contamination exposure in this area.',
    active: true,
    riskLevel: 'moderate'
  },
  {
    id: 'flood-005',
    location: 'Pune, MH',
    zoneName: 'Mula-Mutha Catchment',
    note: 'Localized floodwater pooling has recurring water quality implications after heavy rain.',
    active: true,
    riskLevel: 'moderate'
  },
  {
    id: 'flood-006',
    location: 'Toronto, ON',
    zoneName: 'Don River Floodplain',
    note: 'Combined sewer overflow can coincide with extreme rainfall in this corridor.',
    active: true,
    riskLevel: 'moderate'
  }
];

export function getFloodZonesByLocation(location) {
  const target = String(location || '').trim().toLowerCase();

  return floodZones.filter(function (zone) {
    return zone.location.toLowerCase() === target && zone.active;
  });
}
