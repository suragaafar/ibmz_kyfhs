/**
 * Health Canada advisory adapter.
 * Replace this with a live upstream feed when an official machine-readable endpoint is available.
 */

const HEALTH_CANADA_ADVISORIES = [];

export function getHealthCanadaAdvisories(location) {
  const target = String(location || '').trim().toLowerCase();

  return HEALTH_CANADA_ADVISORIES.filter(function (advisory) {
    const isLocationMatch = advisory.location.toLowerCase() === target;
    const isActive = advisory.status === 'active';
    const isNotExpired = !advisory.expiryDate || new Date(advisory.expiryDate) > new Date();

    return isLocationMatch && isActive && isNotExpired;
  });
}

export function getAllHealthCanadaAdvisories() {
  const now = new Date();

  return HEALTH_CANADA_ADVISORIES.filter(function (advisory) {
    const isActive = advisory.status === 'active';
    const isNotExpired = !advisory.expiryDate || new Date(advisory.expiryDate) > now;

    return isActive && isNotExpired;
  });
}

export function searchHealthCanadaAdvisories(keyword) {
  const searchTerm = String(keyword || '').trim().toLowerCase();

  return HEALTH_CANADA_ADVISORIES.filter(function (advisory) {
    return (
      advisory.title.toLowerCase().includes(searchTerm) ||
      advisory.description.toLowerCase().includes(searchTerm) ||
      advisory.type.toLowerCase().includes(searchTerm)
    );
  });
}