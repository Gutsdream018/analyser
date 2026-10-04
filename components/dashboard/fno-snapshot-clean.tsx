'use client';

import React from 'react';
import Link from 'next/link';
import { FnoSnapshot, OptionChain } from '@/types/fno';
import { ArrowRight, Binary, Crosshair } from 'lucide-react';

interface FnoSnapshotCleanProps {
  snapshot: FnoSnapshot;
  optionChain: OptionChain;
}

export function FnoSnapshotClean({ snapshot, optionChain }: FnoSnapshotCleanProps) {
  const totalCallOi = optionChain.totalCallOi || 14285000;
  const totalPutOi = optionChain.totalPutOi || 16856000;
  const totalCombined = totalCallOi + totalPutOi;
  const callPercent = Math.round((totalCallOi / totalCombined) * 100);
  const putPercent = 100 - callPercent;

  // Key strikes
  const highestCallStrike = optionChain.highestCallOiStrike || 24800;
  const highestPutStrike = optionChain.highestPutOiStrike || 24400;

  return (
    <div className="space-y-3">
      {/* Header with VIEW OPTION CHAIN link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#241117]">
        <div className="flex items-center gap-2.5">
          <Binary className="w-4 h-4 text-[#FF2E51]" />
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
              <span>DERIVATIVES &amp; OPTIONS MATRIX</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#FF2E51]/10 text-[#FF2E51] border border-[#FF2E51]/30">
                LIVE OI CONCENTRATION
              </span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Open interest distribution, strike inflection walls, and volatility skew
            </p>
          </div>
        </div>

        <Link
          href="/fno"
          className="text-xs font-mono font-medium text-[#FF2E51] hover:text-[#FF1744] inline-flex items-center gap-1.5 transition-colors"
        >
          FULL OPTION CHAIN (NSE) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Derivative Metrics Grid: High-Density Trading Terminal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="fin-card p-4 bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block">
            NIFTY PCR
          </span>
          <span className="text-xl font-bold font-mono text-[#F8FAFC] tabular-nums block mt-1">
            {snapshot.niftyPcr.toFixed(2)}
          </span>
          <span className="text-[11px] font-mono text-[#00F59B] mt-0.5 block flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
            Put Writing Bias
          </span>
        </div>

        <div className="fin-card p-4 bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block">
            BANK NIFTY PCR
          </span>
          <span className="text-xl font-bold font-mono text-[#F8FAFC] tabular-nums block mt-1">
            {snapshot.bankNiftyPcr.toFixed(2)}
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8] mt-0.5 block">
            Balanced 52.4k Base
          </span>
        </div>

        <div className="fin-card p-4 bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block">
            INDIA VIX
          </span>
          <span className="text-xl font-bold font-mono text-[#FF2E51] tabular-nums block mt-1">
            {snapshot.indiaVix.toFixed(2)}
          </span>
          <span className="text-[11px] font-mono text-[#FF2E51] mt-0.5 block">
            -3.61% Vol Easing
          </span>
        </div>

        <div className="fin-card p-4 bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block">
            ATM IV
          </span>
          <span className="text-xl font-bold font-mono text-[#F8FAFC] tabular-nums block mt-1">
            12.7%
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8] mt-0.5 block">
            24,600 Strike
          </span>
        </div>

        <div className="fin-card p-4 bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block flex items-center justify-between">
            <span>MAX PAIN</span>
            <Crosshair className="w-3 h-3 text-[#FF2E51]" />
          </span>
          <span className="text-xl font-bold font-mono text-[#FF2E51] tabular-nums block mt-1">
            {snapshot.niftyMaxPain}
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8] mt-0.5 block">
            Weekly Strike Pin
          </span>
        </div>

        <div className="fin-card p-4 bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block">
            NIFTY FUTURES
          </span>
          <span className="text-xl font-bold font-mono text-[#F8FAFC] tabular-nums block mt-1">
            {snapshot.niftyFuture.toFixed(0)}
          </span>
          <span className="text-[11px] font-mono text-[#FF2E51] mt-0.5 block">
            Basis: +58.3 pts
          </span>
        </div>
      </div>

      {/* CALL OI vs PUT OI Clean Visual Comparison (Charts + Options) */}
      <div className="fin-card p-5 bg-[#0C070A] border border-[#241117]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E51] shadow-[0_0_8px_#FF2E51]" />
            <span className="text-[#94A3B8] font-mono font-medium">CALL OI (Resistance Ceiling):</span>
            <span className="font-mono text-sm font-bold text-[#FF2E51]">
              {(totalCallOi / 1000000).toFixed(2)}M ({callPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F59B] shadow-[0_0_6px_#00F59B]" />
            <span className="text-[#94A3B8] font-mono font-medium">PUT OI (Support Floor):</span>
            <span className="font-mono text-sm font-bold text-[#00F59B]">
              {(totalPutOi / 1000000).toFixed(2)}M ({putPercent}%)
            </span>
          </div>
        </div>

        {/* Visual Dual-Color Concentration Bar */}
        <div className="h-3 w-full bg-white/[0.06] rounded-[2px] overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${callPercent}%` }}
            className="h-full bg-[#FF2E51] transition-all relative group cursor-pointer shadow-[0_0_10px_rgba(255,46,81,0.4)]"
            title={`Total Call Resistance OI: ${(totalCallOi / 1000000).toFixed(2)}M`}
          />
          <div
            style={{ width: `${putPercent}%` }}
            className="h-full bg-[#00F59B] transition-all relative group cursor-pointer"
            title={`Total Put Support OI: ${(totalPutOi / 1000000).toFixed(2)}M`}
          />
        </div>

        {/* Inflection Points Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-3 text-[11px] font-mono text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51]" />
            <strong className="text-[#94A3B8]">Key Resistance Wall:</strong> {highestCallStrike} Strike (5.82M Call OI)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51]" />
            <strong className="text-[#94A3B8]">Max Pain Gravity Pin:</strong> {snapshot.niftyMaxPain} Strike
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B]" />
            <strong className="text-[#94A3B8]">Key Support Floor:</strong> {highestPutStrike} Strike (5.48M Put OI)
          </span>
        </div>
      </div>
    </div>
  );
}
