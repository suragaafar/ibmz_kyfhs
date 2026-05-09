import React from 'react';

function levelStyles(level) {
	if (level === 'Safe') {
		return 'from-emerald-400 to-cyan-400 text-slate-950';
	}

	if (level === 'Caution') {
		return 'from-amber-300 to-orange-400 text-slate-950';
	}

	return 'from-rose-400 to-red-500 text-white';
}

export default function RiskCard({ risk }) {
	if (!risk) {
		return null;
	}

	return (
		<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Live water status</p>
					<h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{risk.location}</h2>
					<p className="mt-2 max-w-2xl text-sm text-slate-300">{risk.explanation}</p>
				</div>

				<div className={'rounded-2xl bg-gradient-to-r px-5 py-4 text-center shadow-lg ' + levelStyles(risk.riskLevel)}>
					<div className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">Risk Level</div>
					<div className="mt-1 text-3xl font-extrabold">{risk.riskLevel}</div>
					<div className="text-sm font-medium opacity-90">Score {risk.riskScore}/100</div>
				</div>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-3">
				<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
					<div className="text-xs uppercase tracking-[0.25em] text-slate-400">Confidence</div>
					<div className="mt-2 text-3xl font-bold text-cyan-200">{risk.confidence}%</div>
					<p className="mt-1 text-sm text-slate-400">Evidence confidence based on alerts, reports, and infrastructure context.</p>
				</div>

				<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
					<div className="text-xs uppercase tracking-[0.25em] text-slate-400">Active alerts</div>
					<div className="mt-2 text-3xl font-bold text-white">{risk.activeAlerts.length}</div>
					<p className="mt-1 text-sm text-slate-400">Official notices currently affecting the area.</p>
				</div>

				<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
					<div className="text-xs uppercase tracking-[0.25em] text-slate-400">Community signals</div>
					<div className="mt-2 text-3xl font-bold text-white">{risk.matchingReports.length}</div>
					<p className="mt-1 text-sm text-slate-400">Resident reports that help explain the score.</p>
				</div>
			</div>

			<div className="mt-6 grid gap-4 lg:grid-cols-2">
				<div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
					<h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Contributing factors</h3>
					<div className="mt-4 space-y-3">
						{risk.contributingFactors.map(function (factor) {
							return (
								<div key={factor.label} className="rounded-2xl bg-white/5 px-4 py-3">
									<div className="flex items-center justify-between gap-4">
										<div>
											<div className="font-medium text-white">{factor.label}</div>
											<div className="text-sm text-slate-400">{factor.detail}</div>
										</div>
										<div className="shrink-0 rounded-full bg-cyan-400/15 px-3 py-1 text-sm font-semibold text-cyan-200">
											+{factor.score}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
					<h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Active alerts</h3>
					<div className="mt-4 space-y-3">
						{risk.activeAlerts.map(function (alert) {
							return (
								<div key={alert.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
									<div className="flex items-start justify-between gap-4">
										<div>
											<div className="font-medium text-white">{alert.title}</div>
											<div className="text-sm text-slate-400">{alert.source} · {alert.location}</div>
										</div>
										<span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
											{alert.type.replace(/_/g, ' ')}
										</span>
									</div>
								</div>
							);
						})}
						{risk.activeAlerts.length === 0 ? (
							<div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-slate-400">
								No active official alerts were found for this location.
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	);
}
