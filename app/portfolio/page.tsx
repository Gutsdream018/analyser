'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  ShieldAlert,
  Sliders,
  Plus,
  RefreshCw,
} from 'lucide-react';

export default function PortfolioPage() {
  const [filterSector, setFilterSector] = useState('ALL');

  const summary = {
    invested: 845000,
    current: 968450,
    totalPnl: 123450,
    totalPnlPct: 14.61,
    dayPnl: 14280,
    dayPnlPct: 1.50,
    cashAvailable: 155000,
  };

  const holdings = [
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      sector: 'Banking',
      qty: 200,
      avgPrice: 1540.0,
      ltp: 1642.3,
      currentValue: 328460,
      pnl: 20460,
      pnlPct: 6.64,
      dayChange: 2.13,
      allocation: 33.9,
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      sector: 'Energy',
      qty: 100,
      avgPrice: 2850.0,
      ltp: 3121.5,
      currentValue: 312150,
      pnl: 27150,
      pnlPct: 9.53,
      dayChange: 2.94,
      allocation: 32.2,
    },
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Ltd',
      sector: 'Auto',
      qty: 350,
      avgPrice: 610.0,
      ltp: 721.8,
      currentValue: 252630,
      pnl: 39130,
      pnlPct: 18.33,
      dayChange: 3.02,
      allocation: 26.1,
    },
    {
      symbol: 'SBIN',
      name: 'State Bank of India',
      sector: 'Banking',
      qty: 250,
      avgPrice: 720.0,
      ltp: 842.1,
      currentValue: 210525,
      pnl: 30525,
      pnlPct: 16.96,
      dayChange: 2.23,
      allocation: 21.7,
    },
  ];

  const sectors = ['ALL', 'Banking', 'Energy', 'Auto'];

  const filteredHoldings = filterSector === 'ALL'
    ? holdings
    : holdings.filter((h) => h.sector === filterSector);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Portfolio & Holdings</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Paper Trading Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time equity valuation, risk exposure, and sector-weighted returns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/screener"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Discover Stocks</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#0D131D] border border-border/80 rounded-lg p-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Current Portfolio Value
          </span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            ₹{summary.current.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
            Invested: ₹{summary.invested.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#0D131D] border border-border/80 rounded-lg p-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Total Profit & Loss
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">
              +₹{summary.totalPnl.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-400">
              (+{summary.totalPnlPct}%)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
            Unrealized gains
          </span>
        </div>

        <div className="bg-[#0D131D] border border-border/80 rounded-lg p-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Today&apos;s Movement
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">
              +₹{summary.dayPnl.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-400">
              (+{summary.dayPnlPct}%)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
            Day session P&L
          </span>
        </div>

        <div className="bg-[#0D131D] border border-border/80 rounded-lg p-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Available Cash / Margin
          </span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            ₹{summary.cashAvailable.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
            Total Capital: ₹{(summary.current + summary.cashAvailable).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Sector Filter & Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#0D131D] border border-border/80 p-2.5 rounded-lg">
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-400 pr-2">Sector Filter:</span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setFilterSector(sec)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterSector === sec
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {filteredHoldings.length} of {holdings.length} holdings
        </span>
      </div>

      {/* Holdings Table */}
      <div className="rounded-lg border border-border/80 bg-[#0D131D] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border/80 bg-[#111925] text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3 text-left">Holding / Company</th>
                <th className="py-2.5 px-2 text-left">Sector</th>
                <th className="py-2.5 px-2 text-right">Quantity</th>
                <th className="py-2.5 px-2 text-right">Avg Price</th>
                <th className="py-2.5 px-2 text-right">LTP (₹)</th>
                <th className="py-2.5 px-3 text-right">Current Value</th>
                <th className="py-2.5 px-3 text-right">Total P&L</th>
                <th className="py-2.5 px-2 text-right">Day %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredHoldings.map((h) => {
                const isPos = h.pnl >= 0;
                const isDayPos = h.dayChange >= 0;

                return (
                  <tr
                    key={h.symbol}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-3 text-left">
                      <Link
                        href={`/stocks/${h.symbol}`}
                        className="font-bold text-white group-hover:text-rose-400 transition-colors"
                      >
                        {h.symbol}
                      </Link>
                      <span className="text-[10px] text-slate-500 font-sans block truncate max-w-[140px]">
                        {h.name}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-left text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-border/60 text-[10px]">
                        {h.sector}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-right text-slate-200">
                      {h.qty}
                    </td>

                    <td className="py-3 px-2 text-right text-slate-400">
                      ₹{h.avgPrice.toFixed(2)}
                    </td>

                    <td className="py-3 px-2 text-right font-medium text-white">
                      ₹{h.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-3 text-right font-semibold text-white">
                      ₹{h.currentValue.toLocaleString('en-IN')}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-semibold ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPos ? '+' : ''}₹{h.pnl.toLocaleString('en-IN')}
                      <span className="block text-[10px] font-normal">
                        ({isPos ? '+' : ''}{h.pnlPct}%)
                      </span>
                    </td>

                    <td className="py-3 px-2 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          isDayPos
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isDayPos ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{Math.abs(h.dayChange).toFixed(2)}%</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
