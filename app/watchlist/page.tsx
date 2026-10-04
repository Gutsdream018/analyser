'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWatchlists } from '@/lib/api/calendar';
import { getAllStocks } from '@/lib/api/stocks';
import { WatchlistGroup } from '@/types/calendar';
import { StockDetails } from '@/types/stock';
import { MetricValue } from '@/components/common/metric-value';
import { Sparkline } from '@/components/charts/sparkline';
import { formatRupees, formatVolume, formatMarketCapCr } from '@/lib/formatters/currency';
import { Plus, Trash2 } from 'lucide-react';

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<WatchlistGroup[]>([]);
  const [activeListId, setActiveListId] = useState<string>('wl-1');
  const [allStocks, setAllStocks] = useState<StockDetails[]>([]);
  const [newSymbol, setNewSymbol] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      const [wls, stocks] = await Promise.all([getWatchlists(), getAllStocks()]);
      setWatchlists(wls);
      setAllStocks(stocks);
    }
    loadData();
  }, []);

  const activeList = watchlists.find((w) => w.id === activeListId) || watchlists[0];

  const currentStocks = activeList
    ? allStocks.filter((s) => activeList.symbols.includes(s.symbol))
    : [];

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    const cleanSym = newSymbol.trim().toUpperCase();
    if (activeList.symbols.includes(cleanSym)) {
      setNewSymbol('');
      return;
    }
    const updated = watchlists.map((wl) => {
      if (wl.id === activeListId) {
        return { ...wl, symbols: [...wl.symbols, cleanSym] };
      }
      return wl;
    });
    setWatchlists(updated);
    setNewSymbol('');
  };

  const handleRemoveSymbol = (sym: string) => {
    const updated = watchlists.map((wl) => {
      if (wl.id === activeListId) {
        return { ...wl, symbols: wl.symbols.filter((s) => s !== sym) };
      }
      return wl;
    });
    setWatchlists(updated);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Watchlists &amp; Custom Baskets
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Monitor personalized baskets of equities with real-time intraday price action and sparklines
          </p>
        </div>

        {/* Add Ticker Form */}
        <form onSubmit={handleAddSymbol} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add ticker (e.g. M&M)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono bg-[#0C070A] text-[#F3F4F6] border border-[#241117] rounded-[4px] outline-none placeholder-[#6B7280] focus:border-[#FF2E51]/50"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3.5 py-1.5 bg-[#FF2E51] text-white font-mono font-bold text-xs rounded-[4px] hover:bg-[#FF1744] shadow-[0_0_12px_rgba(255,46,81,0.35)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Watchlist Tabs */}
      <div className="flex items-center gap-2 border-b border-[#241117] pb-3 overflow-x-auto">
        {watchlists.map((wl) => (
          <button
            key={wl.id}
            onClick={() => setActiveListId(wl.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-[4px] transition-colors whitespace-nowrap ${
              activeListId === wl.id
                ? 'bg-[#FF2E51]/15 text-[#FF2E51] border border-[#FF2E51]/30 font-semibold shadow-[0_0_8px_rgba(255,46,81,0.2)]'
                : 'text-[#6B7280] hover:text-[#9CA3AF]'
            }`}
          >
            {wl.name} ({wl.symbols.length})
          </button>
        ))}
      </div>

      {/* Watchlist Table */}
      <div className="fin-card overflow-hidden">
        {currentStocks.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#6B7280]">
            No stocks in this list. Enter a ticker symbol above to start tracking.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>TICKER</th>
                  <th>SECTOR</th>
                  <th className="text-right">PRICE</th>
                  <th className="text-right">CHANGE</th>
                  <th className="text-right">VOLUME</th>
                  <th className="text-right">MKT CAP</th>
                  <th className="text-right">INTRADAY</th>
                  <th className="text-center w-12">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentStocks.map((stock) => (
                  <tr key={stock.symbol} className="group">
                    <td>
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        className="font-mono font-bold text-xs text-[#F3F4F6] hover:text-[#FF2E51] transition-colors block"
                      >
                        {stock.symbol}
                        <span className="block text-[11px] text-[#6B7280] font-normal truncate max-w-[140px]">
                          {stock.name}
                        </span>
                      </Link>
                    </td>
                    <td className="text-xs text-[#6B7280] font-sans">{stock.sector}</td>
                    <td className="text-right font-mono text-xs font-semibold text-[#F3F4F6]">
                      ₹{stock.price.toFixed(2)}
                    </td>
                    <td className="text-right">
                      <MetricValue value={stock.percentChange} type="percent" className="text-xs font-semibold" />
                    </td>
                    <td className="text-right font-mono text-xs text-[#6B7280]">
                      {formatVolume(stock.volume)}
                    </td>
                    <td className="text-right font-mono text-xs text-[#6B7280]">
                      {formatMarketCapCr(stock.marketCapCr)}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end">
                        <Sparkline data={stock.sparkline} width={60} height={18} positive={stock.change >= 0} />
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleRemoveSymbol(stock.symbol)}
                        className="p-1 text-[#6B7280] hover:text-[#F43F5E] transition-colors"
                        title="Remove from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
