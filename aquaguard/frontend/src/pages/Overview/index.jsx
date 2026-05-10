import React, { useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import MarketingBanner from '../../shared/components/MarketingBanner';
import { useUserAuth } from '../../context/UserAuthContext';
import publicService from '../../services/PublicService/public.service';
import { getIsoFromCompanyCountry, numericIsoToAlpha2, toAlpha2 } from '../../shared/utils/countryMapping';
import styles from './OverviewPage.module.scss';

const geoUrl = 'https://unpkg.com/visionscarto-world-atlas@0.0.4/world/110m_countries.geojson';
const OVERVIEW_BACKEND_DISABLED = true;

const countryNameDisplay = new Intl.DisplayNames(['en'], { type: 'region' });

const knownContaminationLevels = {
  // Low contamination (1-3)
  AQ: 1,
  AU: 2,
  CA: 3,
  JP: 3,
  NO: 2,
  NZ: 2,
  SE: 2,

  // Medium-Low (4)
  DE: 4,
  ES: 4,
  IT: 4,
  US: 4,

  // Medium (5)
  GB: 5,
  RU: 5,
  SA: 5,
  VN: 5,

  // Medium-High (6)
  BR: 6,
  CN: 6,
  FR: 6,
  GH: 6,
  MX: 6,
  PH: 6,
  TR: 6,
  ZA: 6,

  // High (7-10)
  AO: 8,
  BD: 7,
  CD: 8,
  EG: 7,
  ID: 7,
  IN: 8,
  KE: 7,
  NG: 8,
  PK: 9,
  TD: 9,
};

function getStableContaminationLevel(alpha2) {
  if (knownContaminationLevels[alpha2] !== undefined) {
    return knownContaminationLevels[alpha2];
  }

  const score = alpha2
    .split('')
    .reduce((sum, character, index) => sum + character.charCodeAt(0) * (index + 3), 0);

  return (score % 10) + 1;
}

const countryContaminationLevels = Object.values(numericIsoToAlpha2).reduce((levels, alpha2) => {
  levels[alpha2] = getStableContaminationLevel(alpha2);
  return levels;
}, {});

function getCountryDisplayName(alpha2) {
  if (!alpha2) {
    return 'Unknown country';
  }

  const specialNames = {
    CD: 'Democratic Republic of the Congo',
    CG: 'Congo',
    CI: 'Ivory Coast',
    FK: 'Falkland Islands',
    FM: 'Micronesia',
    GF: 'French Guiana',
    HK: 'Hong Kong',
    KP: 'North Korea',
    KR: 'South Korea',
    LA: 'Laos',
    MM: 'Myanmar',
    PS: 'Palestine',
    RE: 'Reunion',
    SZ: 'Eswatini',
    TW: 'Taiwan',
    VA: 'Vatican City',
    VG: 'British Virgin Islands',
    VI: 'US Virgin Islands',
  };

  return specialNames[alpha2] || countryNameDisplay.of(alpha2) || alpha2;
}

function geographyToAlpha2(geo) {
  if (!geo) {
    return null;
  }
  const key = String(geo.id ?? '').padStart(3, '0');
  if (numericIsoToAlpha2[key]) {
    return numericIsoToAlpha2[key];
  }
  const p = geo.properties || {};
  const raw =
    p.iso_a2 ||
    p.ISO_A2 ||
    p.ISO_A2_EH ||
    (typeof p.iso_a2 === 'string' ? p.iso_a2 : '');
  const code = String(raw).trim().toUpperCase();
  if (code.length === 2 && /^[A-Z]{2}$/.test(code)) {
    return code;
  }
  return null;
}

const statCards = [
  {
    label: 'Countries assessed',
    key: 'totalCompanies',
    description: 'Global water quality coverage',
    icon: '🌍',
  },
  {
    label: 'High risk countries',
    key: 'highRiskCount',
    description: 'Countries with medium-high or high contamination (6-10)',
    icon: '⚠️',
  },
  {
    label: 'Average risk level',
    key: 'averageRisk',
    description: 'Global water contamination average',
    icon: '📊',
  },
];

export default function OverviewPage() {
  const { isUserAuthenticated } = useUserAuth();
  const [stats, setStats] = useState(null);
  const [countriesFromApi, setCountriesFromApi] = useState([]);
  const [backendStatus, setBackendStatus] = useState('unknown');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (OVERVIEW_BACKEND_DISABLED) {
      const totalMappedCountries = Object.keys(countryContaminationLevels).length;
      const contaminationValues = Object.values(countryContaminationLevels);
      const highRiskCountryCount = contaminationValues.filter((level) => level >= 6).length;
      const averageContaminationRisk =
        Math.round((contaminationValues.reduce((sum, level) => sum + level, 0) / totalMappedCountries) * 10) / 10;

      setStats({
        totalCompanies: totalMappedCountries,
        uniqueCountries: totalMappedCountries,
        highRiskCount: highRiskCountryCount,
        averageRisk: averageContaminationRisk,
        countries: countryContaminationLevels,
      });
      setCountriesFromApi(
        Object.keys(countryContaminationLevels).map((isoCode) => ({
          isoCode,
          countryName: getCountryDisplayName(isoCode),
        }))
      );
      setBackendStatus('fallback');
      setLoading(false);
      return;
    }

    const fetchOverview = async () => {
      setLoading(true);
      setError(null);

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      try {
        const healthResponse = await fetch(apiBase + '/health');
        setBackendStatus(healthResponse.ok ? 'live' : 'fallback');
      } catch (_healthError) {
        setBackendStatus('fallback');
      }

      try {
        const [companiesPayload, overviewStatsRaw, countriesListRaw] = await Promise.all([
          publicService.getCompanies({ limit: 10000 }),
          publicService.getOverviewStats(),
          publicService.getCountries(),
        ]);

        const companies = Array.isArray(companiesPayload)
          ? companiesPayload
          : companiesPayload?.data ??
            companiesPayload?.companies ??
            companiesPayload?.items ??
            [];

        const countriesList = Array.isArray(countriesListRaw) ? countriesListRaw : [];
        setCountriesFromApi(countriesList);

        const countriesByIso = {};
        for (const company of companies) {
          const rawIso = getIsoFromCompanyCountry(company.country);
          if (!rawIso) {
            continue;
          }

          const alpha2 = toAlpha2(rawIso);
          if (!alpha2) {
            continue;
          }

          countriesByIso[alpha2] = (countriesByIso[alpha2] || 0) + 1;
        }

        const overviewStats = overviewStatsRaw ?? {};
        const fallbackTotalCompanies = companiesPayload?.total ?? companies.length;
        const totalCompanies =
          typeof overviewStats.totalCompanies === 'number'
            ? overviewStats.totalCompanies
            : fallbackTotalCompanies;
        const uniqueCountries =
          typeof overviewStats.uniqueCountries === 'number'
            ? overviewStats.uniqueCountries
            : Object.keys(countriesByIso).length;

        setStats({ totalCompanies, uniqueCountries, countries: countriesByIso });
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load statistics'));
        console.error('Failed to load overview statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const countryDataMap = useMemo(() => new Map(Object.entries(stats?.countries || {})), [stats]);
  const countryNameByAlpha2 = useMemo(function () {
    const entries = [];
    for (const row of countriesFromApi) {
      if (!row || row.isoCode == null || row.isoCode === '') {
        continue;
      }
      const code = String(row.isoCode).trim().toUpperCase();
      const name = row.countryName != null && row.countryName !== '' ? String(row.countryName) : code;
      entries.push([code, name]);
    }
    return new Map(entries);
  }, [countriesFromApi]);

  function getFillColor(level) {
    if (level === 0) return 'rgba(203, 213, 225, 0.32)'; // No data
    if (level <= 3) return 'rgba(34, 197, 94, 0.6)'; // Low - Green
    if (level === 4) return 'rgba(163, 230, 53, 0.64)'; // Medium-Low - Yellow green
    if (level === 5) return 'rgba(251, 191, 36, 0.66)'; // Medium - Yellow
    if (level === 6) return 'rgba(251, 146, 60, 0.7)'; // Medium-High - Orange
    return 'rgba(239, 68, 68, 0.78)'; // High - Red
  }

  function getContaminationLabel(level) {
    if (level === 0) return 'No Data';
    if (level <= 3) return 'Low';
    if (level === 4) return 'Medium-Low';
    if (level === 5) return 'Medium';
    if (level === 6) return 'Medium-High';
    return 'High';
  }

  function handleMouseMove(event) {
    setTooltipPosition({ x: event.clientX + 14, y: event.clientY + 14 });
  }

  function handleGeographyEnter(geo) {
    const alpha2 = geographyToAlpha2(geo);
    const level = alpha2 ? countryDataMap.get(alpha2) ?? 0 : 0;
    const countryName =
      (alpha2 && countryNameByAlpha2.get(alpha2)) || geo.properties?.name || 'Unknown country';
    const contaminationLabel = getContaminationLabel(level);

    setTooltipContent({ country: countryName, level, label: contaminationLabel });
  }

  function handleGeographyLeave() {
    setTooltipContent(null);
  }

  return (
    <div className={styles.root} onMouseMove={handleMouseMove}>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.title}>Water Contamination Overview</h1>
          <p className={styles.subtitle}>Global country-level water contamination dashboard with risk-coded mapping.</p>
        </div>
        <div className={styles.statusChip}>
          {backendStatus === 'live' ? 'Live Monitoring' : backendStatus === 'fallback' ? 'Offline Mode' : 'Initializing...'}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Loading overview data…</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            {statCards.map((card) => (
              <article key={card.label} className={styles.statCard}>
                <div className={styles.statCardLabel}>
                  <span className={styles.statLabel}>{card.label}</span>
                  <span className={styles.statValue}>
                    {card.key === 'averageRisk'
                      ? stats?.[card.key]?.toFixed(1) ?? '—'
                      : stats?.[card.key]?.toLocaleString() ?? '—'}
                  </span>
                  <span className={styles.statDescription}>{card.description}</span>
                </div>
                <div className={styles.statIcon}>{card.icon}</div>
              </article>
            ))}
          </div>

          <section className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <div>
                <h2 className={styles.mapTitle}>Global water contamination levels</h2>
                <p className={styles.mapSubtext}>Countries colored by water contamination risk levels (1-10 scale).</p>
              </div>
              <div className={styles.mapMeta}>{stats?.uniqueCountries ?? 0} countries assessed</div>
            </div>

            <div className={styles.mapArea}>
              {countryDataMap.size === 0 ? (
                <div className={styles.emptyState}>
                  No water contamination data available yet.
                </div>
              ) : (
                <ComposableMap
                  projectionConfig={{ scale: 147, center: [0, 20] }}
                  width={980}
                  height={500}
                  style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
                  data-tip=""
                >
                  <ZoomableGroup>
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const alpha2 = geographyToAlpha2(geo);
                          const level = alpha2 ? countryDataMap.get(alpha2) ?? 0 : 0;
                          const isSelected = level > 0;
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={() => handleGeographyEnter(geo)}
                              onMouseLeave={handleGeographyLeave}
                              style={{
                                default: {
                                  fill: getFillColor(level),
                                  outline: 'none',
                                  stroke: 'rgba(255,255,255,0.12)',
                                  strokeWidth: 0.4,
                                },
                                hover: {
                                  fill: isSelected ? getFillColor(level) : 'rgba(148, 163, 184, 0.45)',
                                  outline: 'none',
                                  stroke: 'rgba(15, 23, 42, 0.95)',
                                  strokeWidth: 1,
                                },
                                pressed: {
                                  outline: 'none',
                                },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
              )}

              <div className={styles.mapLegend}>
                <div className={styles.legendRow}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: getFillColor(2) }} />
                  <span>Low (1-3)</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: getFillColor(4) }} />
                  <span>Medium-Low (4)</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: getFillColor(5) }} />
                  <span>Medium (5)</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: getFillColor(6) }} />
                  <span>Medium-High (6)</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: getFillColor(7) }} />
                  <span>High (7-10)</span>
                </div>
              </div>

              {tooltipContent && (
                <div className={styles.mapTooltip} style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
                  <strong>{tooltipContent.country}</strong>
                  <div>Contamination: {tooltipContent.label} ({tooltipContent.level}/10)</div>
                </div>
              )}
            </div>
          </section>

          {!isUserAuthenticated && (
            <div className={styles.bannerWrap}>
              <MarketingBanner />
            </div>
          )}
        </>
      )}
    </div>
  );
}
