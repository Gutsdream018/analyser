'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Newspaper, Layers, ArrowRight, X } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  const searchableItems = [
    { type: 'INDEX', symbol: 'NIFTY 50', name: 'NSE Benchmark Index', href: '/markets?index=NIFTY' },
    { type: 'INDEX', symbol: 'BANK NIFTY', name: 'Banking Sector Benchmark', href: '/markets?index=BANKNIFTY' },
    { type: 'INDEX', symbol: 'INDIA VIX', name: 'Volatility Index', href: '/markets?index=VIX' },
    { type: 'INDEX', symbol: 'NIFTY IT', name: 'IT Sector Index', href: '/markets?index=IT' },
    { type: 'STOCK', symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', ltp: '₹3,121.50', href: '/stocks/RELIANCE' },
    { type: 'STOCK', symbol: 'TCS', name: 'Tata Consultancy Services', ltp: '₹4,210.00', href: '/stocks/TCS' },
    { type: 'STOCK', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', ltp: '₹1,642.30', href: '/stocks/HDFCBANK' },
    { type: 'STOCK', symbol: 'INFY', name: 'Infosys Ltd.', ltp: '₹1,885.40', href: '/stocks/INFY' },
    { type: 'STOCK', symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', ltp: '₹1,243.20', href: '/stocks/ICICIBANK' },
    { type: 'STOCK', symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', ltp: '₹721.80', href: '/stocks/TATAMOTORS' },
    { type: 'STOCK', symbol: 'SBIN', name: 'State Bank of India', ltp: '₹842.10', href: '/stocks/SBIN' },
    { type: 'SECTOR', symbol: 'Banking', name: 'Private & PSU Banks Sector', href: '/markets?sector=Banking' },
    { type: 'SECTOR', symbol: 'Auto', name: 'Automobile Manufacturers', href: '/markets?sector=Auto' },
    { type: 'SECTOR', symbol: 'IT', name: 'Information Technology', href: '/markets?sector=IT' },
    { type: 'SECTOR', symbol: 'Pharma', name: 'Pharmaceuticals & Healthcare', href: '/markets?sector=Pharma' },
    { type: 'NEWS', symbol: 'RBI Monetary Policy', name: 'RBI keeps stance unchanged; growth support', href: '/news' },
    { type: 'NEWS', symbol: 'HDFC Deposit Outlook', name: 'Deposit mobilization updates', href: '/news' },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? searchableItems.slice(0, 8)
    : searchableItems.filter(
        (item) =>
          item.symbol.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-100">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 bg-[#0D131D] border border-border rounded-xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-border/80 flex items-center gap-3 bg-[#111925]">
          <Search className="w-4 h-4 text-rose-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks, indices, sectors, news or companies..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-border/80 text-slate-400">
            ESC
          </span>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#162030] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[#070B12] border border-border/70 text-slate-400 group-hover:text-rose-400 group-hover:border-rose-500/40">
                    {item.type === 'STOCK' ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : item.type === 'INDEX' ? (
                      <Layers className="w-3.5 h-3.5" />
                    ) : (
                      <Newspaper className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{item.symbol}</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-border/60 text-slate-400">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                      {item.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.ltp && (
                    <span className="text-xs font-mono font-medium text-slate-300">
                      {item.ltp}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-border/70 bg-[#070B12] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Quick search NIFTY, TCS, RELIANCE, Banking</span>
          <span>Press ↵ to navigate</span>
        </div>
      </div>
    </div>
  );
}
