'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Clock } from 'lucide-react';
import { useMarketStore } from '@/store/marketStore';

type NewsCategory = 'All' | 'Market' | 'Economy' | 'Stocks' | 'Global';

export function NewsWidget() {
  const { news } = useMarketStore();
  const [activeTab, setActiveTab] = useState<NewsCategory>('All');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const fallbackArticles = [
    {
      id: '1',
      time: '15:20',
      headline: 'RBI keeps policy stance unchanged; signals growth resilience',
      source: 'Reuters',
      sentiment: 'positive',
      category: 'Economy',
      summary: 'The Reserve Bank of India maintained the benchmark repo rate at 6.50% while emphasizing continuous vigilance on retail food inflation.',
    },
    {
      id: '2',
      time: '14:45',
      headline: 'HDFC Bank gains 2% on strong quarterly deposit mobilization outlook',
      source: 'Bloomberg',
      sentiment: 'positive',
      category: 'Stocks',
      summary: 'Private sector bellwether HDFC Bank saw strong institutional buying following management updates regarding improved credit-deposit metrics.',
    },
    {
      id: '3',
      time: '13:10',
      headline: 'Tata Motors surges 3% on festive season commercial demand optimism',
      source: 'CNBC-TV18',
      sentiment: 'positive',
      category: 'Stocks',
      summary: 'Automaker Tata Motors experienced increased volume turnover as dealers reported strong pre-bookings ahead of Navratri and Diwali.',
    },
    {
      id: '4',
      time: '11:35',
      headline: 'IT stocks under pressure as global enterprise tech budgets stay constrained',
      source: 'LiveMint',
      sentiment: 'negative',
      category: 'Market',
      summary: 'NIFTY IT retreated 0.8% following cautious commentary from US counterparts on discretionary digital transformation project timelines.',
    },
    {
      id: '5',
      time: '10:20',
      headline: 'Crude prices decline to $71/bbl amid potential Libyan supply resumption',
      source: 'Financial Times',
      sentiment: 'neutral',
      category: 'Global',
      summary: 'Brent crude dipped over 1.5% as reports signaled an impending resolution between eastern and western Libyan factions over central bank leadership.',
    },
  ];

  const articles = news && news.length > 0
    ? news.map((n, i) => ({
        id: n.id || String(i),
        time: n.timeAgo || 'Recently',
        headline: n.headline,
        source: n.source || 'MarketWire',
        sentiment: n.impact === 'High' ? 'positive' : n.impact === 'Low' ? 'negative' : 'neutral',
        category: n.category || 'Market',
        summary: n.summary || n.headline,
      }))
    : fallbackArticles;

  const filteredArticles = activeTab === 'All'
    ? articles
    : articles.filter((a) => a.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="flex flex-col h-full justify-between space-y-3">
      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-border/70 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['All', 'Market', 'Economy', 'Stocks', 'Global'] as NewsCategory[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Link
          href="/news"
          className="text-[11px] text-rose-400 hover:text-rose-300 font-medium whitespace-nowrap pl-2"
        >
          View all →
        </Link>
      </div>

      {/* News list */}
      <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] pr-1">
        {filteredArticles.slice(0, 6).map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedArticle(item)}
            className="group p-2 rounded border border-border/50 hover:border-slate-600 hover:bg-[#111925] cursor-pointer transition-all flex items-start gap-2.5"
          >
            {/* Sentiment dot */}
            <span
              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                item.sentiment === 'positive'
                  ? 'bg-emerald-400'
                  : item.sentiment === 'negative'
                  ? 'bg-rose-400'
                  : 'bg-amber-400'
              }`}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mb-0.5">
                <span className="flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {item.time}
                </span>
                <span>•</span>
                <span className="text-slate-300">{item.source}</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-border/50 text-slate-400">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-200 group-hover:text-white font-medium line-clamp-2 leading-relaxed">
                {item.headline}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Preview Sheet */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D131D] border border-border rounded-lg max-w-lg w-full p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>{selectedArticle.source}</span>
                <span>•</span>
                <span>{selectedArticle.time}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-semibold text-white leading-snug">
              {selectedArticle.headline}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed bg-[#111925] p-3 rounded border border-border/60">
              {selectedArticle.summary}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Category: <strong className="text-slate-200">{selectedArticle.category}</strong>
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-border/50">
        <span>Curated Real-Time Feed</span>
        <span>Updated Every 60s</span>
      </div>
    </div>
  );
}
