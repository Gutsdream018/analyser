'use client';

import React from 'react';
import { MarketIndex } from '@/types/market';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricValue } from '@/components/common/metric-value';

interface IndexStripProps {
  indices: MarketIndex[];
}

export function IndexStrip({ indices }: IndexStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {indices.slice(0, 4).map((idx) => {
        const isPos = idx.change >= 0;
        return (
          <div
            key={idx.symbol}
            className="fin-card p-5 flex flex-col justify-between group bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
          >
            {/* Top row: Symbol with pulse indicator & timestamp */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isPos ? 'bg-[#00F59B] shadow-[0_0_6px_#00F59B]' : 'bg-[#FF2E51] shadow-[0_0_8px_#FF2E51]'}`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8] group-hover:text-[#FF2E51] transition-colors">
                  {idx.symbol}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                {idx.timestamp}
              </span>
            </div>

            {/* Middle row: Primary number (24-28px focus) & Sparkline */}
            <div className="flex items-baseline justify-between mt-3 mb-2">
              <span className="text-2xl sm:text-[26px] font-bold font-mono tracking-tight text-[#F8FAFC] tabular-nums">
                {idx.current.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <Sparkline data={idx.sparkline} width={76} height={24} positive={isPos} />
            </div>

            {/* Bottom row: Absolute and percentage change & Day High/Low */}
            <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05] text-xs">
              <div className="flex items-center gap-2">
                <MetricValue value={idx.change} type="points" className="text-xs font-semibold" />
                <MetricValue value={idx.percentChange} type="percent" className="text-xs font-semibold" />
              </div>
              <div className="text-[11px] font-mono text-[#64748B]">
                <span>H: {idx.high.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                <span className="mx-1.5">•</span>
                <span>L: {idx.low.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
