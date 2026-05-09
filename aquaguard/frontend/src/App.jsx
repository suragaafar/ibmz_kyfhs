import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import LeaderboardPage from './pages/LeaderboardPage';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import Report from './pages/Report';
import { UserAuthProvider, useUserAuth } from './context/UserAuthContext';

function AppContent() {
	const [activePage, setActivePage] = useState('home');
	const { isUserAuthenticated } = useUserAuth();

	function navigate(page) {
		const protectedRoutes = ['report', 'leaderboard', 'profile'];
		if (protectedRoutes.includes(page) && !isUserAuthenticated) {
			setActivePage('login');
			return;
		}

		setActivePage(page);
	}

	function renderPage() {
		if (activePage === 'overview') {
			return <Overview />;
		}

		if (activePage === 'dashboard') {
			return <Dashboard />;
		}

		if (activePage === 'report') {
			return isUserAuthenticated ? <Report /> : <Login onNavigate={setActivePage} />;
		}

		if (activePage === 'leaderboard') {
			return isUserAuthenticated ? <LeaderboardPage /> : <Login onNavigate={setActivePage} />;
		}

		if (activePage === 'profile') {
			return isUserAuthenticated ? <Profile /> : <Login onNavigate={setActivePage} />;
		}

		if (activePage === 'login') {
			return <Login onNavigate={setActivePage} />;
		}

		return <Home onNavigate={navigate} isUserAuthenticated={isUserAuthenticated} />;
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
