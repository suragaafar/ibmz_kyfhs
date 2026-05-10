import React, { useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import MarketingBanner from '../../shared/components/MarketingBanner';
import { useUserAuth } from '../../context/UserAuthContext';
import publicService from '../../services/PublicService/public.service';
import { getApiErrorMessage } from '../../shared/utils/apiError';
import {
  getCountryISO,
  getIsoFromCompanyCountry,
  iso3ToIso2,
  numericIsoToAlpha2,
  toAlpha2,
} from '../../shared/utils/countryMapping';
import styles from './OverviewPage.module.scss';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const OVERVIEW_BACKEND_DISABLED = false;

const statCards = [
  {
    label: 'Total companies',
    key: 'totalCompanies',
    description: 'Cataloged company records',
    icon: '🏢',
  },
  {
    label: 'Countries with data',
    key: 'uniqueCountries',
    description: 'Countries with at least one company',
    icon: '🌍',
  },
  {
    label: 'Growing database',
    key: 'static',
    description: 'Real-time catalog coverage',
    icon: '📈',
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
      setStats({ totalCompanies: 0, uniqueCountries: 0, countries: {} });
      setCountriesFromApi([]);
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
          : companiesPayload?.data ?? companiesPayload?.companies ?? [];

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
  const countryNameByAlpha2 = useMemo(
    () => new Map(countriesFromApi.map((row) => [row.isoCode.toUpperCase(), row.countryName])),
    [countriesFromApi]
  );

  function getFillColor(count) {
    return count > 0 ? 'rgba(20, 184, 166, 0.45)' : 'rgba(203, 213, 225, 0.32)';
  }

  function handleMouseMove(event) {
    setTooltipPosition({ x: event.clientX + 14, y: event.clientY + 14 });
  }

  function handleGeographyEnter(geo) {
    const geoId = String(geo.id).padStart(3, '0');
    const alpha2 = numericIsoToAlpha2[geoId];
    const count = countryDataMap.get(alpha2) ?? 0;
    const countryName = countryNameByAlpha2.get(alpha2) || geo.properties?.name || 'Unknown country';

    setTooltipContent({ country: countryName, count });
  }

  function handleGeographyLeave() {
    setTooltipContent(null);
  }

  return (
    <div className={styles.root} onMouseMove={handleMouseMove}>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.title}>Index Overview</h1>
          <p className={styles.subtitle}>A read-mostly dashboard for catalog coverage and geography.</p>
        </div>
        <div className={styles.statusChip}>
          {backendStatus === 'live' ? 'Backend mode / Live' : backendStatus === 'fallback' ? 'Fallback mode / Local cache' : 'Checking backend...'}
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
                    {card.key === 'static'
                      ? 'Growing'
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
                <h2 className={styles.mapTitle}>World distribution</h2>
                <p className={styles.mapSubtext}>Countries shaded by whether a company exists in the catalog.</p>
              </div>
              <div className={styles.mapMeta}>{stats?.uniqueCountries ?? 0} country entries</div>
            </div>

            <div className={styles.mapArea}>
              {countryDataMap.size === 0 ? (
                <div className={styles.emptyState}>
                  No geographic coverage is available yet.
                </div>
              ) : (
                <ComposableMap projectionConfig={{ scale: 147, center: [0, 20] }} data-tip="">
                  <ZoomableGroup>
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const geoId = String(geo.id).padStart(3, '0');
                          const alpha2 = numericIsoToAlpha2[geoId];
                          const count = countryDataMap.get(alpha2) ?? 0;
                          const isSelected = count > 0;
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={() => handleGeographyEnter(geo)}
                              onMouseLeave={handleGeographyLeave}
                              style={{
                                default: {
                                  fill: getFillColor(count),
                                  outline: 'none',
                                  stroke: 'rgba(255,255,255,0.12)',
                                  strokeWidth: 0.4,
                                },
                                hover: {
                                  fill: isSelected ? 'rgba(20, 184, 166, 0.95)' : 'rgba(148, 163, 184, 0.45)',
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
                  <span className={styles.legendSwatch} style={{ backgroundColor: getFillColor(1) }} />
                  <span>Has data</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: getFillColor(0) }} />
                  <span>Missing data</span>
                </div>
              </div>

              {tooltipContent && (
                <div className={styles.mapTooltip} style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
                  <strong>{tooltipContent.country}</strong>
                  <div>{tooltipContent.count.toLocaleString()} companies</div>
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
