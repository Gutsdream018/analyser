'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';

export function GlobalMarketsWidget() {
  const globalIndices = [
    { symbol: 'DOW', name: 'Dow Jones', value: '42,124.70', change: '+138.20', pct: '+0.33%', isUp: true },
    { symbol: 'S&P 500', name: 'S&P 500 Index', value: '5,738.20', change: '+9.18', pct: '+0.16%', isUp: true },
    { symbol: 'NASDAQ', name: 'Nasdaq Composite', value: '18,137.90', change: '-23.50', pct: '-0.13%', isUp: false },
    { symbol: 'DXY', name: 'US Dollar Index', value: '100.82', change: '-0.15', pct: '-0.15%', isUp: false },
    { symbol: 'CRUDE', name: 'Brent Crude Oil ($)', value: '71.85', change: '-1.24', pct: '-1.70%', isUp: false },
    { symbol: 'GOLD', name: 'Gold Spot ($/oz)', value: '2,658.40', change: '+8.45', pct: '+0.32%', isUp: true },
  ];

  return (
    <div className="flex flex-col h-full justify-between space-y-2">
      <div className="divide-y divide-border/60">
        {globalIndices.map((item) => (
          <div
            key={item.symbol}
            className="py-1.5 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white font-mono">{item.symbol}</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{item.name}</span>
            </div>

            <div className="flex items-center gap-4 text-right">
              <span className="text-xs font-mono font-medium text-slate-200">{item.value}</span>
              <div
                className={`flex items-center gap-0.5 min-w-[70px] justify-end font-mono text-xs font-semibold ${
                  item.isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.isUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>{item.pct}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-border/50">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-slate-500" />
          <span>Global benchmarks</span>
        </span>
        <span>Delayed 15m</span>
      </div>
    </div>
  );
}
