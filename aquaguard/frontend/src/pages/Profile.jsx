import React from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { defaultUsers } from '../components/Leaderboard';

export default function Profile() {
  const { user } = useUserAuth();
  const currentUser = user || { displayName: 'Guest', email: 'unknown', points: 0, createdAt: '', reports: [] };

  const rankedUsers = [...defaultUsers, { id: 0, name: currentUser.displayName, points: currentUser.points, badge: 'Your score' }]
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const currentRank = rankedUsers.find((entry) => entry.id === 0)?.rank ?? rankedUsers.length;
  const personalReports = currentUser.reports || [];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">Profile</p>
            <h1 className="mt-3 text-3xl font-bold text-white">{currentUser.displayName}</h1>
            <p className="mt-2 text-sm text-slate-400">{currentUser.email}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Leaderboard rank</div>
              <div className="mt-2 text-3xl font-extrabold text-white">#{currentRank}</div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Community points</div>
              <div className="mt-2 text-3xl font-extrabold text-cyan-200">{currentUser.points}</div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Member since</div>
              <div className="mt-2 text-base font-semibold text-white">{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '—'}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Your reports</h2>
            <p className="mt-2 text-sm text-slate-400">A record of what you submitted while signed in.</p>
          </div>
          <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            {personalReports.length} report{personalReports.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-6 max-h-[520px] space-y-3 overflow-y-auto pr-2">
          {personalReports.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm text-slate-400">
              You have not submitted any reports yet.
            </div>
          ) : (
            personalReports.map((report) => (
              <article key={report.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{report.issueType}</div>
                    <div className="mt-1 text-sm text-slate-400">{report.location}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{report.description}</p>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    <div>{new Date(report.submittedAt).toLocaleDateString()}</div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                      <span>{report.severity}</span>
                      <span className="text-cyan-200">+{report.points ?? 50} pts</span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
