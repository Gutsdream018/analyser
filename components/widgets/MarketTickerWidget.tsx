'use client';

import React from 'react';
import { useMarketStore } from '@/store/marketStore';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricValue } from '@/components/common/metric-value';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function MarketTickerWidget() {
  const { indices } = useMarketStore();

  const fallbackIndices = [
    {
      symbol: 'NIFTY 50',
      current: 23140.50,
      change: 77.40,
      percentChange: 0.34,
      high: 23163,
      low: 23021,
      sparkline: [23050, 23080, 23040, 23110, 23140.5],
    },
    {
      symbol: 'BANK NIFTY',
      current: 55580.40,
      change: 142.60,
      percentChange: 0.26,
      high: 55690,
      low: 55380,
      sparkline: [55400, 55480, 55420, 55520, 55580.4],
    },
    {
      symbol: 'INDIA VIX',
      current: 12.16,
      change: -0.53,
      percentChange: -4.18,
      high: 12.85,
      low: 12.02,
      sparkline: [12.6, 12.5, 12.4, 12.2, 12.16],
    },
    {
      symbol: 'NIFTY IT',
      current: 41820.10,
      change: -180.40,
      percentChange: -0.43,
      high: 42100,
      low: 41750,
      sparkline: [42050, 42000, 41900, 41850, 41820.1],
    },
  ];

  const displayIndices = indices && indices.length > 0 ? indices.slice(0, 4) : fallbackIndices;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {displayIndices.map((idx) => {
        const isPos = idx.change >= 0;
        const colorClass = isPos ? 'text-[#10B981]' : 'text-[#F43F5E]';
        const sign = isPos ? '+' : '';

        return (
          <div
            key={idx.symbol}
            className="p-3.5 rounded-lg bg-[#111925] border border-[#202A38] hover:border-white/[0.15] transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-semibold tracking-wider text-[#94A3B8] uppercase block">
                  {idx.symbol}
                </span>
                <span className="text-xl font-bold font-mono text-[#F9FAFB] tabular-nums tracking-tight block mt-0.5">
                  {idx.current.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="w-16 h-8 shrink-0">
                <Sparkline
                  data={idx.sparkline && idx.sparkline.length > 0 ? idx.sparkline : [idx.current * 0.99, idx.current]}
                  positive={isPos}
                />
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#202A38]/50 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 font-semibold">
                <span className={colorClass}>
                  {sign}{idx.change.toFixed(2)}
                </span>
                <span className={`text-[11px] px-1 py-0.2 rounded ${isPos ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F43F5E]/10 text-[#F43F5E]'}`}>
                  {sign}{idx.percentChange.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                <span>H {Math.round(idx.high)}</span>
                <span>L {Math.round(idx.low)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
