export const advisoriesByLocation = {
  'Windsor, ON': [],
  'Tecumseh, ON': [],
  'Chatham, ON': []
};

export function getAdvisoriesByLocation(location) {
  const target = String(location || '').trim().toLowerCase();

  for (const [key, advisories] of Object.entries(advisoriesByLocation)) {
    if (key.toLowerCase() === target) {
      return advisories.filter(function (adv) {
        return adv.active && new Date(adv.endDate) > new Date();
      });
    }
  }

  return [];
}