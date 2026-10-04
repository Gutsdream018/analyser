import React from 'react';
import { AiDailyBrief } from '@/types/analysis';
import { TerminalCard } from '@/components/common/terminal-card';
import { BrainCircuit, Eye, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AiBriefCardProps {
  brief: AiDailyBrief;
}

export function AiBriefCard({ brief }: AiBriefCardProps) {
  return (
    <TerminalCard
      title={
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-[#FF2E51]" />
          <span className="text-xs font-semibold text-[#E7E9EC] tracking-wide uppercase font-sans">
            Market Intelligence — AI Macro Brief
          </span>
        </div>
      }
      subtitle={brief.timestamp}
      action={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-[#FF2E51]/10 border border-[#FF2E51]/30 text-[10px] font-mono text-[#FF2E51]">
            <Sparkles className="w-3 h-3" />
            <span>CONFIDENCE {brief.confidenceScore}%</span>
          </div>
          <Link
            href="/analysis"
            className="text-[11px] font-mono text-[#868C97] hover:text-[#FF2E51] flex items-center gap-0.5 transition-colors"
          >
            Full Analysis <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      }
      bodyClassName="p-4"
      className="border-[#241117] bg-[#0C070A]"
    >
      {/* Executive Summary */}
      <p className="text-xs text-[#E7E9EC] leading-relaxed font-sans pb-3 border-b border-[#241117]">
        {brief.executiveSummary}
      </p>

      {/* 4 Pillars: Signal -> Context -> AI Synthesis -> What to Watch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
        {/* 1. Signal */}
        <div className="bg-[#030407] p-3 rounded-[4px] border border-[#241117]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#FF2E51] tracking-wider mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] shadow-[0_0_8px_#FF2E51]" />
            1. Core Market Signal
          </div>
          <h4 className="text-xs font-semibold text-[#E7E9EC] mb-1 font-sans">
            {brief.signal.title.replace('Headline Signal: ', '')}
          </h4>
          <ul className="space-y-1">
            {brief.signal.keyPoints.slice(0, 2).map((pt, idx) => (
              <li key={idx} className="text-[11px] text-[#868C97] leading-normal flex items-start gap-1.5">
                <span className="text-[#FF2E51] mt-0.5">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Context */}
        <div className="bg-[#030407] p-3 rounded-[4px] border border-[#241117]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#FF2E51] tracking-wider mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] shadow-[0_0_8px_#FF2E51]" />
            2. Institutional Context
          </div>
          <p className="text-[11px] text-[#868C97] leading-relaxed mb-2 font-sans">
            {brief.context.fiiDiiFlowText}
          </p>
          <div className="text-[10px] font-mono text-[#E7E9EC] bg-[#090608] p-1.5 rounded-[2px] border border-[#241117]">
            {brief.context.crudeAndCurrencyText}
          </div>
        </div>

        {/* 3. What to Watch */}
        <div className="bg-[#030407] p-3 rounded-[4px] border border-[#241117]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#E7E9EC] tracking-wider mb-1.5">
            <Eye className="w-3 h-3 text-[#FF2E51]" />
            3. Derivative &amp; Macro Triggers
          </div>
          <ul className="space-y-1.5">
            {brief.whatToWatch.slice(0, 3).map((item, idx) => (
              <li key={idx} className="text-[11px] text-[#868C97] leading-tight flex items-start gap-1.5">
                <span className="font-mono text-[10px] text-[#FF2E51] shrink-0 font-bold">{idx + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strict Mandate Note */}
      <div className="mt-3 pt-2 border-t border-[#241117] flex items-center justify-between text-[10px] font-mono text-[#868C97]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#868C97]" />
          Factual synthesis & observations only • No buy/sell recommendations
        </span>
        <span className="text-[#868C97]">Next Refresh: 09:15 IST</span>
      </div>
    </TerminalCard>
  );
}
