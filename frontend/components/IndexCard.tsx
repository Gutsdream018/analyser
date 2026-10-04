import React from 'react';
import { IndexQuote } from '../lib/types';

interface IndexCardProps {
  quote: IndexQuote;
}

export function IndexCard({ quote }: IndexCardProps) {
  const isPositive = quote.change >= 0;
  const isVix = quote.symbol.toUpperCase().includes('VIX');
  
  // For VIX, lower is typically green (calm volatility), but standard financial color is directional
  const colorClass = isPositive ? 'text-[#10B981]' : 'text-[#F43F5E]';
  const badgeBg = isPositive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F43F5E]/10 text-[#F43F5E]';
  const sign = isPositive ? '+' : '';

  return (
    <div className="bg-[#11141A] border border-white/[0.08] hover:border-white/[0.15] transition-all rounded-lg p-4 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="text-[11px] font-mono text-[#6B7280] uppercase tracking-wider block">
            {quote.symbol}
          </span>
          <h3 className="text-sm font-semibold text-[#F3F4F6] truncate mt-0.5">
            {quote.name}
          </h3>
        </div>
        {quote.delayed && (
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.05] text-[#9CA3AF] border border-white/[0.05]">
            Delayed
          </span>
        )}
      </div>

      <div className="mt-2">
        <div className="text-2xl font-bold font-mono text-[#F3F4F6] tabular-nums tracking-tight">
          {quote.value.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <div className="flex items-center gap-2 mt-1.5 text-xs font-mono">
          <span className={`${colorClass} font-semibold tabular-nums`}>
            {sign}{quote.change.toFixed(2)}
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold tabular-nums ${badgeBg}`}>
            {sign}{quote.change_percent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
        <span>Source: {quote.source}</span>
        <span>
          {new Date(quote.as_of).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
