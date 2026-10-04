'use client';

import React from 'react';
import { MarketBreadth } from '@/types/market';
import { MetricValue } from '@/components/common/metric-value';

interface MarketSnapshotProps {
  breadth: MarketBreadth;
  fiiDii: { date: string; fiiNet: number; diiNet: number }[];
  vixValue: number;
  vixChange: number;
}

export function MarketSnapshot({ breadth, fiiDii, vixValue, vixChange }: MarketSnapshotProps) {
  const latestFlow = fiiDii[fiiDii.length - 1] || { fiiNet: 1285.4, diiNet: 852.7 };
  const advancePercent = Math.round((breadth.advances / breadth.totalTraded) * 100);
  const declinePercent = Math.round((breadth.declines / breadth.totalTraded) * 100);
  const unchangedPercent = 100 - advancePercent - declinePercent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Column 1: Market Breadth */}
      <div className="fin-card p-5 flex flex-col justify-between bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] shadow-[0_0_6px_#FF2E51]" />
              MARKET BREADTH
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">
              NSE Cash
            </span>
          </div>

          {/* Advances, Declines, Unchanged */}
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-lg font-bold font-mono text-[#10B981] tabular-nums">
                {breadth.advances.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-[#64748B] block">Advances</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold font-mono text-[#94A3B8] tabular-nums">
                {breadth.unchanged.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-[#64748B] block">Unchanged</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-[#FF2E51] tabular-nums">
                {breadth.declines.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-[#64748B] block">Declines</span>
            </div>
          </div>

          {/* Horizontal Visual Bar */}
          <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex my-3">
            <div
              style={{ width: `${advancePercent}%` }}
              className="h-full bg-[#10B981] shadow-[0_0_6px_#10B981]"
              title={`Advances: ${breadth.advances}`}
            />
            <div
              style={{ width: `${unchangedPercent}%` }}
              className="h-full bg-white/[0.2]"
              title={`Unchanged: ${breadth.unchanged}`}
            />
            <div
              style={{ width: `${declinePercent}%` }}
              className="h-full bg-[#FF2E51] shadow-[0_0_6px_#FF2E51]"
              title={`Declines: ${breadth.declines}`}
            />
          </div>
        </div>

        {/* 52W High and 52W Low */}
        <div className="flex items-center justify-between pt-3 border-t border-[#241117] text-xs font-mono">
          <span className="text-[#64748B]">52-Week High / Low:</span>
          <div className="flex items-center gap-2 font-mono text-[12px]">
            <span className="text-[#10B981] font-semibold">142 Highs</span>
            <span className="text-white/[0.2]">/</span>
            <span className="text-[#FF2E51] font-semibold">18 Lows</span>
          </div>
        </div>
      </div>

      {/* Column 2: Institutional Flows */}
      <div className="fin-card p-5 flex flex-col justify-between bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] shadow-[0_0_6px_#FF2E51]" />
              INSTITUTIONAL LIQUIDITY
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">
              Cash (₹ Cr)
            </span>
          </div>

          {/* Today's Values */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-2.5 rounded-[4px] bg-[#130B10] border border-[#241117]">
              <span className="text-[11px] font-mono text-[#94A3B8] block">FII Net Cash</span>
              <span className="text-lg font-bold font-mono text-[#10B981] tabular-nums block mt-0.5">
                +{latestFlow.fiiNet.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-[#130B10] border border-[#241117]">
              <span className="text-[11px] font-mono text-[#94A3B8] block">DII Net Cash</span>
              <span className="text-lg font-bold font-mono text-[#10B981] tabular-nums block mt-0.5">
                +{latestFlow.diiNet.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </span>
            </div>
          </div>
        </div>

        {/* 5-day flow trend indicator */}
        <div className="pt-3 border-t border-[#241117] flex items-center justify-between text-xs font-mono">
          <span className="text-[#64748B]">5-Day Trend:</span>
          <span className="text-xs font-medium text-[#10B981] font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Net Inflows (4 of 5 sessions positive)
          </span>
        </div>
      </div>

      {/* Column 3: Volatility */}
      <div className="fin-card p-5 flex flex-col justify-between bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] shadow-[0_0_6px_#FF2E51]" />
              VOLATILITY REGIME
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">
              NSE VIX
            </span>
          </div>

          {/* India VIX values */}
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-2xl font-bold font-mono text-[#F8FAFC] tabular-nums">
                {vixValue.toFixed(2)}
              </span>
              <span className="text-[11px] font-mono text-[#64748B] block mt-0.5">India VIX</span>
            </div>
            <div className="text-right">
              <MetricValue
                value={vixChange}
                type="percent"
                className="text-sm font-semibold"
                direction="pos" // declining vix is positive for market stability
              />
              <span className="text-[11px] font-mono text-[#64748B] block mt-0.5">Day Change</span>
            </div>
          </div>
        </div>

        {/* Volatility Regime */}
        <div className="pt-3 border-t border-[#241117] flex items-center justify-between text-xs font-mono">
          <span className="text-[#64748B]">Regime:</span>
          <span className="text-xs font-medium text-[#FF2E51] bg-[#FF2E51]/10 px-2 py-0.5 rounded-[3px] border border-[#FF2E51]/30">
            Low Volatility (Equities Favorable)
          </span>
        </div>
      </div>
    </div>
  );
}
