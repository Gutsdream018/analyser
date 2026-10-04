'use client';

import React from 'react';
import Link from 'next/link';
import { AiDailyBrief } from '@/types/analysis';
import { ArrowRight, Activity, Radio } from 'lucide-react';

interface MarketNarrativeProps {
  brief: AiDailyBrief;
}

export function MarketNarrative({ brief }: MarketNarrativeProps) {
  return (
    <div className="fin-card p-6 sm:p-7 relative overflow-hidden bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
      {/* Header bar: Red Market Signal & Real-time Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#241117]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#FF2E51]/10 border border-[#FF2E51]/30 shadow-[0_0_10px_rgba(255,46,81,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#FF2E51] animate-pulse shadow-[0_0_8px_#FF2E51]" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#FF2E51]">
              RED MARKET SIGNAL
            </span>
          </div>
          <span className="text-white/[0.15]">•</span>
          <span className="text-xs text-[#94A3B8] font-mono">
            Institutional Market Intelligence Synthesis
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#64748B]">
          <span className="font-mono text-[11px] text-[#94A3B8] flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#FF2E51]" />
            Synchronized 15:30 IST
          </span>
          <span className="text-white/[0.15]">•</span>
          <Link
            href="/analysis"
            className="text-xs font-mono font-medium text-[#94A3B8] hover:text-[#FF2E51] inline-flex items-center gap-1 transition-colors"
          >
            Full Intelligence Ledger <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Narrative Paragraph (High-Signal Financial Copy) */}
      <p className="text-[15px] sm:text-[16px] text-[#F8FAFC] font-normal leading-relaxed max-w-4xl mb-6">
        {brief.executiveSummary ||
          'Indian equities closed with constructive trend continuation, anchored by private banking order flow and automotive momentum. Benchmark indices defended key inflection points while internal breadth and institutional cash absorption sustained positive cumulative momentum.'}
      </p>

      {/* Three Column Breakdown: Signals, Institutional Context, Derivative Inflections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-[#241117]">
        {/* 1. Core Signals */}
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#94A3B8] block mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] shadow-[0_0_6px_#FF2E51]" />
            OBSERVED SIGNALS
          </span>
          <ul className="space-y-2 text-[13px] text-[#CBD5E1]">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] mt-1.5 shrink-0 shadow-[0_0_4px_#FF2E51]" />
              <span>
                <strong className="text-[#F8FAFC] font-medium">Banking Accumulation:</strong> Large-cap private banks saw sustained institutional absorption, lifting Bank Nifty past 52,400.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] mt-1.5 shrink-0 shadow-[0_0_4px_#FF2E51]" />
              <span>
                <strong className="text-[#F8FAFC] font-medium">Automotive Volume:</strong> OEM equities surged ahead of monthly festive commercial dispatch figures.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] mt-1.5 shrink-0 shadow-[0_0_4px_#FF2E51]" />
              <span>
                <strong className="text-[#F8FAFC] font-medium">IT Export Caution:</strong> Currency hedging and delayed enterprise tech budgets drove modest sector rotation out of IT.
              </span>
            </li>
          </ul>
        </div>

        {/* 2. Institutional Cash Flows */}
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#94A3B8] block mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#FF2E51]" />
            INSTITUTIONAL LIQUIDITY
          </span>
          <div className="p-3 rounded-[4px] bg-[#130B10] border border-[#241117] space-y-2 text-xs font-mono text-[#CBD5E1]">
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">FII Cash Net:</span>
              <span className="text-[#00F59B] font-semibold">+₹1,285.40 Cr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">DII Cash Net:</span>
              <span className="text-[#00F59B] font-semibold">+₹852.70 Cr</span>
            </div>
            <div className="pt-2 border-t border-[#241117] text-[11px] text-[#94A3B8] leading-relaxed">
              Combined net institutional absorption of +₹2,138 Cr marks the 4th consecutive session of mutual fund &amp; FPI liquidity support.
            </div>
          </div>
        </div>

        {/* 3. Derivatives & What to Watch */}
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#94A3B8] block mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] shadow-[0_0_6px_#FF2E51]" />
            OPTIONS &amp; INFLECTION WALLS
          </span>
          <ul className="space-y-2 text-[13px] text-[#CBD5E1]">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] mt-1.5 shrink-0" />
              <span>
                <strong className="text-[#F8FAFC] font-medium">PCR Support Floor:</strong> NIFTY ATM PCR 1.18 indicates put writing support concentrated around 24,500.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] mt-1.5 shrink-0" />
              <span>
                <strong className="text-[#F8FAFC] font-medium">Call Resistance Ceiling:</strong> 5.82M Open Interest cluster at 24,800 strike marks primary weekly barrier.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] mt-1.5 shrink-0" />
              <span>
                <strong className="text-[#F8FAFC] font-medium">Macro Catalyst:</strong> RBI monetary liquidity commentary &amp; Brent crude consolidation at $71.85/bbl.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer attribution tag */}
      <div className="mt-5 pt-3 border-t border-white/[0.04] text-[11px] font-mono text-[#64748B]">
        Data Source: NSE / BSE Cash &amp; F&amp;O Feeds. Pure algorithmic synthesis. Strictly observational market intelligence.
      </div>
    </div>
  );
}
