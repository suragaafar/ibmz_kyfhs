import React from 'react';

export const defaultUsers = [
	{ id: 1, name: 'River Watcher', points: 1280, badge: 'Top reporter' },
	{ id: 2, name: 'Blue Drop Team', points: 1160, badge: 'Leak finder' },
	{ id: 3, name: 'CleanFlow Crew', points: 1035, badge: 'Water saver' },
	{ id: 4, name: 'Aqua Scout', points: 920, badge: 'Rapid responder' },
	{ id: 5, name: 'Eco Lens', points: 840, badge: 'Community helper' }
];

export default function Leaderboard({ users = defaultUsers }) {
	return (
		<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold text-white">Water-saving leaderboard</h3>
					<p className="text-sm text-slate-400">Community points for engagement and reporting activity.</p>
				</div>
				<div className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
					Community points
				</div>
			</div>

			<div className="mt-5 max-h-[520px] space-y-3 overflow-y-auto pr-2">
				{users.map(function (user, index) {
					return (
						<div key={user.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4">
							<div className="flex items-center gap-4">
								<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-sm font-bold text-cyan-200">
									{index + 1}
								</div>
								<div>
									<div className="font-semibold text-white">{user.name}</div>
									<div className="text-sm text-slate-400">{user.badge}</div>
								</div>
							</div>
							<div className="text-right">
								<div className="text-lg font-bold text-cyan-200">{user.points}</div>
								<div className="text-xs uppercase tracking-[0.2em] text-slate-400">points</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
