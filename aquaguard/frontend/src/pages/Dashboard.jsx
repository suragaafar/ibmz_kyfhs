import React from 'react';
import AlertFeed from '../components/AlertFeed';
import AISummary from '../components/AISummary';
import RiskCard from '../components/RiskCard';
import { calculateWaterRisk } from '../utils/riskEngine';

export default function Dashboard() {
	const risk = calculateWaterRisk('Windsor, ON');

	return (
		<div className="space-y-6">
			<RiskCard risk={risk} />

			<div className="grid gap-6 lg:grid-cols-2">
				<AlertFeed alerts={risk.activeAlerts} />
				<AISummary summary={risk.explanation} confidence={risk.confidence} />
			</div>

			<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
				<h3 className="text-lg font-semibold text-white">Why Windsor, ON?</h3>
				<p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
					This dashboard is hard-coded to Windsor, ON so the team can demo a consistent example. The risk engine combines active alerts, community reports, and flood-zone context to produce a startup-friendly summary.
				</p>
			</section>
		</div>
	);
}
