'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useMarketStore } from '@/store/marketStore';

type MoverTab = 'Gainers' | 'Losers' | 'Most Active';

export function TopMoversWidget() {
  const { topMovers } = useMarketStore();
  const [tab, setTab] = useState<MoverTab>('Gainers');

  const defaultGainers = [
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', ltp: 721.80, change: 21.15, pct: 3.02, volume: '1.8 Cr' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 3121.50, change: 89.20, pct: 2.94, volume: '95 L' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', ltp: 1243.20, change: 28.60, pct: 2.36, volume: '1.2 Cr' },
    { symbol: 'SBIN', name: 'State Bank of India', ltp: 842.10, change: 18.35, pct: 2.23, volume: '2.4 Cr' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', ltp: 1642.30, change: 34.25, pct: 2.13, volume: '1.9 Cr' },
  ];

  const defaultLosers = [
    { symbol: 'INFY', name: 'Infosys Ltd', ltp: 1885.40, change: -27.80, pct: -1.45, volume: '88 L' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', ltp: 4210.00, change: -36.20, pct: -0.85, volume: '42 L' },
    { symbol: 'WIPRO', name: 'Wipro Ltd', ltp: 524.30, change: -3.90, pct: -0.74, volume: '76 L' },
    { symbol: 'HCLTECH', name: 'HCL Technologies', ltp: 1782.50, change: -11.50, pct: -0.64, volume: '38 L' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', ltp: 1762.00, change: -7.50, pct: -0.42, volume: '51 L' },
  ];

  const defaultActive = [
    { symbol: 'SBIN', name: 'State Bank of India', ltp: 842.10, change: 18.35, pct: 2.23, volume: '2.4 Cr' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', ltp: 1642.30, change: 34.25, pct: 2.13, volume: '1.9 Cr' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', ltp: 721.80, change: 21.15, pct: 3.02, volume: '1.8 Cr' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', ltp: 1243.20, change: 28.60, pct: 2.36, volume: '1.2 Cr' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 3121.50, change: 89.20, pct: 2.94, volume: '95 L' },
  ];

  const liveGainers = topMovers?.gainers && topMovers.gainers.length > 0
    ? topMovers.gainers.slice(0, 5).map((s) => ({
        symbol: s.symbol,
        name: s.name,
        ltp: s.price,
        change: s.change,
        pct: s.percentChange,
        volume: s.volume ? `${(s.volume / 10000000).toFixed(1)} Cr` : '1.2 Cr',
      }))
    : defaultGainers;

  const liveLosers = topMovers?.losers && topMovers.losers.length > 0
    ? topMovers.losers.slice(0, 5).map((s) => ({
        symbol: s.symbol,
        name: s.name,
        ltp: s.price,
        change: s.change,
        pct: s.percentChange,
        volume: s.volume ? `${(s.volume / 10000000).toFixed(1)} Cr` : '88 L',
      }))
    : defaultLosers;

  const liveActive = topMovers?.volumeShockers && topMovers.volumeShockers.length > 0
    ? topMovers.volumeShockers.slice(0, 5).map((s) => ({
        symbol: s.symbol,
        name: s.name,
        ltp: s.price,
        change: s.change,
        pct: s.percentChange,
        volume: s.volume ? `${(s.volume / 10000000).toFixed(1)} Cr` : '2.4 Cr',
      }))
    : defaultActive;

  let displayItems = liveGainers;
  if (tab === 'Losers') displayItems = liveLosers;
  if (tab === 'Most Active') displayItems = liveActive;

  return (
    <div className="flex flex-col h-full justify-between space-y-2">
      {/* Tab selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#111925] border border-border/70 rounded p-0.5 text-xs">
          {(['Gainers', 'Losers', 'Most Active'] as MoverTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tab === t
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Link
          href="/screener"
          className="text-[11px] text-rose-400 hover:text-rose-300 font-medium whitespace-nowrap"
        >
          Screener →
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border/60 text-slate-400 text-[10px]">
              <th className="py-1 px-1 text-left font-normal">SYMBOL</th>
              <th className="py-1 px-1 text-right font-normal">LTP (₹)</th>
              <th className="py-1 px-1 text-right font-normal">CHANGE</th>
              <th className="py-1 px-1 text-right font-normal">% CHG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {displayItems.map((item) => {
              const isUp = item.pct >= 0;
              return (
                <tr
                  key={item.symbol}
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="py-2 px-1 text-left">
                    <Link
                      href={`/stocks/${item.symbol}`}
                      className="font-bold text-slate-200 group-hover:text-rose-400 flex items-center gap-1.5"
                    >
                      <span>{item.symbol}</span>
                    </Link>
                    <span className="text-[10px] text-slate-500 font-sans block truncate max-w-[120px]">
                      {item.name}
                    </span>
                  </td>

                  <td className="py-2 px-1 text-right font-medium text-white">
                    {item.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  <td
                    className={`py-2 px-1 text-right ${
                      isUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isUp ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)}
                  </td>

                  <td className="py-2 px-1 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        isUp
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>{Math.abs(item.pct).toFixed(2)}%</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-border/50">
        <span>NIFTY 500 Universe</span>
        <span>Vol Rank #1-{displayItems.length}</span>
      </div>
    </div>
  );
}
