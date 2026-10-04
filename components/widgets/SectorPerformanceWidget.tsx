'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useMarketStore } from '@/store/marketStore';

export function SectorPerformanceWidget() {
  const { sectors } = useMarketStore();

  const sectorList = [
    { name: 'Banking', change: 1.82, points: [10, 12, 14, 13, 16, 18, 17, 20] },
    { name: 'Auto', change: 1.46, points: [11, 10, 13, 15, 14, 17, 19, 18] },
    { name: 'FMCG', change: 0.44, points: [12, 11, 12, 13, 12, 14, 13, 14] },
    { name: 'Metal', change: 0.36, points: [14, 15, 13, 12, 15, 14, 16, 16] },
    { name: 'Pharma', change: 0.21, points: [15, 14, 16, 15, 17, 16, 15, 16] },
    { name: 'Realty', change: 0.15, points: [12, 13, 11, 14, 13, 15, 14, 14] },
    { name: 'Energy', change: -0.25, points: [18, 17, 16, 17, 15, 16, 14, 13] },
    { name: 'IT', change: -0.78, points: [20, 19, 18, 16, 17, 15, 14, 12] },
  ];

  return (
    <div className="flex flex-col h-full justify-between space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {sectorList.map((sec) => {
          const isUp = sec.change >= 0;
          const min = Math.min(...sec.points);
          const max = Math.max(...sec.points);
          const range = max - min || 1;

          // Render miniature SVG sparkline
          const width = 60;
          const height = 18;
          const pathD = sec.points
            .map((p, i) => {
              const x = (i / (sec.points.length - 1)) * width;
              const y = height - ((p - min) / range) * (height - 4) - 2;
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');

          return (
            <Link
              key={sec.name}
              href={`/markets?sector=${encodeURIComponent(sec.name)}`}
              className="bg-[#111925] border border-border/70 hover:border-slate-600 rounded p-2 transition-all hover:bg-[#152030] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200">{sec.name}</span>
                {isUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                )}
              </div>

              <div className="flex items-end justify-between mt-2">
                <span
                  className={`text-xs font-mono font-bold ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? `+${sec.change.toFixed(2)}%` : `${sec.change.toFixed(2)}%`}
                </span>

                <svg width={width} height={height} className="overflow-visible opacity-90">
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isUp ? '#10B981' : '#F43F5E'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-border/50">
        <span>8 Key Indian Sectors</span>
        <Link href="/markets" className="text-rose-400 hover:text-rose-300">
          View all 16 sectors →
        </Link>
      </div>
    </div>
  );
}
