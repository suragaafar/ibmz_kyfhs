import React from 'react';

export default function WeatherSnapshot({ weather }) {
  if (!weather) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
        <h3 className="text-lg font-semibold text-white">Live weather</h3>
        <p className="mt-2 text-sm text-slate-400">No weather payload returned.</p>
      </section>
    );
  }

  if (!weather.available) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Live weather</h3>
            <p className="mt-1 text-sm text-slate-400">Open-Meteo forecast for this analysis run.</p>
          </div>
          <span className="rounded-full bg-slate-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Unavailable
          </span>
        </div>
        <p className="mt-4 text-sm text-amber-100/90">{weather.message || 'Weather could not be loaded for this location.'}</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Live weather</h3>
          <p className="mt-1 text-sm text-slate-400">Latest conditions from Open-Meteo (refreshed each analysis).</p>
          {weather.fetchedAt ? (
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-200/60">
              Updated {new Date(weather.fetchedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <span
          className={
            'shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ' +
            (weather.active ? 'bg-amber-400/20 text-amber-200' : 'bg-emerald-400/15 text-emerald-200')
          }
        >
          {weather.active ? 'Elevated runoff signal' : 'Typical conditions'}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-slate-950/50 p-4">
        <div className="text-2xl font-bold text-white">{weather.headline || weather.conditionLabel || 'Current conditions'}</div>
        {weather.title ? <p className="mt-2 text-sm text-slate-300">{weather.title}</p> : null}
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {weather.temperatureC != null ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Temperature</dt>
              <dd className="mt-1 font-medium text-cyan-100">{Math.round(weather.temperatureC)}°C</dd>
            </div>
          ) : null}
          {weather.humidityPercent != null ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Humidity</dt>
              <dd className="mt-1 font-medium text-cyan-100">{Math.round(weather.humidityPercent)}%</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Rain (now)</dt>
            <dd className="mt-1 font-medium text-cyan-100">{Number(weather.currentRainMm ?? 0).toFixed(1)} mm</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Max precip chance (24h)</dt>
            <dd className="mt-1 font-medium text-cyan-100">
              {Math.round(weather.maxPrecipitationProbabilityPercent ?? 0)}%
            </dd>
          </div>
        </dl>
        {weather.sourceUrl ? (
          <a
            href={weather.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-cyan-300 underline"
          >
            {weather.source || 'Data source'}
          </a>
        ) : null}
      </div>
    </section>
  );
}
