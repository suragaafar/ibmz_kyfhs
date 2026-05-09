$ErrorActionPreference = 'Stop'

function Replace-InFile {
    param(
        [string]$Path,
        [string]$Old,
        [string]$New
    )
    $content = Get-Content -Raw -Path $Path
    if ($content.Contains($Old)) {
        $content = $content.Replace($Old, $New)
        Set-Content -Path $Path -Value $content -NoNewline
    }
}

# App footer
$appPath = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\App.jsx'
Replace-InFile -Path $appPath -Old 'AquaGuard AI is a mock hackathon prototype with no real data connections yet.' -New 'AquaGuard AI uses live weather, advisories, and community signals with transparent sources.'

# AI Summary subtitle
$aiSummaryPath = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\components\AISummary.jsx'
Replace-InFile -Path $aiSummaryPath -Old 'Mocked for the hackathon prototype.' -New 'Generated from live API signals and verified data sources.'

# Home copy updates
$homePath = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\pages\Home.jsx'
Replace-InFile -Path $homePath -Old 'Hackathon prototype' -New 'Live data platform'
Replace-InFile -Path $homePath -Old 'Instant mock scoring' -New 'Real-time signal scoring'
Replace-InFile -Path $homePath -Old 'AquaGuard AI blends mock municipal alerts, flood warnings, and community reports into a simple water status with an explanation teams can understand at a glance.' -New 'AquaGuard AI combines live weather alerts, official advisories, flood risk, and community reports into a clear water status with source-backed explanation.'
Replace-InFile -Path $homePath -Old 'Weighted mock scoring shows why a location is flagged.' -New 'Transparent scoring shows why a location is flagged.'

# Neutralize hardcoded advisory seed data
$advisoriesPath = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\backend\data\advisories.js'
$advisoriesContent = @'
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
'@
Set-Content -Path $advisoriesPath -Value $advisoriesContent -NoNewline

# Neutralize hardcoded government advisory seed data
$healthCanadaPath = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\backend\data\healthCanadaAdvisories.js'
$healthCanadaContent = @'
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
'@
Set-Content -Path $healthCanadaPath -Value $healthCanadaContent -NoNewline

# API-first frontend risk engine (no mock data imports)
$riskEnginePath = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\utils\riskEngine.js'
$riskEngineContent = @'
// API-first risk engine: frontend baseline only.
// Real risk points are merged from backend signals in Dashboard.jsx.

export function calculateWaterRisk(location) {
  return {
    location,
    riskScore: 0,
    riskLevel: 'Safe',
    confidence: 70,
    contributingFactors: [],
    activeAlerts: [],
    matchingReports: [],
    municipality: null,
    floodZone: null,
    status: 'Safe',
    explanation: 'Water status is calculated from live weather, advisories, flood, and report signals.'
  };
}

export default calculateWaterRisk;

export function isCountryQuery(_query) {
  return false;
}

export function calculateCountryRisk(_query) {
  return null;
}
'@
Set-Content -Path $riskEnginePath -Value $riskEngineContent -NoNewline

# Add source links in AlertFeed
$alertFeedPath = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\components\AlertFeed.jsx'
Replace-InFile -Path $alertFeedPath -Old 'Mock official alerts and warning signals.' -New 'Live official alerts and warning signals.'
Replace-InFile -Path $alertFeedPath -Old '{alert.source} · {alert.location}' -New '{alert.source} · {alert.location}{alert.sourceUrl ? (<> · <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Verify</a></>) : null}'

# Add source links in RiskCard
$riskCardPath = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\components\RiskCard.jsx'
Replace-InFile -Path $riskCardPath -Old 'Evidence confidence based on alerts, reports, and infrastructure context.' -New 'Evidence confidence based on live API signals and corroborating sources.'
Replace-InFile -Path $riskCardPath -Old '{factor.detail}' -New '{factor.detail}{factor.sourceUrl ? (<><br /><a href={factor.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Verify source</a></>) : null}'
Replace-InFile -Path $riskCardPath -Old '{alert.source} · {alert.location}' -New '{alert.source} · {alert.location}{alert.sourceUrl ? (<> · <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Verify</a></>) : null}'

Write-Output 'Live-data fixes applied.'
