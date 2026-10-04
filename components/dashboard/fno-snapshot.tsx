import React from 'react';
import { FnoSnapshot } from '@/types/fno';
import { TerminalCard } from '@/components/common/terminal-card';
import { MetricValue } from '@/components/common/metric-value';
import Link from 'next/link';

interface FnoSnapshotProps {
  snapshot: FnoSnapshot;
}

export function FnoSnapshotCard({ snapshot }: FnoSnapshotProps) {
  return (
    <TerminalCard
      title="F&O Pulse Snapshot"
      subtitle="Weekly Derivatives Structure"
      action={
        <Link href="/fno" className="text-[11px] font-mono text-[#868C97] hover:text-[#00F59B] transition-colors">
          Full Option Chain →
        </Link>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* NIFTY PCR */}
        <div className="bg-[#080C14] p-2.5 rounded-[4px] border border-[#162030]">
          <span className="text-[10px] font-mono text-[#868C97] uppercase block">NIFTY PCR (OI)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-base font-bold text-[#E7E9EC]">{snapshot.niftyPcr}</span>
            <span className="text-[10px] font-mono text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/25 px-1 rounded">
              BULLISH BIAS
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#868C97] mt-1 block">
            Basis: +{snapshot.niftyBasis.toFixed(1)} pts
          </span>
        </div>

        {/* NIFTY Max Pain */}
        <div className="bg-[#080C14] p-2.5 rounded-[4px] border border-[#162030]">
          <span className="text-[10px] font-mono text-[#868C97] uppercase block">NIFTY Max Pain</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-base font-bold text-[#00F59B]">{snapshot.niftyMaxPain}</span>
            <span className="text-[10px] font-mono text-[#868C97]">Weekly</span>
          </div>
          <span className="text-[10px] font-mono text-[#868C97] mt-1 block">
            Spot: {snapshot.niftySpot.toFixed(0)}
          </span>
        </div>

        {/* BANK NIFTY PCR */}
        <div className="bg-[#080C14] p-2.5 rounded-[4px] border border-[#162030]">
          <span className="text-[10px] font-mono text-[#868C97] uppercase block">BANK NIFTY PCR</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-base font-bold text-[#E7E9EC]">{snapshot.bankNiftyPcr}</span>
            <span className="text-[10px] font-mono text-[#868C97] bg-[#162030] px-1 rounded">NEUTRAL</span>
          </div>
          <span className="text-[10px] font-mono text-[#868C97] mt-1 block">
            Pain: {snapshot.bankNiftyMaxPain}
          </span>
        </div>

        {/* INDIA VIX */}
        <div className="bg-[#080C14] p-2.5 rounded-[4px] border border-[#162030]">
          <span className="text-[10px] font-mono text-[#868C97] uppercase block">INDIA VIX</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-base font-bold text-[#00F59B]">{snapshot.indiaVix}</span>
            <MetricValue
              value={snapshot.indiaVixChange}
              type="percent"
              className="text-[11px]"
              direction="pos" // falling vix is positive for market stability
            />
          </div>
          <span className="text-[10px] font-mono text-[#868C97] mt-1 block">Low Volatility Regime</span>
        </div>
      </div>
    </TerminalCard>
  );
}
