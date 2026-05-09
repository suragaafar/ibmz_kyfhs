import React, { useEffect, useState } from 'react';
import AlertFeed from '../components/AlertFeed';
import AISummary from '../components/AISummary';
import RiskCard from '../components/RiskCard';
import { calculateWaterRisk, calculateCountryRisk, isCountryQuery } from '../utils/riskEngine';
import { getAdvisorySignal } from '../api/advisoriesApi';
import { getAlertSignal } from '../api/alertsApi';
import { getFloodSignal } from '../api/floodsApi';
import { getGovernmentAdvisorySignal } from '../api/govAdvisoriesApi';
import { getWeatherSignal } from '../api/weatherApi';
import { searchWaterNews } from '../api/newsApi';

// Build autocomplete list — all cities + all unique countries
const KNOWN_LOCATIONS = [
        'Windsor, ON',
        'Tecumseh, ON',
        'Chatham, ON',
        'Toronto, ON',
        'Ottawa, ON',
        'Vancouver, BC',
        'Montreal, QC',
        'Calgary, AB',
        'New York, NY',
        'Los Angeles, CA',
        'London, UK',
        'Sydney, AU',
        'Mumbai, IN',
        'Delhi, IN',
        'Bangalore, IN'
].sort();

function levelColor(level) {
        if (level === 'Safe') return 'text-emerald-300';
        if (level === 'Caution') return 'text-amber-300';
        return 'text-rose-400';
}

function levelBadge(level) {
        if (level === 'Safe') return 'bg-emerald-400/15 text-emerald-200';
        if (level === 'Caution') return 'bg-amber-400/15 text-amber-200';
        return 'bg-rose-400/15 text-rose-200';
}

function CountryDashboard({ result }) {
        return (
                <div className="space-y-6">
                        {/* Country summary card */}
                        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div>
                                                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Country overview</p>
                                                <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{result.country}</h2>
                                                <p className="mt-2 text-sm text-slate-300">
                                                        Aggregated across {result.cityResults.length} monitored {result.cityResults.length === 1 ? 'city' : 'cities'}.
                                                        Highest risk city: <span className={levelColor(result.overallLevel)}>{result.worstCity ? result.worstCity.location : '—'}</span>.
                                                </p>
                                        </div>
                                        <div className={'rounded-2xl bg-gradient-to-r px-5 py-4 text-center shadow-lg ' + (result.overallLevel === 'Safe' ? 'from-emerald-400 to-cyan-400 text-slate-950' : result.overallLevel === 'Caution' ? 'from-amber-300 to-orange-400 text-slate-950' : 'from-rose-400 to-red-500 text-white')}>
                                                <div className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">Overall Level</div>
                                                <div className="mt-1 text-3xl font-extrabold">{result.overallLevel}</div>
                                                <div className="text-sm font-medium opacity-90">Score {result.overallScore}/100</div>
                                        </div>
                                </div>

                                <div className="mt-6 grid gap-4 sm:grid-cols-4">
                                        {[
                                                { label: 'Confidence', value: result.confidence + '%' },
                                                { label: 'Active alerts', value: result.totalAlerts },
                                                { label: 'Community signals', value: result.totalReports },
                                                { label: 'Cities monitored', value: result.cityResults.length }
                                        ].map(function (stat) {
                                                return (
                                                        <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                                                                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{stat.label}</div>
                                                                <div className="mt-2 text-3xl font-bold text-cyan-200">{stat.value}</div>
                                                        </div>
                                                );
                                        })}
                                </div>
                        </section>

                        {/* Risk level breakdown */}
                        <div className="grid gap-3 sm:grid-cols-3">
                                {['Safe', 'Caution', 'Unsafe'].map(function (level) {
                                        return (
                                                <div key={level} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                                        <div className={'text-2xl font-extrabold ' + levelColor(level)}>{result.counts[level] || 0}</div>
                                                        <div className="mt-1 text-sm text-slate-400">{level} cities</div>
                                                </div>
                                        );
                                })}
                        </div>

                        {/* Per-city breakdown table */}
                        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/80">City-by-city breakdown</h3>
                                <div className="mt-4 space-y-3">
                                        {result.cityResults.map(function (city) {
                                                return (
                                                        <div key={city.location} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                                                <div>
                                                                        <div className="font-medium text-white">{city.location}</div>
                                                                        <div className="text-sm text-slate-400">{city.activeAlerts.length} alert{city.activeAlerts.length !== 1 ? 's' : ''} · {city.matchingReports.length} report{city.matchingReports.length !== 1 ? 's' : ''} · {city.confidence}% confidence</div>
                                                                </div>
                                                                <span className={'shrink-0 rounded-full px-4 py-1 text-sm font-semibold ' + levelBadge(city.riskLevel)}>
                                                                        {city.riskLevel} · {city.riskScore}/100
                                                                </span>
                                                        </div>
                                                );
                                        })}
                                </div>
                        </section>
                </div>
        );
}

export default function Dashboard() {
        const [inputValue, setInputValue] = useState('');
        const [searchedLocation, setSearchedLocation] = useState('Windsor, ON');
        const [cityRisk, setCityRisk] = useState(null);
        const [isLoadingCityRisk, setIsLoadingCityRisk] = useState(true);

        function handleSearch(e) {
                e.preventDefault();
                const trimmed = inputValue.trim();
                if (trimmed) {
                        setSearchedLocation(trimmed);
                }
        }

        const isCountry = isCountryQuery(searchedLocation);
        const countryResult = isCountry ? calculateCountryRisk(searchedLocation) : null;

        useEffect(function () {
                let isCancelled = false;

                async function loadCityRisk() {
                        let finalRisk = null;

                        if (isCountry) {
                                setCityRisk(null);
                                setIsLoadingCityRisk(false);
                                return;
                        }

                        setIsLoadingCityRisk(true);

                        try {
                                const baseRisk = calculateWaterRisk(searchedLocation);
                                
                                // Parse city and province for news search
                                const locationParts = searchedLocation.split(',').map(part => part.trim());
                                const city = locationParts[0];
                                const province = locationParts[1] || '';

                                const [weatherSignal, alertSignal, advisorySignal, govAdvisorySignal, floodSignal, newsData] = await Promise.all([
                                        getWeatherSignal(searchedLocation),
                                        getAlertSignal(searchedLocation),
                                        getAdvisorySignal(searchedLocation),
                                        getGovernmentAdvisorySignal(searchedLocation),
                                        getFloodSignal(searchedLocation),
                                        searchWaterNews(city, province)
                                ]);

                                finalRisk = { ...baseRisk };

                                const liveSignals = [weatherSignal, alertSignal, advisorySignal, govAdvisorySignal, floodSignal].filter(Boolean);

                                liveSignals.forEach(function (signal) {
                                        if (!signal.active) {
                                                return;
                                        }

                                        finalRisk.riskScore = Math.min(
                                                100,
                                                finalRisk.riskScore + signal.points
                                        );

                                        finalRisk.contributingFactors = [
                                                ...finalRisk.contributingFactors,
                                                {
                                                        label: signal.type.replace(/_/g, ' '),
                                                        score: signal.points,
                                                        detail: signal.title,
                                                        sourceUrl: signal.sourceUrl
                                                }
                                        ];

                                        finalRisk.activeAlerts = [
                                                ...finalRisk.activeAlerts,
                                                signal
                                        ];

                                        finalRisk.explanation = finalRisk.explanation + ' ' + signal.title + '.';
                                });

                                // Add news context if articles found
                                if (newsData.articles && newsData.articles.length > 0) {
                                        finalRisk.newsArticles = newsData.articles;
                                        finalRisk.newsContext = `Found ${newsData.articles.length} recent news articles about water incidents in ${city}.`;
                                }

                                if (finalRisk.riskScore >= 66) {
                                        finalRisk.riskLevel = 'Unsafe';
                                } else if (finalRisk.riskScore >= 31) {
                                        finalRisk.riskLevel = 'Caution';
                                } else {
                                        finalRisk.riskLevel = 'Safe';
                                }

                                finalRisk.status = finalRisk.riskLevel;
                        } finally {
                                if (!isCancelled) {
                                        setCityRisk(finalRisk || calculateWaterRisk(searchedLocation));
                                        setIsLoadingCityRisk(false);
                                }
                        }
                }

                loadCityRisk();

                return function () {
                        isCancelled = true;
                };
        }, [isCountry, searchedLocation]);

        return (
                <div className="space-y-6">
                        {/* Location search bar */}
                        <form
                                onSubmit={handleSearch}
                                className="flex gap-3"
                        >
                                <div className="relative flex-1">
                                        <input
                                                list="known-locations"
                                                value={inputValue}
                                                onChange={function (e) { setInputValue(e.target.value); }}
                                                placeholder="Search a city or country (e.g. Windsor, ON or Canada)"
                                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-slate-500 backdrop-blur focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                                        />
                                        <datalist id="known-locations">
                                                {KNOWN_LOCATIONS.map(function (loc) {
                                                        return <option key={loc} value={loc} />;
                                                })}
                                        </datalist>
                                </div>
                                <button
                                        type="submit"
                                        className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]"
                                >
                                        Analyse
                                </button>
                        </form>

                        {/* Results */}
                        {isCountry && countryResult ? (
                                <CountryDashboard result={countryResult} />
                        ) : isLoadingCityRisk ? (
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
                                        Loading weather and risk data for <span className="text-white">{searchedLocation}</span>...
                                </div>
                        ) : cityRisk ? (
                                <>
                                        <RiskCard risk={cityRisk} />
                                        <div className="grid gap-6 lg:grid-cols-2">
                                                <AlertFeed alerts={cityRisk.activeAlerts} />
                                                <AISummary summary={cityRisk.explanation} confidence={cityRisk.confidence} />
                                        </div>
                                </>
                        ) : (
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
                                        No data found for <span className="text-white">{searchedLocation}</span>. Try a city like <em>Toronto, ON</em> or a country like <em>Canada</em>.
                                </div>
                        )}
		</div>
	);
}
