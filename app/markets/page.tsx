'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMarketIndices, getSectorHeatmap } from '@/lib/api/market';
import { getGlobalMarkets, getCommoditiesAndCurrencies, getFiiDiiData } from '@/lib/api/macro';
import { getAllStocks } from '@/lib/api/stocks';
import { MarketIndex, SectorPerformance, GlobalMarket, CommodityOrCurrency } from '@/types/market';
import { StockDetails } from '@/types/stock';
import { MetricValue } from '@/components/common/metric-value';
import { Sparkline } from '@/components/charts/sparkline';
import { ArrowUpRight } from 'lucide-react';

export default function MarketsPage() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '6M' | '1Y'>('1D');
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [globals, setGlobals] = useState<GlobalMarket[]>([]);
  const [commodities, setCommodities] = useState<CommodityOrCurrency[]>([]);
  const [fiiDii, setFiiDii] = useState<{ date: string; fiiNet: number; diiNet: number }[]>([]);
  const [stocks, setStocks] = useState<StockDetails[]>([]);

  useEffect(() => {
    async function loadData() {
      const [idx, sec, glb, com, fnd, stk] = await Promise.all([
        getMarketIndices(),
        getSectorHeatmap(),
        getGlobalMarkets(),
        getCommoditiesAndCurrencies(),
        getFiiDiiData(),
        getAllStocks(),
      ]);
      setIndices(idx);
      setSectors(sec);
      setGlobals(glb);
      setCommodities(com);
      setFiiDii(fnd);
      setStocks(stk);
    }
    loadData();
  }, []);

  const stocksNear52WHigh = stocks
    .filter((s) => s.distanceFrom52WHigh <= 8.0)
    .sort((a, b) => a.distanceFrom52WHigh - b.distanceFrom52WHigh);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Markets Overview &amp; Depth
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Benchmark indices, sectoral weights, institutional liquidity, and global linkages
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-[#141720] p-1 rounded-[5px] border border-white/[0.08]">
          {(['1D', '1W', '1M', '6M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-[3px] transition-colors ${
                timeframe === tf
                  ? 'bg-white/[0.12] text-[#F3F4F6] font-semibold'
                  : 'text-[#6B7280] hover:text-[#9CA3AF]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Indices Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {indices.map((idx) => (
          <div key={idx.symbol} className="fin-card p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] block truncate">
              {idx.symbol}
            </span>
            <div className="my-2">
              <span className="font-mono text-lg font-bold text-[#F3F4F6] block tabular-nums">
                {idx.current.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <MetricValue value={idx.percentChange} type="percent" className="text-xs font-medium block" />
            </div>
            <Sparkline data={idx.sparkline} width={70} height={20} positive={idx.change >= 0} />
          </div>
        ))}
      </section>

      {/* Sector Performance & Institutional Flows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Weights Table (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="pb-2 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
              SECTOR PERFORMANCE &amp; WEIGHTS
            </h2>
            <p className="text-xs text-[#6B7280]">Nifty sectoral indices ranked by index weightage</p>
          </div>
          <div className="fin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>SECTOR</th>
                    <th className="text-right">CHANGE</th>
                    <th className="text-right">WEIGHT</th>
                    <th className="text-right">P/E</th>
                    <th className="text-right">TOP CONTRIBUTOR</th>
                  </tr>
                </thead>
                <tbody>
                  {sectors.map((sec) => (
                    <tr key={sec.sector}>
                      <td className="font-mono text-xs font-semibold text-[#F3F4F6]">
                        {sec.name}
                        <span className="block text-[10px] text-[#6B7280] font-normal">{sec.sector}</span>
                      </td>
                      <td className="text-right">
                        <MetricValue value={sec.change} type="percent" className="text-xs font-bold" />
                      </td>
                      <td className="text-right font-mono text-xs text-[#9CA3AF]">
                        {sec.weight}%
                      </td>
                      <td className="text-right font-mono text-xs text-[#F3F4F6]">
                        {sec.pe.toFixed(1)}
                      </td>
                      <td className="text-right font-mono text-xs text-[#FF2E51]">
                        {sec.topContributor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FII / DII Flows (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="pb-2 border-b border-[#241117]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
              INSTITUTIONAL CASH ACTIVITY
            </h2>
            <p className="text-xs text-[#6B7280]">FII vs DII net equity absorption (₹ Cr)</p>
          </div>
          <div className="fin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th className="text-right">FII NET</th>
                    <th className="text-right">DII NET</th>
                    <th className="text-right">COMBINED</th>
                  </tr>
                </thead>
                <tbody>
                  {fiiDii.slice(-8).map((f) => {
                    const combined = f.fiiNet + f.diiNet;
                    return (
                      <tr key={f.date}>
                        <td className="font-mono text-xs text-[#6B7280]">{f.date}</td>
                        <td className="text-right">
                          <MetricValue value={f.fiiNet} type="points" className="text-xs" />
                        </td>
                        <td className="text-right">
                          <MetricValue value={f.diiNet} type="points" className="text-xs" />
                        </td>
                        <td className="text-right font-mono text-xs font-semibold">
                          <MetricValue value={combined} type="points" className="text-xs font-semibold" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 52-Week High Breakouts & Global Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 52-Week High Monitor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#241117]">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
                NEAR 52-WEEK HIGH BREAKOUTS
              </h2>
              <p className="text-xs text-[#6B7280]">Equities within 8% of all-time highs</p>
            </div>
            <Link
              href="/screener"
              className="text-xs text-[#9CA3AF] hover:text-[#FF2E51] inline-flex items-center gap-1 transition-colors"
            >
              Scanner <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="fin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>SYMBOL</th>
                    <th className="text-right">PRICE (₹)</th>
                    <th className="text-right">52W HIGH</th>
                    <th className="text-right">GAP</th>
                    <th className="text-right">CHG %</th>
                  </tr>
                </thead>
                <tbody>
                  {stocksNear52WHigh.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <Link
                          href={`/stocks/${stock.symbol}`}
                          className="font-mono font-bold text-xs text-[#F3F4F6] hover:text-[#FF2E51] transition-colors"
                        >
                          {stock.symbol}
                        </Link>
                      </td>
                      <td className="text-right font-mono text-xs text-[#F3F4F6]">
                        {stock.price.toFixed(2)}
                      </td>
                      <td className="text-right font-mono text-xs text-[#6B7280]">
                        {stock.fiftyTwoWeekHigh.toFixed(2)}
                      </td>
                      <td className="text-right font-mono text-xs text-[#38BDF8] font-semibold">
                        -{stock.distanceFrom52WHigh.toFixed(1)}%
                      </td>
                      <td className="text-right">
                        <MetricValue value={stock.percentChange} type="percent" className="text-xs font-semibold" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Financial Benchmarks & Currencies */}
        <div className="space-y-3">
          <div className="pb-2 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
              GLOBAL MARKETS &amp; CURRENCIES
            </h2>
            <p className="text-xs text-[#6B7280]">World indices, commodities, and FX exchange rates</p>
          </div>
          <div className="fin-card p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {globals.slice(0, 6).map((g) => (
                <div key={g.symbol} className="p-3 rounded-[4px] bg-[#141720] border border-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#F3F4F6]">{g.symbol}</span>
                    <span className="text-[10px] font-mono text-[#6B7280]">{g.region}</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="font-mono text-xs text-[#9CA3AF]">{g.value.toLocaleString()}</span>
                    <MetricValue value={g.percentChange} type="percent" className="text-xs font-medium" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.05] grid grid-cols-2 sm:grid-cols-4 gap-3">
              {commodities.map((c) => (
                <div key={c.symbol} className="p-2.5 rounded-[4px] bg-[#141720] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-[#6B7280] block truncate">{c.symbol}</span>
                  <span className="font-mono text-xs font-bold text-[#F3F4F6] block mt-0.5">
                    {c.value.toLocaleString()} {c.unit}
                  </span>
                  <MetricValue value={c.percentChange} type="percent" className="text-[10px] mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
