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

// ✅ NO MOCK DATA - Fetch real locations from backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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
	// ✅ Fetch locations from backend instead of mock data
	const [knownLocations, setKnownLocations] = useState([]);

	function handleSearch(e) {
		e.preventDefault();
		const trimmed = inputValue.trim();
		if (trimmed) {
			setSearchedLocation(trimmed);
		}
	}

	// ✅ NEW: Fetch real locations from backend
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
				// ✅ Start with minimal base risk - signals add the real data
				const baseRisk = calculateWaterRisk(searchedLocation);
				
				// Parse city and province for news search
				const locationParts = searchedLocation.split(',').map(part => part.trim());
				const city = locationParts[0];
				const province = locationParts[1] || '';

				// ✅ Load ALL real data sources
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
							source: signal.source,
							sourceUrl: signal.sourceUrl  // ✅ Include source URL
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
					setCityRisk(finalRisk);
					setIsLoadingCityRisk(false);
				}
			}
		}

		loadCityRisk();

		return function () {
			isCancelled = true;
		};
	}, [searchedLocation, isCountry]);

	return (
		<div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
			<div className="space-y-6">
				{/* Search bar */}
				<form onSubmit={handleSearch}>
					<div className="flex gap-3">
						<div className="relative flex-1">
							<input
								type="text"
								placeholder="Search city or country..."
								value={inputValue}
								onChange={function (e) { setInputValue(e.target.value); }}
								list="locations-list"
								className="w-full rounded-xl border border-cyan-400/30 bg-slate-950/50 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
							/>
							<datalist id="locations-list">
								{/* ✅ Use real locations from backend */}
								{knownLocations.map(function (location) {
									return (
										<option key={location} value={location}>
											{location}
										</option>
									);
								})}
							</datalist>
						</div>
						<button
							type="submit"
							className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 active:scale-95 transition-all"
						>
							Search
						</button>
					</div>
				</form>

				{/* Country view */}
				{isCountry && countryResult ? (
					<CountryDashboard result={countryResult} />
				) : null}

				{/* City view */}
				{!isCountry && (
					<>
						{isLoadingCityRisk ? (
							<div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-slate-400">
								Loading risk assessment...
							</div>
						) : cityRisk ? (
							<>
								<RiskCard risk={cityRisk} />
								<AISummary risk={cityRisk} />
							</>
						) : null}
					</>
				)}
			</div>

			{/* Alerts feed */}
			{!isCountry && cityRisk && (
				<AlertFeed alerts={cityRisk.activeAlerts} />
			)}
		</div>
	);
}
