'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketStore } from '@/store/marketStore';

type HeatmapMode = 'SECTORS' | 'NIFTY 50' | 'NIFTY 500';

export function MarketHeatmapWidget() {
  const { sectors, stocks } = useMarketStore();
  const [mode, setMode] = useState<HeatmapMode>('SECTORS');

  const sectorData = [
    { name: 'NIFTY BANK', change: 1.82, weight: 35 },
    { name: 'NIFTY AUTO', change: 1.46, weight: 12 },
    { name: 'NIFTY FMCG', change: 0.44, weight: 10 },
    { name: 'NIFTY METAL', change: 0.36, weight: 8 },
    { name: 'NIFTY PHARMA', change: 0.21, weight: 8 },
    { name: 'NIFTY REALTY', change: 0.15, weight: 4 },
    { name: 'NIFTY ENERGY', change: -0.25, weight: 14 },
    { name: 'NIFTY MEDIA', change: -0.42, weight: 3 },
    { name: 'NIFTY IT', change: -0.78, weight: 18 },
  ];

  const stockData50 = [
    { name: 'RELIANCE', change: 2.94, weight: 10 },
    { name: 'HDFCBANK', change: 2.13, weight: 12 },
    { name: 'TATAMOTORS', change: 3.02, weight: 6 },
    { name: 'ICICIBANK', change: 2.36, weight: 8 },
    { name: 'SBIN', change: 2.23, weight: 5 },
    { name: 'BHARTIARTL', change: 0.85, weight: 4 },
    { name: 'ITC', change: 0.42, weight: 4 },
    { name: 'LT', change: 0.18, weight: 4 },
    { name: 'HINDUNILVR', change: -0.15, weight: 3 },
    { name: 'KOTAKBANK', change: -0.42, weight: 3 },
    { name: 'TCS', change: -0.85, weight: 5 },
    { name: 'INFY', change: -1.45, weight: 6 },
  ];

  const liveSectors = sectors && sectors.length > 0
    ? sectors.slice(0, 9).map((s) => ({
        name: s.name,
        change: s.change,
        weight: s.weight || 10,
      }))
    : sectorData;

  const liveStocks = stocks && stocks.length > 0
    ? stocks.slice(0, 12).map((s) => ({
        name: s.symbol,
        change: s.percentChange,
        weight: 8,
      }))
    : stockData50;

  const activeItems = mode === 'SECTORS' ? liveSectors : liveStocks;

  // Compute background shade based on positive/negative magnitude
  const getBoxStyle = (change: number) => {
    if (change >= 2.0) return 'bg-emerald-600/90 text-white border-emerald-400/50';
    if (change > 0.5) return 'bg-emerald-700/60 text-emerald-100 border-emerald-500/30';
    if (change >= 0) return 'bg-emerald-900/40 text-emerald-200 border-emerald-500/20';
    if (change <= -2.0) return 'bg-rose-600/90 text-white border-rose-400/50';
    if (change < -0.5) return 'bg-rose-700/60 text-rose-100 border-rose-500/30';
    return 'bg-rose-900/40 text-rose-200 border-rose-500/20';
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#111925] border border-border/70 rounded p-0.5 text-xs">
          {(['SECTORS', 'NIFTY 50', 'NIFTY 500'] as HeatmapMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                mode === m
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-sm bg-rose-600" />
          <span>-2%</span>
          <span className="w-2 h-2 rounded-sm bg-rose-900/60" />
          <span>0%</span>
          <span className="w-2 h-2 rounded-sm bg-emerald-900/60" />
          <span className="w-2 h-2 rounded-sm bg-emerald-600" />
          <span>+2%</span>
        </div>
      </div>

      {/* Grid of Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 flex-1 min-h-[160px]">
        {activeItems.map((item) => (
          <div
            key={item.name}
            className={`rounded p-2 border flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer ${getBoxStyle(
              item.change
            )}`}
          >
            <div className="flex items-start justify-between gap-1">
              <span className="text-xs font-semibold tracking-tight truncate">
                {item.name.replace('NIFTY ', '')}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-sm font-bold font-mono">
                {item.change >= 0 ? `+${item.change.toFixed(2)}%` : `${item.change.toFixed(2)}%`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Click tile for breakdown</span>
        <span>Tile size represents index weight</span>
      </div>
    </div>
  );
}
