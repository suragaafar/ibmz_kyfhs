import React from 'react';

const items = [
	{ id: 'home', label: 'Home' },
	{ id: 'dashboard', label: 'Dashboard' },
	{ id: 'report', label: 'Report' },
	{ id: 'leaderboard', label: 'Leaderboard' }
];

export default function Navbar({ activePage, onNavigate }) {
	return (
		<header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
				<button className="flex items-center gap-3 text-left" onClick={() => onNavigate('home')}>
					<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200 shadow-glow ring-1 ring-cyan-300/30">
						<span className="text-lg font-bold">A</span>
					</div>
					<div>
						<div className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/80">AquaGuard AI</div>
						<div className="text-xs text-slate-400">Water health intelligence</div>
					</div>
				</button>

				<nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
					{items.map(function (item) {
						const isActive = activePage === item.id;
						return (
							<button
								key={item.id}
								onClick={() => onNavigate(item.id)}
								className={
									'rounded-full px-4 py-2 text-sm font-medium transition ' +
									(isActive ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/30' : 'text-slate-300 hover:bg-white/10 hover:text-white')
								}
							>
								{item.label}
							</button>
						);
					})}
				</nav>
			</div>

			<div className="border-t border-white/5 px-4 py-3 md:hidden">
				<div className="flex flex-wrap gap-2">
					{items.map(function (item) {
						const isActive = activePage === item.id;
						return (
							<button
								key={item.id}
								onClick={() => onNavigate(item.id)}
								className={
									'rounded-full px-3 py-1.5 text-xs font-semibold transition ' +
									(isActive ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300')
								}
							>
								{item.label}
							</button>
						);
					})}
				</div>
			</div>
		</header>
	);
}
