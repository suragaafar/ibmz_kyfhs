// ✅ UPDATED: Display source links for each signal
import React from 'react';

export default function AlertFeed({ alerts = [] }) {
	if (!alerts || alerts.length === 0) {
		return (
			<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
				<h3 className="text-lg font-semibold text-white">Risk factors</h3>
				<p className="text-sm text-slate-400">No active alerts detected.</p>
			</section>
		);
	}

	return (
		<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
			<h3 className="text-lg font-semibold text-white">Contributing factors</h3>
			<p className="text-sm text-slate-400">
				{alerts.length} active {alerts.length === 1 ? 'signal' : 'signals'} affecting risk level.
			</p>

			<div className="mt-4 space-y-3">
				{alerts.map(function (alert, index) {
					return (
						<article key={index} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<div className="font-semibold text-white">{alert.title}</div>
									<div className="mt-1 text-sm text-slate-400">
										{/* ✅ NEW: Display source with clickable link */}
										{alert.source}
										{alert.sourceUrl && (
											<>
												{' · '}
												<a
													href={alert.sourceUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-cyan-400 hover:text-cyan-300 underline hover:no-underline"
												>
													Verify source →
												</a>
											</>
										)}
									</div>
									{alert.description && (
										<p className="mt-2 text-sm text-slate-300">{alert.description}</p>
									)}
								</div>
								<span className="shrink-0 rounded-full bg-cyan-400/15 px-3 py-1 text-sm font-semibold text-cyan-200">
									+{alert.points}
								</span>
							</div>
						</article>
					);
				})}
			</div>

			<div className="mt-4 rounded-lg border border-white/10 bg-slate-950/30 p-3 text-xs text-slate-400">
				💡 <strong>All data is sourced from real-time APIs and official databases.</strong> Click "Verify source" links to check the original data sources.
			</div>
		</section>
	);
}
