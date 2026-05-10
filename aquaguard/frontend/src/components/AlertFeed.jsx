import React from 'react';

export default function AlertFeed({ alerts }) {
	return (
		<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold text-white">Alert feed</h3>
					<p className="text-sm text-slate-400">Live official alerts and warning signals.</p>
				</div>
				<div className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
					{alerts.length} active
				</div>
			</div>

			<div className="mt-4 space-y-3">
				{alerts.map(function (alert) {
					return (
						<article key={alert.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
							<div className="flex items-start justify-between gap-4">
								<div>
									<div className="text-sm font-semibold text-white">{alert.title}</div>
									<div className="mt-1 text-sm text-slate-400">{alert.source} · {alert.location}{alert.sourceUrl ? (<> · <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Verify</a></>) : null}</div>
								</div>
								<span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 bg-gradient-to-r from-cyan-300 to-teal-300">
									{alert.type.replace(/_/g, ' ')}
								</span>
							</div>
						</article>
					);
				})}
				{alerts.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-slate-400">
						No alerts right now.
					</div>
				) : null}
			</div>
		</section>
	);
}
