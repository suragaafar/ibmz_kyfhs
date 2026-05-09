import React from 'react';

export default function Home({ onNavigate }) {
	const highlights = [
		{ label: 'Water status', value: 'Safe / Caution / Unsafe' },
		{ label: 'Evidence', value: 'Alerts + reports + flood risk' },
		{ label: 'Speed', value: 'Real-time signal scoring' }
	];

	return (
		<div className="space-y-8">
			<section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8 lg:p-10">
				<div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
					<div>
						<div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
							Live data platform
						</div>
						<h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
							AI-powered water health intelligence for safer communities.
						</h1>
						<p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
							AquaGuard AI combines live weather alerts, official advisories, flood risk, and community reports into a clear water status with source-backed explanation.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<button
								onClick={() => onNavigate('dashboard')}
								className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]"
							>
								View live dashboard
							</button>
							<button
								onClick={() => onNavigate('report')}
								className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
							>
								Report an issue
							</button>
						</div>
					</div>

					<div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5">
						{highlights.map(function (item) {
							return (
								<div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
									<div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
									<div className="mt-2 text-lg font-semibold text-white">{item.value}</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{[
					{
						title: 'Simple status',
						text: 'One-screen water condition view for Safe, Caution, or Unsafe.'
					},
					{
						title: 'Transparent logic',
						text: 'Transparent scoring shows why a location is flagged.'
					},
					{
						title: 'Community driven',
						text: 'Resident reports add important real-world context to the score.'
					}
				].map(function (card) {
					return (
						<div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
							<div className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/80">{card.title}</div>
							<p className="mt-3 text-sm leading-7 text-slate-300">{card.text}</p>
						</div>
					);
				})}
			</section>
		</div>
	);
}
