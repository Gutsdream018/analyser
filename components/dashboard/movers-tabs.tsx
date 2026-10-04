'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StockDetails } from '@/types/stock';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricValue } from '@/components/common/metric-value';
import { formatRupees, formatVolume } from '@/lib/formatters/currency';

interface MoversTabsProps {
  gainers: StockDetails[];
  losers: StockDetails[];
  volumeShockers: StockDetails[];
}

export function MoversTabs({ gainers, losers, volumeShockers }: MoversTabsProps) {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'volume'>('gainers');

  const currentList =
    activeTab === 'gainers' ? gainers : activeTab === 'losers' ? losers : volumeShockers;

  return (
    <div className="terminal-panel overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#23262C] bg-[#111318]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`px-2.5 py-1 text-xs font-mono rounded-[3px] transition-colors ${
              activeTab === 'gainers'
                ? 'bg-[#2FD675]/15 text-[#2FD675] border border-[#2FD675]/30'
                : 'text-[#868C97] hover:text-[#E7E9EC]'
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`px-2.5 py-1 text-xs font-mono rounded-[3px] transition-colors ${
              activeTab === 'losers'
                ? 'bg-[#F2495C]/15 text-[#F2495C] border border-[#F2495C]/30'
                : 'text-[#868C97] hover:text-[#E7E9EC]'
            }`}
          >
            Losers
          </button>
          <button
            onClick={() => setActiveTab('volume')}
            className={`px-2.5 py-1 text-xs font-mono rounded-[3px] transition-colors ${
              activeTab === 'volume'
                ? 'bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30'
                : 'text-[#868C97] hover:text-[#E7E9EC]'
            }`}
          >
            Volume Shockers
          </button>
        </div>

        <Link
          href="/screener"
          className="text-[11px] font-mono text-[#868C97] hover:text-[#00F59B] transition-colors"
        >
          Screener Presets →
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="terminal-table">
          <thead>
            <tr>
              <th>SYMBOL</th>
              <th className="text-right">LTP (₹)</th>
              <th className="text-right">CHG %</th>
              <th className="text-right">{activeTab === 'volume' ? 'VOL MULTIPLIER' : 'VOLUME'}</th>
              <th className="text-right">INTRADAY</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((stock) => {
              const isPos = stock.change >= 0;
              return (
                <tr key={stock.symbol}>
                  <td>
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      className="font-mono font-medium text-xs text-[#E7E9EC] hover:text-[#00F59B] transition-colors block"
                    >
                      {stock.symbol}
                      <span className="block text-[10px] text-[#868C97] font-sans font-normal truncate max-w-[130px]">
                        {stock.name}
                      </span>
                    </Link>
                  </td>
                  <td className="text-right font-mono text-xs text-[#E7E9EC]">
                    {stock.price.toFixed(2)}
                  </td>
                  <td className="text-right">
                    <MetricValue
                      value={stock.percentChange}
                      type="percent"
                      className="text-xs font-semibold"
                    />
                  </td>
                  <td className="text-right font-mono text-xs text-[#868C97]">
                    {activeTab === 'volume' ? (
                      <span className="text-[#00F59B] font-semibold">
                        {stock.volumeMultiplier.toFixed(2)}x
                      </span>
                    ) : (
                      formatVolume(stock.volume)
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end">
                      <Sparkline data={stock.sparkline} width={64} height={18} positive={isPos} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
