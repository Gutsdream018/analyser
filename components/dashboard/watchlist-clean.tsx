'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StockDetails } from '@/types/stock';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricValue } from '@/components/common/metric-value';
import { Plus, ArrowRight, X } from 'lucide-react';

interface WatchlistCleanProps {
  stocks: StockDetails[];
}

export function WatchlistClean({ stocks }: WatchlistCleanProps) {
  // Pre-seed with the user's explicit watchlist targets: RELIANCE, HDFCBANK, TCS, INFY, TATAMOTORS
  const defaultSymbols = ['RELIANCE', 'HDFCBANK', 'TCS', 'INFY', 'TATAMOTORS'];
  const [trackedSymbols, setTrackedSymbols] = useState<string[]>(defaultSymbols);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTicker, setNewTicker] = useState('');

  const displayedStocks = stocks.filter((s) => trackedSymbols.includes(s.symbol));

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    const clean = newTicker.trim().toUpperCase();
    if (!trackedSymbols.includes(clean)) {
      setTrackedSymbols([...trackedSymbols, clean]);
    }
    setNewTicker('');
    setShowAddInput(false);
  };

  const handleRemoveTicker = (sym: string) => {
    setTrackedSymbols(trackedSymbols.filter((s) => s !== sym));
  };

  return (
    <div className="space-y-3">
      {/* Header and Add Stock Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
            PERSONAL WATCHLIST
          </h2>
          <p className="text-xs text-[#6B7280]">
            Core equity basket monitored with real-time intraday sparklines
          </p>
        </div>

        <div className="flex items-center gap-3">
          {showAddInput ? (
            <form onSubmit={handleAddTicker} className="flex items-center gap-1.5">
              <input
                type="text"
                autoFocus
                placeholder="Ticker (e.g. M&M)"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                className="px-2.5 py-1 text-xs font-mono bg-[#0C070A] border border-[#241117] rounded-[4px] text-[#F3F4F6] outline-none focus:border-[#FF2E51]"
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-xs font-medium bg-[#FF2E51] text-white shadow-[0_0_10px_rgba(255,46,81,0.3)] rounded-[4px] font-mono font-bold"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddInput(false)}
                className="text-[#64748B] hover:text-[#94A3B8] p-1"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddInput(true)}
              className="text-xs font-mono font-medium text-[#FF2E51] hover:text-[#FF2E51]/80 inline-flex items-center gap-1.5 py-1 px-2.5 rounded-[4px] bg-[#FF2E51]/10 border border-[#FF2E51]/30 transition-colors shadow-[0_0_8px_rgba(255,46,81,0.15)]"
            >
              <Plus className="w-3.5 h-3.5" /> + Track Stock
            </button>
          )}

          <Link
            href="/watchlist"
            className="text-xs font-mono font-medium text-[#94A3B8] hover:text-[#FF2E51] inline-flex items-center gap-1 transition-colors"
          >
            Manage Lists <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Prominent Watchlist Table / Cards */}
      <div className="fin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="fin-table">
            <thead>
              <tr>
                <th>TICKER</th>
                <th>COMPANY</th>
                <th className="text-right">LAST PRICE</th>
                <th className="text-right">TODAY&apos;S CHANGE</th>
                <th className="text-right">DAY RANGE</th>
                <th className="text-right">INTRADAY</th>
                <th className="text-center w-12">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {displayedStocks.map((stock) => {
                const isPos = stock.change >= 0;
                return (
                  <tr key={stock.symbol} className="group">
                    <td>
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        className="font-mono font-bold text-xs text-[#F8FAFC] group-hover:text-[#FF2E51] transition-colors"
                      >
                        {stock.symbol}
                      </Link>
                    </td>
                    <td>
                      <span className="text-xs text-[#9CA3AF] font-sans truncate max-w-[180px] block">
                        {stock.name}
                      </span>
                    </td>
                    <td className="text-right font-mono text-sm font-semibold text-[#F3F4F6]">
                      ₹{stock.price.toFixed(2)}
                    </td>
                    <td className="text-right">
                      <MetricValue
                        value={stock.percentChange}
                        type="percent"
                        className="text-xs font-semibold"
                      />
                    </td>
                    <td className="text-right font-mono text-xs text-[#6B7280]">
                      ₹{stock.low.toFixed(0)} - ₹{stock.high.toFixed(0)}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end">
                        <Sparkline data={stock.sparkline} width={70} height={20} positive={isPos} />
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleRemoveTicker(stock.symbol)}
                        className="text-[#6B7280] hover:text-[#F43F5E] p-1 transition-colors"
                        title="Remove from watchlist"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
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
