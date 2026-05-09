import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import LeaderboardPage from './pages/LeaderboardPage';
import Report from './pages/Report';

export default function App() {
	const [activePage, setActivePage] = useState('home');

	function renderPage() {
		if (activePage === 'dashboard') {
			return <Dashboard />;
		}

		if (activePage === 'report') {
			return <Report />;
		}

		if (activePage === 'leaderboard') {
			return <LeaderboardPage />;
		}

		return <Home onNavigate={setActivePage} />;
	}

	return (
		<div className="min-h-screen text-slate-100">
			<Navbar activePage={activePage} onNavigate={setActivePage} />
			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
				{renderPage()}
			</main>
			<footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-slate-500 sm:px-6 lg:px-8">
				AquaGuard AI is a mock hackathon prototype with no real data connections yet.
			</footer>
		</div>
	);
}
