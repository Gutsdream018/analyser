'use client';

import React, { useEffect, useState } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { IndexStrip } from './index-strip';
import { GlobalStrip } from './global-strip';
import { MarketNarrative } from './market-narrative';
import { MarketSnapshot } from './market-snapshot';
import { SectorPerformanceClean } from './sector-performance-clean';
import { TopMoversClean } from './top-movers-clean';
import { FnoSnapshotClean } from './fno-snapshot-clean';
import { NewsFeedClean } from './news-feed-clean';
import { WatchlistClean } from './watchlist-clean';
import { WorkspaceView } from './WorkspaceView';
import { RefreshCw, LayoutGrid, BarChart2 } from 'lucide-react';

import { mockAiDailyBrief } from '@/lib/mock-data/analysis';
import { mockFnoSnapshot, mockOptionChainNifty } from '@/lib/mock-data/fno';

export function InstitutionalDashboard() {
  const [viewMode, setViewMode] = useState<'institutional' | 'modular'>('institutional');
  const [mounted, setMounted] = useState(false);

  const {
    indices,
    breadth,
    sectors,
    stocks,
    topMovers,
    fiiDii,
    globalMarkets,
    commodities,
    news,
    fnoSnapshot,
    optionChain,
    aiBrief,
    isLoading,
    refreshAllData,
    updateMarketSession,
  } = useMarketStore();

  useEffect(() => {
    setMounted(true);
    refreshAllData();
    updateMarketSession();

    const clockTimer = setInterval(() => {
      updateMarketSession();
    }, 1000);

    const refreshTimer = setInterval(() => {
      refreshAllData();
    }, 60000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(refreshTimer);
    };
  }, [refreshAllData, updateMarketSession]);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/[0.04] rounded w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/[0.03] rounded-lg border border-white/[0.06]" />
          ))}
        </div>
      </div>
    );
  }

  // If user selected modular workspace view
  if (viewMode === 'modular') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              VIEW MODE:
            </span>
            <div className="flex items-center gap-1 bg-[#141720] p-0.5 rounded-[4px] border border-white/[0.06]">
              <button
                onClick={() => setViewMode('institutional')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#6B7280] hover:text-[#9CA3AF] rounded-[3px] transition-colors"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                60s Terminal
              </button>
              <button
                onClick={() => setViewMode('modular')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white/[0.12] text-[#F3F4F6] rounded-[3px] font-semibold transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Custom Modular Workspace
              </button>
            </div>
          </div>
        </div>
        <WorkspaceView />
      </div>
    );
  }

  const vixIndex = indices.find((i) => i.symbol === 'INDIA VIX');
  const vixValue = vixIndex ? vixIndex.current : 12.82;
  const vixChange = vixIndex ? vixIndex.percentChange : -3.61;

  return (
    <div className="space-y-6 pb-12">
      {/* 0. Top Bar: View Mode Switcher & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-[#F8FAFC]">
              Indian Market Intelligence Terminal
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#FF2E51]/10 text-[#FF2E51] border border-[#FF2E51]/30 font-mono text-[10px] font-bold tracking-wider uppercase shadow-[0_0_8px_rgba(255,46,81,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] animate-pulse shadow-[0_0_6px_#FF2E51]" />
              <span>RED MARKET SIGNALS</span>
            </div>
          </div>
          <p className="text-xs font-mono text-[#94A3B8] mt-1 flex items-center gap-2">
            <span>NSE/BSE DEPTH</span>
            <span>•</span>
            <span>F&amp;O DERIVATIVE INFLECTIONS</span>
            <span>•</span>
            <span className="text-[#FF2E51]">INSTITUTIONAL LIQUIDITY ACTIVE</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-[#090608] p-0.5 rounded-[4px] border border-[#241117]">
            <button
              onClick={() => setViewMode('institutional')}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold bg-[#FF2E51]/15 text-[#FF2E51] border border-[#FF2E51]/30 rounded-[3px] transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5 text-[#FF2E51]" />
              Trading Terminal
            </button>
            <button
              onClick={() => setViewMode('modular')}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-[#64748B] hover:text-[#94A3B8] rounded-[3px] transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Workspace
            </button>
          </div>

          <button
            onClick={() => refreshAllData()}
            disabled={isLoading}
            className="p-1.5 rounded-[4px] bg-[#0C070A] border border-[#241117] text-slate-400 hover:text-[#FF2E51] hover:border-[#FF2E51]/45 transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FF2E51]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 1. Level 1: Primary Index Strip (NIFTY, BANK NIFTY, SENSEX, INDIA VIX) */}
      <section>
        <IndexStrip indices={indices} />
      </section>

      {/* 2. Global Markets & Macro Strip */}
      <section>
        <GlobalStrip globals={globalMarkets} commodities={commodities} />
      </section>

      {/* 3. Level 2: Market Narrative ("Today's Market", Key Drivers, What to Watch) */}
      <section>
        <MarketNarrative brief={aiBrief || mockAiDailyBrief} />
      </section>

      {/* 4. Level 3: Market Snapshot (Breadth with 52W Hi/Lo, FII/DII Flows, Volatility) */}
      <section>
        <MarketSnapshot
          breadth={breadth}
          fiiDii={fiiDii}
          vixValue={vixValue}
          vixChange={vixChange}
        />
      </section>

      {/* 5. Level 4: Sector Performance Grid (1D/1W/1M) */}
      <section>
        <SectorPerformanceClean sectors={sectors} />
      </section>

      {/* 6. Level 5: Top Movers Table (Gainers, Losers, Volume, Unusual Activity) */}
      <section>
        <TopMoversClean
          gainers={topMovers.gainers}
          losers={topMovers.losers}
          volumeShockers={topMovers.volumeShockers}
        />
      </section>

      {/* 7. Level 6: Derivatives & F&O Snapshot */}
      <section>
        <FnoSnapshotClean
          snapshot={fnoSnapshot || mockFnoSnapshot}
          optionChain={optionChain || mockOptionChainNifty}
        />
      </section>

      {/* 8. Level 7: Market News & Dispatches Feed */}
      <section>
        <NewsFeedClean articles={news} />
      </section>

      {/* 9. Level 8: Personal Watchlist (Sparklines & Add stock) */}
      <section>
        <WatchlistClean stocks={stocks} />
      </section>
    </div>
  );
}
