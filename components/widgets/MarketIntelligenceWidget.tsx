'use client';

import React from 'react';
import { Sparkles, Brain, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';

export function MarketIntelligenceWidget() {
  const summary =
    'Indian equities traded with positive momentum, led by strong institutional inflows into private banking and auto heavyweights, while persistent discretionary tech spend concerns kept IT names subdued.';

  const keyDrivers = [
    { title: 'Banking strength', desc: 'HDFC & ICICI Bank led advances with strong credit growth updates' },
    { title: 'Auto momentum', desc: 'Tata Motors & M&M surged on festive pre-booking demand' },
    { title: 'IT weakness', desc: 'Discretionary global tech client headwinds weighed on tier-1 IT' },
  ];

  const whatToWatch = [
    { label: 'Weekly F&O Expiry', time: 'Thursday 15:30', impact: 'High Volatility' },
    { label: 'RBI Monetary Policy Commentary', time: 'Tomorrow 10:00', impact: 'Rate Outlook' },
    { label: 'US Non-Farm Payrolls & Dollar Index', time: 'Friday 18:00', impact: 'FII Flow Signal' },
  ];

  return (
    <div className="flex flex-col h-full justify-between space-y-3">
      {/* AI Header pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            Automated Macro Synthesis
          </span>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ● Confidence 94%
        </span>
      </div>

      {/* Market Summary */}
      <div className="bg-[#111925] border border-border/70 rounded p-2.5 space-y-1">
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
          Market Summary
        </span>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          &ldquo;{summary}&rdquo;
        </p>
      </div>

      {/* Key Drivers */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-rose-400" />
          Key Drivers
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {keyDrivers.map((driver, i) => (
            <div
              key={i}
              className="bg-[#111925]/60 border border-border/50 rounded p-2 hover:border-slate-600 transition-colors"
            >
              <div className="text-[11px] font-semibold text-rose-300 mb-0.5">• {driver.title}</div>
              <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {driver.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What To Watch */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
          <Eye className="w-3 h-3 text-amber-400" />
          What To Watch
        </span>
        <div className="space-y-1">
          {whatToWatch.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs py-1 px-2 rounded bg-[#111925]/40 border border-border/40"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-amber-400 font-mono text-[10px]">[{i + 1}]</span>
                <span className="text-slate-200 font-medium truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] shrink-0">
                <span className="text-slate-400">{item.time}</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {item.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-border/50">
        <span>Zero buy/sell calls • Pure contextual synthesis</span>
        <span>Model: FinLLM v4</span>
      </div>
    </div>
  );
}
