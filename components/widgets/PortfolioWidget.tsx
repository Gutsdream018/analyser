'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Wallet, PieChart } from 'lucide-react';

export function PortfolioWidget() {
  const summary = {
    invested: 845000,
    current: 968450,
    totalPnl: 123450,
    totalPnlPct: 14.61,
    dayPnl: 14280,
    dayPnlPct: 1.50,
  };

  const holdings = [
    { symbol: 'HDFCBANK', qty: 200, avg: 1540.0, ltp: 1642.3, pnl: 20460, pnlPct: 6.64 },
    { symbol: 'RELIANCE', qty: 100, avg: 2850.0, ltp: 3121.5, pnl: 27150, pnlPct: 9.53 },
    { symbol: 'TATAMOTORS', qty: 350, avg: 610.0, ltp: 721.8, pnl: 39130, pnlPct: 18.33 },
    { symbol: 'SBIN', qty: 250, avg: 720.0, ltp: 842.1, pnl: 30525, pnlPct: 16.96 },
  ];

  return (
    <div className="flex flex-col h-full justify-between space-y-3">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="bg-[#111925] border border-border/60 rounded p-2">
          <span className="text-[10px] text-slate-400 font-mono block">PORTFOLIO VALUE</span>
          <span className="text-sm font-bold font-mono text-white">
            ₹{summary.current.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">
            Inv: ₹{summary.invested.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#111925] border border-border/60 rounded p-2">
          <span className="text-[10px] text-slate-400 font-mono block">TOTAL RETURN</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold font-mono text-emerald-400">
              +₹{summary.totalPnl.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block font-semibold">
            +{summary.totalPnlPct}%
          </span>
        </div>

        <div className="bg-[#111925] border border-border/60 rounded p-2 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 font-mono block">TODAY'S P&L</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold font-mono text-emerald-400">
              +₹{summary.dayPnl.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block">
            +{summary.dayPnlPct}%
          </span>
        </div>
      </div>

      {/* Mini Holdings list */}
      <div className="space-y-1 overflow-y-auto max-h-[160px] pr-1">
        {holdings.map((h) => (
          <div
            key={h.symbol}
            className="flex items-center justify-between p-1.5 rounded bg-[#111925]/50 border border-border/40 hover:bg-[#152030] transition-colors"
          >
            <div>
              <Link
                href={`/stocks/${h.symbol}`}
                className="text-xs font-mono font-bold text-slate-200 hover:text-rose-400"
              >
                {h.symbol}
              </Link>
              <div className="text-[10px] text-slate-400 font-mono">
                {h.qty} Qty • Avg ₹{h.avg}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-semibold text-white">
                ₹{h.ltp.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                +₹{h.pnl.toLocaleString('en-IN')} (+{h.pnlPct}%)
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-border/50">
        <Link href="/portfolio" className="text-rose-400 hover:text-rose-300 font-medium">
          Full Analytics & Rebalancing →
        </Link>
        <span>Paper Trading Mode</span>
      </div>
    </div>
  );
}
