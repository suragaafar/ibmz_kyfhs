import React from 'react';
import Leaderboard from '../components/Leaderboard';

export default function LeaderboardPage() {
	return (
		<div className="space-y-6">
			<Leaderboard />
			<section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
				AquaGuard AI uses leaderboard points as a community incentive system for reporting issues and helping keep the water network visible.
			</section>
		</div>
	);
}
