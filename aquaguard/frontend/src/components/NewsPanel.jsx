import React from 'react';

export default function NewsPanel({ articles }) {
  const list = Array.isArray(articles) ? articles : [];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Area news</h3>
          <p className="mt-1 text-sm text-slate-400">
            Headlines from NewsAPI: queries require water, weather, climate, or contamination-related terms, then results are
            ranked and filtered for relevance.
          </p>
        </div>
        <div className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          {list.length} {list.length === 1 ? 'story' : 'stories'}
        </div>
      </div>

      <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
        {list.map(function (article, index) {
          const key = article.url || article.title || String(index);
          return (
            <article key={key} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <div className="text-sm font-semibold text-white">{article.title}</div>
              {article.description ? (
                <p className="mt-2 line-clamp-3 text-sm text-slate-400">{article.description}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {article.source ? <span>{article.source}</span> : null}
                {article.publishedAt ? <span>· {new Date(article.publishedAt).toLocaleString()}</span> : null}
                {article.url ? (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">
                    Read article
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-slate-400">
            No recent water-related articles were returned for this area. Try a larger city name or verify NewsAPI
            credentials on the backend.
          </div>
        ) : null}
      </div>
    </section>
  );
}
