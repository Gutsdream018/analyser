'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectorPerformance } from '@/types/market';
import { MetricValue } from '@/components/common/metric-value';
import { ArrowRight } from 'lucide-react';

interface SectorPerformanceCleanProps {
  sectors: SectorPerformance[];
}

export function SectorPerformanceClean({ sectors }: SectorPerformanceCleanProps) {
  const [filter, setFilter] = useState<'1D' | '1W' | '1M'>('1D');

  // Simulated adjustments for 1W / 1M filters
  const getDisplayChange = (baseChange: number, sectorName: string) => {
    if (filter === '1W') {
      return baseChange * 1.8 + (sectorName.includes('Auto') ? 1.2 : -0.5);
    }
    if (filter === '1M') {
      return baseChange * 3.2 + (sectorName.includes('Bank') ? 2.4 : 0.8);
    }
    return baseChange;
  };

  return (
    <div className="space-y-3">
      {/* Section Header with 1D, 1W, 1M Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#241117]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
            SECTOR PERFORMANCE
          </h2>
          <p className="text-xs text-[#6B7280]">
            Nifty sectoral indices ranked by performance &amp; weight
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe Toggles */}
          <div className="flex items-center gap-1 bg-[#0C070A] p-0.5 rounded-[4px] border border-[#241117]">
            {(['1D', '1W', '1M'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setFilter(tf)}
                className={`px-2.5 py-1 text-xs font-mono rounded-[3px] transition-colors ${
                  filter === tf
                    ? 'bg-[#FF2E51]/15 text-[#FF2E51] font-semibold border border-[#FF2E51]/30 shadow-[0_0_8px_rgba(255,46,81,0.2)]'
                    : 'text-[#6B7280] hover:text-[#9CA3AF]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <Link
            href="/markets"
            className="text-xs font-mono font-medium text-[#94A3B8] hover:text-[#FF2E51] inline-flex items-center gap-1 transition-colors pl-2"
          >
            All Sectors <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {sectors.map((sec) => {
          const change = getDisplayChange(sec.change, sec.sector);

          return (
            <div
              key={sec.sector}
              className="fin-card p-3 flex flex-col justify-between hover:border-[#FF2E51]/45 transition-colors"
            >
              <div>
                <span className="text-xs font-medium text-[#9CA3AF] block truncate" title={sec.name}>
                  {sec.name}
                </span>
                <span className="text-[10px] font-mono text-[#6B7280]">
                  {sec.weight}% wt
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <MetricValue
                  value={change}
                  type="percent"
                  className="text-sm font-bold block"
                />
              </div>

              <div className="mt-1 pt-1.5 border-t border-[#241117] text-[10px] font-mono text-[#6B7280] truncate">
                {sec.topContributor}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
