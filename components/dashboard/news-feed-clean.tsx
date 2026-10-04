'use client';

import React from 'react';
import Link from 'next/link';
import { NewsArticle } from '@/types/news';
import { ArrowRight } from 'lucide-react';

interface NewsFeedCleanProps {
  articles: NewsArticle[];
}

export function NewsFeedClean({ articles }: NewsFeedCleanProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#241117]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
            MARKET NEWS &amp; DISPATCHES
          </h2>
          <p className="text-xs text-[#6B7280]">
            Financial wire headlines tagged by market relevance and impacted tickers
          </p>
        </div>

        <Link
          href="/news"
          className="text-xs font-mono font-medium text-[#94A3B8] hover:text-[#FF2E51] inline-flex items-center gap-1 transition-colors"
        >
          View All News <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Clean list feed (not huge cards) */}
      <div className="fin-card divide-y divide-[#241117] overflow-hidden bg-[#0C070A] border border-[#241117]">
        {articles.slice(0, 4).map((art) => (
          <div
            key={art.id}
            className="p-4 sm:p-4.5 hover:bg-[#130B10]/70 transition-colors flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
          >
            <div className="space-y-1.5 flex-1 pr-4">
              <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                <span className="font-mono font-semibold text-[#94A3B8]">{art.source}</span>
                <span>•</span>
                <span>{art.timeAgo}</span>
                <span>•</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#130B10] border border-[#241117] text-[#9CA3AF]">
                  {art.category}
                </span>
              </div>

              <h3 className="text-sm font-medium text-[#F8FAFC] hover:text-[#FF2E51] transition-colors leading-snug cursor-pointer">
                {art.headline}
              </h3>

              <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-1">
                {art.summary}
              </p>
            </div>

            {/* Related Ticker Badges */}
            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center mt-1 sm:mt-0">
              {art.relatedSymbols.slice(0, 3).map((sym) => (
                <Link
                  key={sym}
                  href={`/stocks/${sym}`}
                  className="font-mono text-[11px] font-medium text-[#94A3B8] hover:text-[#FF2E51] bg-[#130B10] hover:bg-[#FF2E51]/10 hover:border-[#FF2E51]/30 px-2 py-0.5 rounded-[3px] border border-[#241117] transition-colors"
                >
                  {sym}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
