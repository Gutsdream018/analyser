'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StockDetails } from '@/types/stock';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricValue } from '@/components/common/metric-value';
import { formatRupees, formatVolume } from '@/lib/formatters/currency';
import { ArrowRight } from 'lucide-react';

interface TopMoversCleanProps {
  gainers: StockDetails[];
  losers: StockDetails[];
  volumeShockers: StockDetails[];
}

export function TopMoversClean({ gainers, losers, volumeShockers }: TopMoversCleanProps) {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'volume' | 'unusual'>('gainers');

  // Derive unusual activity (high volume + significant price movement)
  const unusualActivity = [...gainers, ...losers]
    .filter((s) => s.volumeMultiplier >= 1.3)
    .sort((a, b) => b.volumeMultiplier - a.volumeMultiplier);

  const currentList =
    activeTab === 'gainers'
      ? gainers
      : activeTab === 'losers'
      ? losers
      : activeTab === 'volume'
      ? volumeShockers
      : unusualActivity;

  return (
    <div className="space-y-3">
      {/* Header and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#241117]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
            TOP MOVERS
          </h2>
          <p className="text-xs text-[#6B7280]">
            NSE equities ranked by momentum, decline, and volume deviation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab selector */}
          <div className="flex items-center gap-1 bg-[#0C070A] p-0.5 rounded-[4px] border border-[#241117]">
            {(
              [
                { id: 'gainers', label: 'Gainers' },
                { id: 'losers', label: 'Losers' },
                { id: 'volume', label: 'Volume' },
                { id: 'unusual', label: 'Unusual Activity' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-[3px] transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FF2E51]/15 text-[#FF2E51] font-semibold border border-[#FF2E51]/30 shadow-[0_0_10px_rgba(255,46,81,0.2)]'
                    : 'text-[#6B7280] hover:text-[#9CA3AF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            href="/screener"
            className="text-xs font-mono font-medium text-[#94A3B8] hover:text-[#FF2E51] inline-flex items-center gap-1 transition-colors pl-2"
          >
            Screener <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Spacious Financial Table */}
      <div className="fin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="fin-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>COMPANY</th>
                <th className="text-right">PRICE</th>
                <th className="text-right">CHANGE</th>
                <th className="text-right">
                  {activeTab === 'volume' || activeTab === 'unusual' ? 'VOL SURGE' : 'VOLUME'}
                </th>
                <th>SECTOR</th>
                <th className="text-right">TODAY</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((stock) => {
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
                      <span className="text-xs text-[#94A3B8] font-sans truncate max-w-[200px] block">
                        {stock.name}
                      </span>
                    </td>
                    <td className="text-right font-mono text-xs font-semibold text-[#F8FAFC]">
                      ₹{stock.price.toFixed(2)}
                    </td>
                    <td className="text-right">
                      <MetricValue
                        value={stock.percentChange}
                        type="percent"
                        className="text-xs font-semibold"
                      />
                    </td>
                    <td className="text-right font-mono text-xs text-[#94A3B8]">
                      {activeTab === 'volume' || activeTab === 'unusual' ? (
                        <span className="text-[#FF2E51] font-semibold px-1.5 py-0.5 rounded bg-[#FF2E51]/10 border border-[#FF2E51]/30">
                          {stock.volumeMultiplier.toFixed(2)}x surge
                        </span>
                      ) : (
                        formatVolume(stock.volume)
                      )}
                    </td>
                    <td>
                      <span className="text-[11px] font-sans text-[#9CA3AF] px-2 py-0.5 rounded-[3px] bg-[#130B10] border border-[#241117]">
                        {stock.sector}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end">
                        <Sparkline data={stock.sparkline} width={64} height={20} positive={isPos} />
                      </div>
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
