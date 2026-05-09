import React, { useState } from 'react';
import ReportForm from '../components/ReportForm';
import { reports as initialReports } from '../data/reports';

export default function Report() {
	const [reports, setReports] = useState(initialReports);

	function handleSubmit(report) {
		setReports(function (current) {
			return [
				{
					id: Date.now(),
					...report,
					submittedBy: 'You',
					severity: 'medium'
				},
				...current
			];
		});
	}

	return (
		<div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
			<ReportForm onSubmit={handleSubmit} />

			<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
				<h3 className="text-lg font-semibold text-white">Recent reports</h3>
				<p className="text-sm text-slate-400">Mock submissions from the community data set.</p>

				<div className="mt-4 space-y-3">
					{reports.slice(0, 5).map(function (report) {
						return (
							<article key={report.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
								<div className="flex items-start justify-between gap-4">
									<div>
										<div className="font-semibold text-white">{report.issueType}</div>
										<div className="text-sm text-slate-400">{report.location} · {report.submittedBy}</div>
										<p className="mt-2 text-sm leading-6 text-slate-300">{report.description}</p>
									</div>
									<span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
										{report.severity}
									</span>
								</div>
							</article>
						);
					})}
				</div>
			</section>
		</div>
	);
}
