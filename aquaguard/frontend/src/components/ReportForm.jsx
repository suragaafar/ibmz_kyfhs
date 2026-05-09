import React, { useState } from 'react';

const initialState = {
	location: 'Windsor, ON',
	issueType: 'cloudy water',
	description: ''
};

export default function ReportForm({ onSubmit }) {
	const [formData, setFormData] = useState(initialState);

	function handleChange(event) {
		const { name, value } = event.target;
		setFormData(function (current) {
			return { ...current, [name]: value };
		});
	}

	function handleSubmit(event) {
		event.preventDefault();
		onSubmit({
			...formData,
			submittedAt: new Date().toISOString()
		});
		setFormData(initialState);
	}

	return (
		<form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold text-white">Report water issue</h3>
					<p className="text-sm text-slate-400">Submit a quick community signal. No login required.</p>
				</div>
				<div className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
					Community report
				</div>
			</div>

			<div className="mt-5 grid gap-4 sm:grid-cols-2">
				<label className="block">
					<span className="mb-2 block text-sm font-medium text-slate-200">Location</span>
					<input
						name="location"
						value={formData.location}
						onChange={handleChange}
						className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
						placeholder="Windsor, ON"
					/>
				</label>

				<label className="block">
					<span className="mb-2 block text-sm font-medium text-slate-200">Issue type</span>
					<select
						name="issueType"
						value={formData.issueType}
						onChange={handleChange}
						className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
					>
						<option value="cloudy water">Cloudy water</option>
						<option value="brown water">Brown water</option>
						<option value="strange smell">Strange smell</option>
						<option value="low pressure">Low pressure</option>
						<option value="taste change">Taste change</option>
					</select>
				</label>
			</div>

			<label className="mt-4 block">
				<span className="mb-2 block text-sm font-medium text-slate-200">Description</span>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleChange}
					rows="4"
					className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
					placeholder="Describe what you saw, smelled, or tasted."
				/>
			</label>

			<button
				type="submit"
				className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] sm:w-auto"
			>
				Submit report
			</button>
		</form>
	);
}
