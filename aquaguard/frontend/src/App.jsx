import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import LeaderboardPage from './pages/LeaderboardPage';
import Overview from './pages/Overview';
import Report from './pages/Report';
import { UserAuthProvider } from './context/UserAuthContext';

export default function App() {
	const [activePage, setActivePage] = useState('home');

	function renderPage() {
		if (activePage === 'overview') {
			return <Overview />;
		}

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
		<UserAuthProvider>
			<div className="min-h-screen text-slate-100">
				<Navbar activePage={activePage} onNavigate={setActivePage} />
				<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
					{renderPage()}
				</main>
				<footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-slate-500 sm:px-6 lg:px-8">
					AquaGuard AI uses live weather, advisories, and community signals with transparent sources.
				</footer>
			</div>
		</UserAuthProvider>
	);
}
