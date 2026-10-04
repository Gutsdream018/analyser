'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWatchlistStore } from '@/store/watchlistStore';
import { useMarketStore } from '@/store/marketStore';
import { Plus, X, Search, ArrowUpRight } from 'lucide-react';

export function WatchlistWidget() {
  const { symbols, addStock, removeStock, maxDisplayCount } = useWatchlistStore();
  const { stocks } = useMarketStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Map symbols to live stock details from store
  const displayStocks = symbols.slice(0, maxDisplayCount).map((sym) => {
    const live = stocks.find((s) => s.symbol.toUpperCase() === sym.toUpperCase());
    return {
      symbol: sym,
      name: live?.name || sym,
      price: live?.price || 1500,
      change: live?.change || 15.2,
      percentChange: live?.percentChange || 1.15,
    };
  });

  const fallbackEquities = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 3121.5 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1642.3 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 721.8 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1243.2 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 842.1 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4210.0 },
    { symbol: 'INFY', name: 'Infosys Ltd', price: 1885.4 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1540.2 },
    { symbol: 'ITC', name: 'ITC Ltd', price: 512.4 },
    { symbol: 'WIPRO', name: 'Wipro Ltd', price: 524.3 },
  ];

  const stockPool = stocks && stocks.length > 0 ? stocks : fallbackEquities;

  const availableToAdd = stockPool.filter(
    (s) =>
      !symbols.includes(s.symbol) &&
      (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Table Header & Add Trigger */}
      <div className="flex items-center justify-between text-xs pb-1 border-b border-[#202A38]/50 font-mono text-[#64748B]">
        <div className="grid grid-cols-12 w-full pr-6">
          <span className="col-span-5 text-[11px] uppercase tracking-wider font-semibold">Symbol</span>
          <span className="col-span-4 text-right text-[11px] uppercase tracking-wider font-semibold">LTP</span>
          <span className="col-span-3 text-right text-[11px] uppercase tracking-wider font-semibold">%</span>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          title="Add stock to watchlist"
          className="p-1 rounded text-[#94A3B8] hover:text-[#E11D48] hover:bg-white/[0.05] transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stock Rows */}
      <div className="divide-y divide-[#202A38]/40 overflow-y-auto max-h-64 pr-1">
        {displayStocks.map((stock) => {
          const isPos = stock.percentChange >= 0;
          const colorClass = isPos ? 'text-[#10B981]' : 'text-[#F43F5E]';

          return (
            <div
              key={stock.symbol}
              className="group flex items-center justify-between py-2 text-xs font-mono hover:bg-white/[0.02] rounded px-1 transition-colors"
            >
              <Link
                href={`/stocks/${stock.symbol}`}
                className="grid grid-cols-12 w-full items-baseline"
              >
                <div className="col-span-5 truncate pr-1">
                  <span className="font-bold text-[#F9FAFB] group-hover:text-[#E11D48] transition-colors block">
                    {stock.symbol}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-sans truncate block leading-tight">
                    {stock.name}
                  </span>
                </div>

                <div className="col-span-4 text-right text-[#F9FAFB] font-semibold tabular-nums">
                  ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <div className={`col-span-3 text-right font-semibold tabular-nums ${colorClass}`}>
                  {isPos ? '+' : ''}{stock.percentChange.toFixed(2)}%
                </div>
              </Link>

              {/* Remove Stock on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeStock(stock.symbol);
                }}
                title={`Remove ${stock.symbol}`}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#64748B] hover:text-[#F43F5E] transition-all ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Inline Quick Add Modal */}
      {isAddModalOpen && (
        <div className="p-3 rounded-lg bg-[#111925] border border-[#202A38] space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#F9FAFB]">
            <span>Add Stock to Watchlist</span>
            <button onClick={() => setIsAddModalOpen(false)} className="text-[#64748B] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search ticker (e.g. RELIANCE, TCS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded bg-[#0D131D] border border-[#202A38] text-xs font-mono text-[#F9FAFB] placeholder-[#64748B] focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div className="max-h-32 overflow-y-auto divide-y divide-[#202A38]/50 text-xs font-mono">
            {availableToAdd.slice(0, 5).map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => {
                  addStock(stock.symbol);
                  setIsAddModalOpen(false);
                  setSearchQuery('');
                }}
                className="py-1.5 px-2 hover:bg-white/[0.05] cursor-pointer flex items-center justify-between rounded"
              >
                <span className="font-bold text-[#F9FAFB]">{stock.symbol}</span>
                <span className="text-[#94A3B8]">₹{stock.price.toFixed(2)}</span>
              </div>
            ))}
            {availableToAdd.length === 0 && (
              <div className="text-[11px] text-[#64748B] py-2 text-center">
                No matching equities found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
