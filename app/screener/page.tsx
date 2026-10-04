'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllStocks } from '@/lib/api/stocks';
import { getScreenerPresets } from '@/lib/api/calendar';
import { StockDetails } from '@/types/stock';
import { PresetQuery, ScreenerFilterState } from '@/types/screener';
import { MetricValue } from '@/components/common/metric-value';
import { Sparkline } from '@/components/charts/sparkline';
import { formatRupees, formatVolume, formatMarketCapCr } from '@/lib/formatters/currency';
import { RotateCcw, Check, SlidersHorizontal } from 'lucide-react';

const initialFilterState: ScreenerFilterState = {
  marketCap: 'All',
  minPrice: 0,
  maxPrice: 100000,
  minPercentChange: -20,
  maxPercentChange: 20,
  minVolumeMultiplier: 0.5,
  minRsi: 0,
  maxRsi: 100,
  maxDistance52WHigh: 100,
  sector: 'All',
};

export default function ScreenerPage() {
  const [stocks, setStocks] = useState<StockDetails[]>([]);
  const [presets, setPresets] = useState<PresetQuery[]>([]);
  const [filters, setFilters] = useState<ScreenerFilterState>(initialFilterState);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [allStk, allPre] = await Promise.all([getAllStocks(), getScreenerPresets()]);
      setStocks(allStk);
      setPresets(allPre);
    }
    loadData();
  }, []);

  const handleApplyPreset = (preset: PresetQuery) => {
    setActivePreset(preset.id);
    setFilters({
      ...initialFilterState,
      ...preset.filter,
      selectedPreset: preset.id,
    });
  };

  const handleReset = () => {
    setActivePreset(null);
    setFilters(initialFilterState);
  };

  const filteredStocks = stocks.filter((s) => {
    if (filters.marketCap !== 'All' && s.capCategory !== filters.marketCap) return false;
    if (s.price < filters.minPrice || s.price > filters.maxPrice) return false;
    if (s.percentChange < filters.minPercentChange || s.percentChange > filters.maxPercentChange) return false;
    if (s.volumeMultiplier < filters.minVolumeMultiplier) return false;
    if (s.technicals.rsi14 < filters.minRsi || s.technicals.rsi14 > filters.maxRsi) return false;
    if (s.distanceFrom52WHigh > filters.maxDistance52WHigh) return false;
    if (filters.sector !== 'All' && s.sector !== filters.sector) return false;
    return true;
  });

  const availableSectors = ['All', ...new Set(stocks.map((s) => s.sector))];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Systematic Metric Screener
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Rule-based algorithmic screening categories. Observations only — strictly no buy/sell calls.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#141720] border border-white/[0.08] text-xs font-mono text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Preset Categories */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          SCREENING PRESETS (CATEGORIES)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {presets.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className={`text-left p-3.5 rounded-[5px] border transition-all ${
                  isSelected
                    ? 'bg-[#FF2E51]/12 border-[#FF2E51] text-[#F3F4F6] shadow-[0_0_12px_rgba(255,46,81,0.25)]'
                    : 'bg-[#0C070A] border-[#241117] hover:border-[#FF2E51]/30 text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-[#F3F4F6] block truncate">
                    {p.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#FF2E51]" />}
                </div>
                <p className="text-[11px] leading-relaxed line-clamp-2 text-[#6B7280]">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace (Filters + Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="pb-2 border-b border-[#241117]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              FILTER PARAMETERS
            </h2>
          </div>
          <div className="fin-card p-4 space-y-4 text-xs font-mono">
            {/* Market Cap */}
            <div>
              <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Market Cap</label>
              <select
                value={filters.marketCap}
                onChange={(e) => setFilters({ ...filters, marketCap: e.target.value as any, selectedPreset: undefined })}
                className="w-full bg-[#0C070A] border border-[#241117] rounded-[4px] px-2.5 py-1.5 text-[#F3F4F6] outline-none"
              >
                <option value="All">All Caps</option>
                <option value="Large Cap">Large Cap (&gt;₹20k Cr)</option>
                <option value="Mid Cap">Mid Cap (₹5k - ₹20k Cr)</option>
                <option value="Small Cap">Small Cap (&lt;₹5k Cr)</option>
              </select>
            </div>

            {/* Sector */}
            <div>
              <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Sector</label>
              <select
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value, selectedPreset: undefined })}
                className="w-full bg-[#0C070A] border border-[#241117] rounded-[4px] px-2.5 py-1.5 text-[#F3F4F6] outline-none"
              >
                {availableSectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Volume Multiplier */}
            <div>
              <div className="flex justify-between text-[11px] text-[#6B7280] uppercase mb-1">
                <span>Volume Surge</span>
                <span className="text-[#FF2E51] font-mono font-bold">{filters.minVolumeMultiplier}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={filters.minVolumeMultiplier}
                onChange={(e) => setFilters({ ...filters, minVolumeMultiplier: parseFloat(e.target.value), selectedPreset: undefined })}
                className="w-full accent-[#FF2E51]"
              />
            </div>

            {/* Min RSI */}
            <div>
              <div className="flex justify-between text-[11px] text-[#6B7280] uppercase mb-1">
                <span>Min RSI (14)</span>
                <span className="text-[#F3F4F6]">{filters.minRsi}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={filters.minRsi}
                onChange={(e) => setFilters({ ...filters, minRsi: parseInt(e.target.value), selectedPreset: undefined })}
                className="w-full accent-[#FF2E51]"
              />
            </div>

            {/* Max Distance from 52W High */}
            <div>
              <div className="flex justify-between text-[11px] text-[#6B7280] uppercase mb-1">
                <span>Max 52W High Gap</span>
                <span className="text-[#F3F4F6]">{filters.maxDistance52WHigh}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="2"
                value={filters.maxDistance52WHigh}
                onChange={(e) => setFilters({ ...filters, maxDistance52WHigh: parseInt(e.target.value), selectedPreset: undefined })}
                className="w-full accent-[#FF2E51]"
              />
            </div>

            <div className="pt-2 border-t border-[#241117] flex items-center justify-between text-xs font-mono">
              <span className="text-[#6B7280]">Matching Stocks:</span>
              <span className="font-bold text-[#FF2E51]">{filteredStocks.length}</span>
            </div>
          </div>
        </div>

        {/* Results Table (9 cols) */}
        <div className="lg:col-span-9 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#241117]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              MATCHING EQUITIES ({filteredStocks.length})
            </h2>
            <span className="text-xs font-mono text-[#6B7280]">Sorted by Momentum</span>
          </div>

          <div className="fin-card overflow-hidden">
            {filteredStocks.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#6B7280] font-mono">
                No stocks match this filter combination. Try relaxing the RSI or Volume thresholds.
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
                      <th className="text-right">VOL SURGE</th>
                      <th className="text-right">RSI (14)</th>
                      <th className="text-right">52W GAP</th>
                      <th className="text-right">TODAY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock) => (
                      <tr key={stock.symbol} className="group">
                        <td>
                          <Link
                            href={`/stocks/${stock.symbol}`}
                            className="font-mono font-bold text-xs text-[#F3F4F6] group-hover:text-[#FF2E51] transition-colors"
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
                        <td className="text-right font-mono text-xs text-[#FF2E51] font-semibold">
                          {stock.volumeMultiplier.toFixed(1)}x
                        </td>
                        <td className="text-right font-mono text-xs text-[#F3F4F6]">
                          {stock.technicals.rsi14}
                        </td>
                        <td className="text-right font-mono text-xs text-[#6B7280]">
                          -{stock.distanceFrom52WHigh.toFixed(1)}%
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end">
                            <Sparkline data={stock.sparkline} width={50} height={16} positive={stock.change >= 0} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
