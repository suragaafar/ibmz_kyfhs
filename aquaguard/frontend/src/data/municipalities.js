export const municipalities = [
	{
		id: 1,
		name: 'Windsor, ON',
		region: 'Essex County',
		waterSource: 'Detroit River intake and municipal treatment network',
		infrastructure: ['Lakefront treatment plant', 'Combined sewer network', 'Shared floodplain pumps'],
		adjacentCommunities: ['Tecumseh, ON'],
		notes: 'High density urban zone with shared stormwater infrastructure.'
	},
	{
		id: 2,
		name: 'Tecumseh, ON',
		region: 'Essex County',
		waterSource: 'Regional distribution system fed by Windsor treatment assets',
		infrastructure: ['Lift station network', 'Stormwater detention ponds', 'Shared emergency backflow controls'],
		adjacentCommunities: ['Windsor, ON', 'Lakeshore, ON'],
		notes: 'Nearby community with overflow sensitivity during heavy rain.'
	},
	{
		id: 3,
		name: 'Chatham, ON',
		region: 'Chatham-Kent',
		waterSource: 'Thames River watershed treatment system',
		infrastructure: ['Downtown mains', 'Sanitary bypass monitoring', 'Water tower storage'],
		adjacentCommunities: ['Wallaceburg, ON'],
		notes: 'Separate system but still exposed to maintenance-related advisories.'
	}
];

export default municipalities;
