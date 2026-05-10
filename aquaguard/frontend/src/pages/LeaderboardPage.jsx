import React from 'react';
import Leaderboard, { defaultUsers } from '../components/Leaderboard';
import { useUserAuth } from '../context/UserAuthContext';

export default function LeaderboardPage() {
	const { isUserAuthenticated, user } = useUserAuth();
	const leaderboardUsers = isUserAuthenticated
		? [
				...defaultUsers,
				{
					id: 'you',
					name: `${user?.displayName || user?.email || 'You'} (You)`,
					points: user?.points ?? 0,
					badge: 'Your score',
				},
			]
		: defaultUsers;

	const sortedUsers = leaderboardUsers.sort((a, b) => b.points - a.points);

	return (
		<div className="space-y-6">
			<Leaderboard users={sortedUsers} />
			<section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
				AquaGuard uses leaderboard points as a community incentive system for reporting issues and helping keep the water network visible.
			</section>
		</div>
	);
}
