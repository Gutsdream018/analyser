import React from 'react';
import { MarketBreadth } from '@/types/market';
import { TerminalCard } from '@/components/common/terminal-card';

interface MarketBreadthProps {
  breadth: MarketBreadth;
}

export function MarketBreadthWidget({ breadth }: MarketBreadthProps) {
  const advancePercent = Math.round((breadth.advances / breadth.totalTraded) * 100);
  const declinePercent = Math.round((breadth.declines / breadth.totalTraded) * 100);

  return (
    <TerminalCard title="Market Breadth" subtitle="NSE Cash">
      <div className="space-y-3">
        {/* Ratio Numbers */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="text-left">
            <span className="text-[10px] text-[#868C97] block uppercase">Advances</span>
            <span className="text-sm font-bold text-[#00F59B] tabular-nums">
              {breadth.advances.toLocaleString()}
            </span>
          </div>
          <div className="text-center px-2 py-1 rounded bg-[#080C14] border border-[#162030]">
            <span className="text-[10px] text-[#868C97] block uppercase">A/D Ratio</span>
            <span className="text-xs font-bold text-[#00F59B] tabular-nums">
              {breadth.advanceDeclineRatio.toFixed(2)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#868C97] block uppercase">Declines</span>
            <span className="text-sm font-bold text-[#F43F5E] tabular-nums">
              {breadth.declines.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Visual Ratio Bar */}
        <div className="h-2 w-full bg-[#080C14] rounded-[2px] overflow-hidden flex border border-[#162030]">
          <div
            style={{ width: `${advancePercent}%` }}
            className="h-full bg-[#00F59B] transition-all duration-300 shadow-[0_0_8px_rgba(0,245,155,0.4)]"
            title={`Advances: ${breadth.advances} (${advancePercent}%)`}
          />
          <div
            style={{ width: `${100 - advancePercent - declinePercent}%` }}
            className="h-full bg-[#868C97]/30"
            title={`Unchanged: ${breadth.unchanged}`}
          />
          <div
            style={{ width: `${declinePercent}%` }}
            className="h-full bg-[#F43F5E] transition-all duration-300 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
            title={`Declines: ${breadth.declines} (${declinePercent}%)`}
          />
        </div>

        {/* NIFTY 50 Internal Breadth */}
        <div className="pt-2 border-t border-[#162030] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#868C97]">NIFTY 50 Internals:</span>
          <div className="flex items-center gap-2">
            <span className="text-[#00F59B] font-semibold">{breadth.nifty50Advances} Up</span>
            <span className="text-[#868C97]">/</span>
            <span className="text-[#F43F5E] font-semibold">{breadth.nifty50Declines} Down</span>
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}
