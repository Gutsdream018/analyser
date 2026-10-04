'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Layers, Newspaper, Sliders, ArrowRight } from 'lucide-react';
import { mockStocks } from '@/lib/mock-data/stocks';
import { mockSectorPerformance } from '@/lib/mock-data/market';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStocks = mockStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredSectors = mockSectorPerformance.filter(
    (sec) =>
      sec.name.toLowerCase().includes(query.toLowerCase()) ||
      sec.sector.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const routes = [
    { name: 'Dashboard (Command Center)', path: '/dashboard', icon: Layers },
    { name: 'Markets Overview & Breadth', path: '/markets', icon: TrendingUp },
    { name: 'Futures & Options Terminal', path: '/fno', icon: TrendingUp },
    { name: 'Stock Screener', path: '/screener', icon: Sliders },
    { name: 'Live Market News', path: '/news', icon: Newspaper },
    { name: 'AI Daily Market Analysis', path: '/analysis', icon: TrendingUp },
  ].filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#080C14] border border-[#162030] rounded-[4px] shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#162030] bg-[#05070B]">
          <Search className="w-4 h-4 text-[#00F59B]" />
          <input
            autoFocus
            type="text"
            placeholder="Search stocks, sectors, options, routes... (e.g. RELIANCE, Auto, F&O)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#E7E9EC] placeholder-[#868C97] outline-none font-sans"
          />
          <span className="text-[10px] font-mono text-[#868C97] bg-[#23262C] px-1.5 py-0.5 rounded">ESC</span>
          <button onClick={onClose} className="text-[#868C97] hover:text-[#E7E9EC]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Stocks */}
          {filteredStocks.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-[#868C97] px-2 py-1">Equities</div>
              {filteredStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelect(`/stocks/${stock.symbol}`)}
                  className="flex items-center justify-between px-3 py-2 rounded-[3px] hover:bg-[#161920] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-xs text-[#E7E9EC]">{stock.symbol}</span>
                    <span className="text-xs text-[#868C97] truncate max-w-[200px]">{stock.name}</span>
                    <span className="text-[10px] text-[#868C97] border border-[#23262C] px-1 rounded">{stock.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#E7E9EC]">₹{stock.price.toFixed(2)}</span>
                    <span className={`font-mono text-xs ${stock.change >= 0 ? 'text-[#2FD675]' : 'text-[#F2495C]'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sectors */}
          {filteredSectors.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-[#868C97] px-2 py-1">Sectors</div>
              {filteredSectors.map((sec) => (
                <div
                  key={sec.sector}
                  onClick={() => handleSelect('/markets')}
                  className="flex items-center justify-between px-3 py-2 rounded-[3px] hover:bg-[#161920] cursor-pointer transition-colors"
                >
                  <span className="text-xs text-[#E7E9EC]">{sec.name} ({sec.sector})</span>
                  <span className={`font-mono text-xs ${sec.change >= 0 ? 'text-[#2FD675]' : 'text-[#F2495C]'}`}>
                    {sec.change >= 0 ? '+' : ''}{sec.change.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Routes */}
          {routes.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-[#868C97] px-2 py-1">Quick Navigation</div>
              {routes.map((r) => {
                const IconComponent = r.icon;
                return (
                  <div
                    key={r.path}
                    onClick={() => handleSelect(r.path)}
                    className="flex items-center justify-between px-3 py-2 rounded-[3px] hover:bg-[#161920] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-3.5 h-3.5 text-[#00F59B]" />
                      <span className="text-xs text-[#E7E9EC]">{r.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#868C97]" />
                  </div>
                );
              })}
            </div>
          )}

          {filteredStocks.length === 0 && filteredSectors.length === 0 && routes.length === 0 && (
            <div className="p-8 text-center text-xs text-[#868C97]">
              No results found for &ldquo;<span className="text-[#E7E9EC] font-mono">{query}</span>&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
