'use client';

import React, { useState } from 'react';
import { useMarketStore } from '@/store/marketStore';

type Timeframe = '1D' | '1W' | '1M';

export function FiiDiiWidget() {
  const { fiiDii, isLoading } = useMarketStore();
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');

  const latest = fiiDii && fiiDii.length > 0 ? fiiDii[0] : null;

  // Multiplier for demo simulation based on selected timeframe
  const mult = timeframe === '1D' ? 1 : timeframe === '1W' ? 4.8 : 18.5;
  const fiiVal = (latest?.fiiNet ?? -1245.5) * (timeframe === '1D' ? 1 : mult);
  const diiVal = (latest?.diiNet ?? 1890.2) * (timeframe === '1D' ? 1 : mult);
  const totalNet = fiiVal + diiVal;

  // Mini historical series for visualization
  const history = [
    { label: 'T-4', fii: -840 * mult * 0.2, dii: 1100 * mult * 0.2 },
    { label: 'T-3', fii: 350 * mult * 0.2, dii: 620 * mult * 0.2 },
    { label: 'T-2', fii: -1420 * mult * 0.2, dii: 1950 * mult * 0.2 },
    { label: 'T-1', fii: -980 * mult * 0.2, dii: 1450 * mult * 0.2 },
    { label: 'Today', fii: fiiVal, dii: diiVal },
  ];

  const maxVal = Math.max(...history.flatMap((h) => [Math.abs(h.fii), Math.abs(h.dii)]), 1000);

  return (
    <div className="flex flex-col h-full justify-between space-y-3">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
            <span>FII</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
            <span>DII</span>
          </div>
        </div>

        <div className="flex items-center bg-[#111925] border border-border/70 rounded p-0.5 text-[10px]">
          {(['1D', '1W', '1M'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#111925] border border-border/60 rounded p-2 text-center">
          <span className="text-[10px] text-slate-400 font-mono block">FII NET</span>
          <span
            className={`text-sm font-semibold font-mono ${
              fiiVal >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {fiiVal >= 0 ? '+' : ''}₹{fiiVal.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
          </span>
        </div>
        <div className="bg-[#111925] border border-border/60 rounded p-2 text-center">
          <span className="text-[10px] text-slate-400 font-mono block">DII NET</span>
          <span
            className={`text-sm font-semibold font-mono ${
              diiVal >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {diiVal >= 0 ? '+' : ''}₹{diiVal.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
          </span>
        </div>
        <div className="bg-[#111925] border border-border/60 rounded p-2 text-center">
          <span className="text-[10px] text-slate-400 font-mono block">TOTAL FLOW</span>
          <span
            className={`text-sm font-semibold font-mono ${
              totalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalNet >= 0 ? '+' : ''}₹{totalNet.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
          </span>
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1 border-t border-border/50">
        {history.map((item, idx) => {
          const fiiHeight = Math.min(100, Math.round((Math.abs(item.fii) / maxVal) * 80));
          const diiHeight = Math.min(100, Math.round((Math.abs(item.dii) / maxVal) * 80));

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 h-20">
                {/* FII bar */}
                <div
                  className={`w-3 rounded-t-sm transition-all ${
                    item.fii >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ height: `${Math.max(6, fiiHeight)}%` }}
                  title={`FII: ₹${Math.round(item.fii)} Cr`}
                />
                {/* DII bar */}
                <div
                  className={`w-3 rounded-t-sm transition-all ${
                    item.dii >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ height: `${Math.max(6, diiHeight)}%` }}
                  title={`DII: ₹${Math.round(item.dii)} Cr`}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>As of {latest?.date || 'Today (Prov.)'}</span>
        <span className="text-slate-500">Unit: ₹ Crores</span>
      </div>
    </div>
  );
}
