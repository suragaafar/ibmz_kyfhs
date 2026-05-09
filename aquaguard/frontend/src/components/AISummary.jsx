import React from 'react';

export default function AISummary({ summary, confidence }) {
	return (
		<section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold text-white">AI summary</h3>
					<p className="text-sm text-slate-300">Generated from live API signals and verified data sources.</p>
				</div>
				<div className="rounded-2xl border border-cyan-300/20 bg-slate-950/40 px-4 py-2 text-right">
					<div className="text-xs uppercase tracking-[0.22em] text-slate-400">Confidence</div>
					<div className="text-2xl font-bold text-cyan-200">{confidence}%</div>
				</div>
			</div>

			<p className="mt-4 text-sm leading-7 text-slate-200">{summary}</p>

			<div className="mt-5 grid gap-3 sm:grid-cols-3">
				{[
					'Combines official alerts',
					'Uses community signals',
					'Explains water status simply'
				].map(function (item) {
					return (
						<div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
							{item}
						</div>
					);
				})}
			</div>
		</section>
	);
}
