import React from 'react';
import { SectorPerformance } from '@/types/market';
import { TerminalCard } from '@/components/common/terminal-card';
import Link from 'next/link';

interface SectorHeatmapProps {
  sectors: SectorPerformance[];
}

export function SectorHeatmap({ sectors }: SectorHeatmapProps) {
  // Compute color background based on magnitude
  const getCellBackground = (change: number) => {
    if (change > 0) {
      if (change >= 2.0) return 'bg-[#2FD675]/35 border-[#2FD675]/60 text-white';
      if (change >= 1.0) return 'bg-[#2FD675]/20 border-[#2FD675]/40 text-[#2FD675]';
      if (change >= 0.5) return 'bg-[#2FD675]/12 border-[#2FD675]/25 text-[#2FD675]';
      return 'bg-[#2FD675]/6 border-[#2FD675]/15 text-[#2FD675]';
    } else if (change < 0) {
      const abs = Math.abs(change);
      if (abs >= 2.0) return 'bg-[#FF2E51]/35 border-[#FF2E51]/60 text-white';
      if (abs >= 1.0) return 'bg-[#FF2E51]/20 border-[#FF2E51]/40 text-[#FF2E51]';
      if (abs >= 0.5) return 'bg-[#FF2E51]/12 border-[#FF2E51]/25 text-[#FF2E51]';
      return 'bg-[#FF2E51]/6 border-[#FF2E51]/15 text-[#FF2E51]';
    }
    return 'bg-[#0C070A] border-[#241117] text-[#868C97]';
  };

  return (
    <TerminalCard
      title="Sector Heatmap"
      subtitle="Magnitude Shaded"
      action={
        <Link href="/markets" className="text-[11px] font-mono text-[#868C97] hover:text-[#FF2E51] transition-colors">
          View All Sectors →
        </Link>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {sectors.map((sec) => {
          const bgStyle = getCellBackground(sec.change);
          return (
            <div
              key={sec.sector}
              className={`p-2 rounded-[3px] border flex flex-col justify-between transition-colors ${bgStyle}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] font-semibold tracking-tight uppercase truncate">
                  {sec.name}
                </span>
                <span className="text-[9px] font-mono opacity-70">
                  {sec.weight}%
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <span className="font-mono text-sm font-bold tabular-nums">
                  {sec.change > 0 ? '+' : ''}{sec.change.toFixed(2)}%
                </span>
                <span className="text-[10px] font-mono opacity-80 truncate max-w-[80px]">
                  {sec.topContributor}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </TerminalCard>
  );
}
