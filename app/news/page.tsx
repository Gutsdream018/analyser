'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNewsArticles, getMarketContext } from '@/lib/api/news';
import { NewsArticle, MarketContextItem } from '@/types/news';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [contextItems, setContextItems] = useState<MarketContextItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function loadNews() {
      const [art, ctx] = await Promise.all([getNewsArticles(selectedCategory), getMarketContext()]);
      setArticles(art);
      setContextItems(ctx);
    }
    loadNews();
  }, [selectedCategory]);

  const categories = ['All', 'Macro', 'Sector', 'Corporate'];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Market News &amp; Corporate Dispatches
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Verified financial headlines, regulatory disclosures, and macroeconomic developments
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-[#141720] p-1 rounded-[5px] border border-white/[0.08]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-[3px] transition-colors ${
                selectedCategory === cat
                  ? 'bg-white/[0.12] text-[#F3F4F6] font-semibold'
                  : 'text-[#6B7280] hover:text-[#9CA3AF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Articles + Market Context Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* News Feed Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="pb-2 border-b border-white/[0.06]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              LATEST HEADLINES
            </h2>
          </div>

          <div className="fin-card divide-y divide-white/[0.05] overflow-hidden">
            {articles.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#6B7280]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#9CA3AF]">{item.source}</span>
                    <span>•</span>
                    <span>{item.timeAgo}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                    item.impact === 'High'
                      ? 'bg-[#FF2E51]/15 text-[#FF2E51] border border-[#FF2E51]/30 font-semibold'
                      : 'bg-[#130B10] text-[#9CA3AF] border border-[#241117]'
                  }`}>
                    {item.impact} Impact
                  </span>
                </div>

                <h3 className="text-[15px] font-medium text-[#F3F4F6] hover:text-[#FF2E51] transition-colors leading-snug cursor-pointer">
                  {item.headline}
                </h3>

                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#6B7280]">
                  <span>IMPACTED TICKERS:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.relatedSymbols.map((sym) => (
                      <Link
                        key={sym}
                        href={`/stocks/${sym}`}
                        className="text-[11px] font-mono text-[#FF2E51] bg-[#130B10] hover:bg-[#FF2E51]/10 px-2 py-0.5 rounded border border-[#241117] hover:border-[#FF2E51]/30 transition-colors"
                      >
                        {sym}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Context Side Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="pb-2 border-b border-[#241117]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              MARKET CONTEXT
            </h2>
          </div>

          <div className="space-y-3">
            {contextItems.map((ctx) => (
              <div key={ctx.id} className="fin-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#F3F4F6]">{ctx.title}</h4>
                  <span className="text-[10px] font-mono text-[#FF2E51] px-1.5 py-0.5 rounded bg-[#FF2E51]/10 border border-[#FF2E51]/25">
                    {ctx.impactLevel}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {ctx.summary}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {ctx.affectedSectors.map((sec) => (
                    <span key={sec} className="text-[10px] font-mono text-[#6B7280] bg-white/[0.03] px-1.5 py-0.5 rounded">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
