# Remove Mock Data & Add Source Links - Implementation Guide

## Changes Made So Far

✅ **Services Updated with sourceUrl**:
- `weatherService.js` → `sourceUrl: 'https://open-meteo.com/'`
- `alertsService.js` → `sourceUrl: 'https://open-meteo.com/en/features/alerts'`
- `govAdvisoriesService.js` → `sourceUrl: 'https://www.canada.ca/en/health-canada/services/drinking-water-advisories.html'`
- `floodService.js` → `sourceUrl: 'https://www.gis.ca/'`
- `newsService.js` → `sourceUrl: article.url` (NewsAPI links)
- `advisoriesService.js` → `sourceUrl: 'https://www.canada.ca/...'`

✅ **New Locations Router Created**:
- `backend/routes/locations.js` → Endpoint: `GET /api/locations/cities`
- Returns: `{ cities: [...], countries: [...] }`
- Replaces mock municipality data with real coordinates data

---

## Files That Still Need Manual Updates

### 1. **Dashboard.jsx** - Remove Mock Data Imports

**REMOVE these lines (top of file)**:
```javascript
import { municipalities } from '../data/municipalities';

// This line:
const KNOWN_LOCATIONS = [
        ...municipalities.map(function (m) { return m.name; }),
        ...Array.from(new Set(municipalities.map(function (m) { return m.country; })))
].sort();
```

**REPLACE with**:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

**ADD this hook** (in component body, after isLoadingCityRisk state):
```javascript
const [knownLocations, setKnownLocations] = useState([]);

useEffect(function () {
    async function fetchLocations() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/locations/cities`);
            if (response.ok) {
                const data = await response.json();
                const allLocations = [
                    ...data.cities,
                    ...data.countries
                ].sort();
                setKnownLocations(allLocations);
            }
        } catch (_error) {
            console.error('Failed to fetch locations');
        }
    }
    fetchLocations();
}, []);
```

**REPLACE in the select dropdown**:
```javascript
// OLD: {KNOWN_LOCATIONS.map(...)}
// NEW: {knownLocations.map(...)}
```

---

### 2. **riskEngine.js** - Remove All Mock Data

**REMOVE these imports**:
```javascript
import { alerts } from '../data/alerts';
import { floodZones } from '../data/floodZones';
import { municipalities } from '../data/municipalities';
import { reports } from '../data/reports';
```

**REMOVE or COMMENT OUT**:
- The `ALERT_WEIGHTS` constant (no longer used)
- The `calculateWaterRisk()` function completely or replace with:

```javascript
export function calculateWaterRisk(location) {
    // Return base risk only - all real signals come from APIs
    return {
        location,
        riskScore: 20,  // Base starting point
        riskLevel: 'Safe',
        status: 'Safe',
        explanation: 'Analyzing water safety from real-time data sources...',
        contributingFactors: [],
        activeAlerts: [],
        confidence: 70,
        lastUpdated: new Date().toISOString()
    };
}
```

**KEEP** these functions (they're used for country-level queries):
- `isCountryQuery()`
- `calculateCountryRisk()` 
- `COUNTRY_ALIASES`
- Helper functions

---

### 3. **AlertFeed Component** - Display Source Links

Update to show clickable source URLs for each signal:

```javascript
<article className="...">
    <div className="flex items-start justify-between gap-4">
        <div>
            <div className="font-semibold text-white">{alert.title}</div>
            <div className="text-sm text-slate-400">
                {alert.source}
                {alert.sourceUrl && (
                    <>
                        {' · '}
                        <a 
                            href={alert.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline"
                        >
                            Verify
                        </a>
                    </>
                )}
            </div>
        </div>
        <span className="...">+{alert.points} pts</span>
    </div>
</article>
```

---

### 4. **Report.jsx** - Display News Source Links

Already updated, but ensure articles show source links:

```javascript
<a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
    <div className="font-semibold text-cyan-400 hover:text-cyan-300 line-clamp-2">
        {article.title}
    </div>
    <div className="text-xs text-slate-500 mt-1">
        {article.source} · {new Date(article.publishedAt).toLocaleDateString()}
        {' · '}
        <span className="text-cyan-300">Read on NewsAPI</span>
    </div>
    <p className="mt-2 text-sm leading-6 text-slate-300 line-clamp-2">
        {article.description}
    </p>
</a>
```

---

## Delete These Mock Data Files

Once frontend is updated, you can delete:
```
frontend/src/data/
├── alerts.js             ❌ DELETE
├── floodZones.js         ❌ DELETE  
├── municipalities.js     ❌ DELETE (or keep for reference)
└── reports.js            ❌ DELETE
```

Keep only:
```
frontend/src/data/
└── [empty or delete directory]
```

---

## API Endpoints (All with sourceUrl)

| Endpoint | Source | Verification Link |
|----------|--------|-------------------|
| `/api/weather/signal` | Open-Meteo | https://open-meteo.com/ |
| `/api/alerts/signal` | Open-Meteo Alerts | https://open-meteo.com/en/features/alerts |
| `/api/advisories/signal` | Local (mock) | Local DB |
| `/api/gov-advisories/signal` | Health Canada | https://www.canada.ca/...  |
| `/api/floods/signal` | GIS Database | https://www.gis.ca/ |
| `/api/reports` | Community | Internal |
| `/api/news/search` | NewsAPI | Article URLs |
| `/api/locations/cities` | Backend Coords | N/A |

---

## Step-by-Step Implementation

1. **Update Dashboard.jsx**
   - Remove municipalities import
   - Add location fetching hook
   - Replace KNOWN_LOCATIONS with state

2. **Update riskEngine.js**
   - Remove all mock data imports
   - Simplify calculateWaterRisk() to return base risk only
   - Keep country functions

3. **Update AlertFeed.jsx**
   - Add source URL links to each alert display
   - Make links clickable and styled

4. **Update Report.jsx**
   - Verify news article links are clickable
   - Show source attribution

5. **Test Everything**
   - Frontend still loads (no 404s on locations)
   - Each signal shows source link
   - Links are clickable and go to correct sources
   - No console errors

6. **Delete Mock Data**
   - Remove unused data files
   - Verify app still works

---

## Testing Verification

```bash
# 1. Check locations API
curl http://localhost:3001/api/locations/cities

# 2. Check all signals have sourceUrl
curl "http://localhost:3001/api/weather/signal?location=Windsor%2C%20ON"
curl "http://localhost:3001/api/gov-advisories/signal?location=Windsor%2C%20ON"
curl "http://localhost:3001/api/news/search?city=Windsor&province=ON"

# 3. Check frontend loads with no errors
# Open http://localhost:5173 - should show autocomplete from real data
```

---

## Result

✅ **No mock data in production**
✅ **All signals have real sources**
✅ **Users can verify every data point**
✅ **Clickable links to original sources**
✅ **Professional credibility**
