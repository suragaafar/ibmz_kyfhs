import React, { useEffect, useState } from 'react';
import ReportForm from '../components/ReportForm';
import { getReports, createReport } from '../api/reportsApi';
import { searchWaterNews } from '../api/newsApi';
import { useUserAuth } from '../context/UserAuthContext';

export default function Report() {
	const { isUserAuthenticated, addReport } = useUserAuth();
	const [reports, setReports] = useState([]);
	const [newsArticles, setNewsArticles] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState('Windsor, ON');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(function () {
		async function loadReportsAndNews() {
			setIsLoading(true);

			// Load reports
			const data = await getReports(selectedLocation);
			setReports(data || []);

			// Load related news
			const locationParts = selectedLocation.split(',').map(part => part.trim());
			const city = locationParts[0];
			const province = locationParts[1] || '';
			const newsData = await searchWaterNews(city, province);
			setNewsArticles(newsData.articles || []);

			setIsLoading(false);
		}

		loadReportsAndNews();
	}, [selectedLocation]);

	async function handleSubmit(report) {
		const newReport = await createReport(report.location, report.issueType, report.description);

		if (newReport) {
			setReports(function (current) {
				return [newReport, ...current];
			});

			setSelectedLocation(report.location);

			if (isUserAuthenticated) {
				addReport({
					id: newReport.id,
					location: newReport.location,
					issueType: newReport.issueType,
					description: newReport.description,
					severity: newReport.severity || 'medium',
					submittedAt: newReport.submittedAt || report.submittedAt,
					points: 50,
				});
			}
		}
	}

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<ReportForm onSubmit={handleSubmit} />

			<div className="space-y-6">
				{/* Community Reports Section */}
				<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
					<h3 className="text-lg font-semibold text-white">Community reports</h3>
					<p className="text-sm text-slate-400">Recent submissions for {selectedLocation}.</p>

					{isLoading ? (
						<div className="mt-4 text-sm text-slate-400">Loading...</div>
					) : reports.length === 0 ? (
						<div className="mt-4 text-sm text-slate-400">No reports yet for this location.</div>
					) : (
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
					)}
				</section>

				{/* News Articles Section */}
				{newsArticles.length > 0 && (
					<section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
						<h3 className="text-lg font-semibold text-white">Local news</h3>
						<p className="text-sm text-slate-400">Recent water-related news for {selectedLocation}.</p>

						<div className="mt-4 space-y-3">
							{newsArticles.slice(0, 5).map(function (article, index) {
								return (
									<article key={index} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 hover:border-cyan-400/30 transition-colors">
										<a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
											<div className="font-semibold text-cyan-400 hover:text-cyan-300 line-clamp-2">{article.title}</div>
											<div className="text-xs text-slate-500 mt-1">{article.source} · {new Date(article.publishedAt).toLocaleDateString()}</div>
											<p className="mt-2 text-sm leading-6 text-slate-300 line-clamp-2">{article.description}</p>
										</a>
									</article>
								);
							})}
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
