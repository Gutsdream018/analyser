'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchMarketOverview } from '../lib/api';
import { MarketOverviewResponse } from '../lib/types';
import { IndexCard } from './IndexCard';

export function MarketDashboard() {
  const [data, setData] = useState<MarketOverviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMarketOverview();
      setData(response);
      setLastRefreshed(new Date());
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to reach the MarketPulse API server. Ensure the backend is running.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Check if any quote is from a mock provider
  const isDevelopmentData =
    data?.overview?.indices?.some((idx) => idx.source.toLowerCase() === 'mock') ?? true;

  const toneColorMap = {
    positive: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
    negative: 'bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30',
    mixed: 'bg-[#D9A441]/15 text-[#D9A441] border-[#D9A441]/30',
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & DEVELOPMENT DATA BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-[#F3F4F6]">
              MarketPulse
            </h1>
            {isDevelopmentData && (
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-[#D9A441]/15 text-[#D9A441] border border-[#D9A441]/30">
                DEVELOPMENT DATA
              </span>
            )}
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Indian Equity Market Heartbeat &bull; Provider-to-Engine Architecture
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <span className="text-[11px] font-mono text-[#6B7280]">
              Refreshed: {lastRefreshed.toLocaleTimeString('en-IN')}
            </span>
          )}
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-mono font-medium rounded bg-white/[0.08] hover:bg-white/[0.14] text-[#F3F4F6] border border-white/[0.08] transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* 2. ERROR STATE (READABLE MESSAGE, NO CRASH) */}
      {error && (
        <div className="p-4 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-[#F43F5E] font-bold">
            <span>Market Data Feed Unavailable</span>
            <button
              onClick={loadData}
              className="underline hover:text-white transition-colors"
            >
              Retry Connection
            </button>
          </div>
          <p className="text-[#9CA3AF] leading-relaxed">{error}</p>
          <p className="text-[11px] text-[#6B7280]">
            Backend endpoint target: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}
          </p>
        </div>
      )}

      {/* 3. LOADING SKELETON */}
      {loading && !data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-[#11141A] border border-white/[0.08] animate-pulse" />
          ))}
        </div>
      )}

      {/* 4. DASHBOARD CONTENT */}
      {data && (
        <div className="space-y-6">
          {/* Indices Cards Grid */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Key Indian Benchmarks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.overview.indices.map((quote) => (
                <IndexCard key={quote.symbol} quote={quote} />
              ))}
            </div>
          </section>

          {/* Market Tone & Summary Strip */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Market Tone & Advance Ratio */}
            <div className="bg-[#11141A] border border-white/[0.08] rounded-lg p-5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] block mb-1">
                  Market Tone &amp; Ratio
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded border tracking-wider ${
                      toneColorMap[data.summary.market_tone] || toneColorMap.mixed
                    }`}
                  >
                    Tone: {data.summary.market_tone}
                  </span>
                  <div className="text-xl font-bold font-mono text-[#F3F4F6] tabular-nums">
                    {data.summary.advance_ratio} <span className="text-xs text-[#9CA3AF] font-normal">A/D</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] font-mono text-[#9CA3AF]">
                Calculated by pure market summary engine from normalized breadth metrics.
              </div>
            </div>

            {/* Market Breadth Breakdown */}
            <div className="bg-[#11141A] border border-white/[0.08] rounded-lg p-5 flex flex-col justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] block mb-2">
                Exchange Breadth
              </span>
              <div className="grid grid-cols-3 gap-2 text-center my-1">
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] font-mono text-[#6B7280] block">Advances</span>
                  <span className="text-base font-bold font-mono text-[#10B981] tabular-nums">
                    {data.overview.breadth.advances}
                  </span>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] font-mono text-[#6B7280] block">Declines</span>
                  <span className="text-base font-bold font-mono text-[#F43F5E] tabular-nums">
                    {data.overview.breadth.declines}
                  </span>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] font-mono text-[#6B7280] block">Unchanged</span>
                  <span className="text-base font-bold font-mono text-[#9CA3AF] tabular-nums">
                    {data.overview.breadth.unchanged}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-[10px] font-mono text-[#6B7280] text-right">
                Total Tracked: {data.overview.breadth.advances + data.overview.breadth.declines + data.overview.breadth.unchanged}
              </div>
            </div>

            {/* Top & Bottom Sectors Spotlight */}
            <div className="bg-[#11141A] border border-white/[0.08] rounded-lg p-5 flex flex-col justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] block mb-2">
                Sector Leaders &amp; Laggards
              </span>
              <div className="space-y-2 text-xs font-mono">
                {data.summary.top_sector && (
                  <div className="flex items-center justify-between p-2 rounded bg-[#10B981]/5 border border-[#10B981]/15">
                    <span className="text-[#9CA3AF]">Top Sector:</span>
                    <span className="font-bold text-[#10B981]">
                      {data.summary.top_sector.name} (+{data.summary.top_sector.change_percent.toFixed(2)}%)
                    </span>
                  </div>
                )}
                {data.summary.bottom_sector && (
                  <div className="flex items-center justify-between p-2 rounded bg-[#F43F5E]/5 border border-[#F43F5E]/15">
                    <span className="text-[#9CA3AF]">Lagging Sector:</span>
                    <span className="font-bold text-[#F43F5E]">
                      {data.summary.bottom_sector.name} ({data.summary.bottom_sector.change_percent.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-[10px] font-mono text-[#6B7280]">
                Derived from {data.overview.sectors.length} sectoral indices.
              </div>
            </div>
          </section>

          {/* Sector Performance Grid */}
          <section className="bg-[#11141A] border border-white/[0.08] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Sectoral Breakdown
              </h2>
              <span className="text-[11px] font-mono text-[#6B7280]">
                As of {new Date(data.overview.as_of).toLocaleDateString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {data.overview.sectors.map((sec) => {
                const isPos = sec.change_percent >= 0;
                return (
                  <div
                    key={sec.name}
                    className="p-3 rounded bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-[#F3F4F6] font-medium truncate pr-2">
                      {sec.name}
                    </span>
                    <span
                      className={`font-bold tabular-nums shrink-0 ${
                        isPos ? 'text-[#10B981]' : 'text-[#F43F5E]'
                      }`}
                    >
                      {isPos ? '+' : ''}{sec.change_percent.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
