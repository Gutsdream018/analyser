'use client';

import React, { useState, useEffect } from 'react';
import { getOptionChain, getFnoSnapshot, getFnoBuildUps } from '@/lib/api/fno';
import { OptionChain, FnoSnapshot, FnoBuildUp } from '@/types/fno';
import { MetricValue } from '@/components/common/metric-value';
import { formatRupees, formatVolume } from '@/lib/formatters/currency';
import { Binary, ArrowUpRight } from 'lucide-react';

export default function FnoPage() {
  const [activeUnderlying, setActiveUnderlying] = useState<'NIFTY 50' | 'BANK NIFTY'>('NIFTY 50');
  const [optionChain, setOptionChain] = useState<OptionChain | null>(null);
  const [snapshot, setSnapshot] = useState<FnoSnapshot | null>(null);
  const [buildUps, setBuildUps] = useState<FnoBuildUp[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('03 Oct 2026');
  const [strikeRange, setStrikeRange] = useState<'5' | '10' | 'all'>('5');

  useEffect(() => {
    async function loadFno() {
      const [chain, snap, bld] = await Promise.all([
        getOptionChain(activeUnderlying),
        getFnoSnapshot(),
        getFnoBuildUps(),
      ]);
      setOptionChain(chain);
      setSnapshot(snap);
      setBuildUps(bld);
    }
    loadFno();
  }, [activeUnderlying]);

  if (!optionChain || !snapshot) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-mono text-[#9CA3AF]">
        Loading derivatives matrix...
      </div>
    );
  }

  const isNifty = activeUnderlying === 'NIFTY 50';
  const spotPrice = isNifty ? snapshot.niftySpot : snapshot.bankNiftySpot;
  const futurePrice = isNifty ? snapshot.niftyFuture : snapshot.bankNiftyFuture;
  const basis = isNifty ? snapshot.niftyBasis : snapshot.bankNiftyBasis;
  const pcr = isNifty ? snapshot.niftyPcr : snapshot.bankNiftyPcr;
  const maxPain = isNifty ? snapshot.niftyMaxPain : snapshot.bankNiftyMaxPain;

  const atmIndex = optionChain.strikes.findIndex((s) => s.isAtm);
  let displayedStrikes = optionChain.strikes;
  if (strikeRange === '5' && atmIndex !== -1) {
    displayedStrikes = optionChain.strikes.slice(Math.max(0, atmIndex - 4), atmIndex + 5);
  } else if (strikeRange === '10' && atmIndex !== -1) {
    displayedStrikes = optionChain.strikes.slice(Math.max(0, atmIndex - 8), atmIndex + 9);
  }

  // Max OI in chain for bar scaling
  const maxCallOi = Math.max(...optionChain.strikes.map((s) => s.callOi));
  const maxPutOi = Math.max(...optionChain.strikes.map((s) => s.putOi));

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TOP: NIFTY / BANK NIFTY SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Derivatives &amp; Options Workspace
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Real-time open interest distribution, option chain matrix, and participant build-ups
          </p>
        </div>

        {/* NIFTY vs BANK NIFTY toggle */}
        <div className="flex items-center gap-1 bg-[#141720] p-1 rounded-[5px] border border-white/[0.08]">
          {(['NIFTY 50', 'BANK NIFTY'] as const).map((sym) => (
            <button
              key={sym}
              onClick={() => setActiveUnderlying(sym)}
              className={`px-4 py-1.5 text-xs font-mono font-semibold rounded-[4px] transition-colors ${
                activeUnderlying === sym
                  ? 'bg-white/[0.12] text-[#F3F4F6] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#9CA3AF]'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* 2. DERIVATIVE KEY STATS: Spot, Futures, PCR, IV, India VIX, Max Pain */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="fin-card p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
            Spot Price
          </span>
          <span className="text-xl font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
            {spotPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-[#10B981] font-mono mt-0.5 block">+0.58% Today</span>
        </div>

        <div className="fin-card p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
            Futures Price
          </span>
          <span className="text-xl font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
            {futurePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-mono text-[#00F59B] mt-0.5 block">
            Basis: +{basis.toFixed(1)} pts
          </span>
        </div>

        <div className="fin-card p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
            Put-Call Ratio (PCR)
          </span>
          <span className="text-xl font-bold font-mono text-[#00F59B] tabular-nums block mt-1">
            {pcr}
          </span>
          <span className="text-[11px] text-[#9CA3AF] mt-0.5 block">Mild Put Bias</span>
        </div>

        <div className="fin-card p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
            ATM Implied Vol (IV)
          </span>
          <span className="text-xl font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
            12.7%
          </span>
          <span className="text-[11px] text-[#9CA3AF] mt-0.5 block">At the Money Strike</span>
        </div>

        <div className="fin-card p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
            India VIX
          </span>
          <span className="text-xl font-bold font-mono text-[#FF2E51] tabular-nums block mt-1">
            {snapshot.indiaVix}
          </span>
          <span className="text-[11px] text-[#FF2E51] font-mono mt-0.5 block">
            {snapshot.indiaVixChange}% Vol Easing
          </span>
        </div>

        <div className="fin-card p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
            Max Pain Level
          </span>
          <span className="text-xl font-bold font-mono text-[#FF2E51] tabular-nums block mt-1">
            {maxPain}
          </span>
          <span className="text-[11px] text-[#9CA3AF] mt-0.5 block">Weekly Expiry</span>
        </div>
      </section>

      {/* 3. OPTION CHAIN SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#241117]">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
              OPTION CHAIN
            </h2>
            <span className="text-white/[0.2]">•</span>
            <span className="text-xs text-[#6B7280]">
              Expiry: {selectedExpiry}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Expiry Selector */}
            <select
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
              className="bg-[#0C070A] border border-[#241117] text-xs font-mono text-[#F3F4F6] px-2.5 py-1 rounded-[4px] outline-none"
            >
              {optionChain.availableExpiries.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>

            {/* Strike Range Selector */}
            <div className="flex items-center gap-1 bg-[#0C070A] p-0.5 rounded-[4px] border border-[#241117] text-xs font-mono">
              <button
                onClick={() => setStrikeRange('5')}
                className={`px-2.5 py-0.5 rounded-[3px] transition-colors ${
                  strikeRange === '5' ? 'bg-[#FF2E51]/15 text-[#FF2E51] font-semibold border border-[#FF2E51]/30' : 'text-[#6B7280]'
                }`}
              >
                ±5 Strikes
              </button>
              <button
                onClick={() => setStrikeRange('10')}
                className={`px-2.5 py-0.5 rounded-[3px] transition-colors ${
                  strikeRange === '10' ? 'bg-[#FF2E51]/15 text-[#FF2E51] font-semibold border border-[#FF2E51]/30' : 'text-[#6B7280]'
                }`}
              >
                ±10 Strikes
              </button>
              <button
                onClick={() => setStrikeRange('all')}
                className={`px-2.5 py-0.5 rounded-[3px] transition-colors ${
                  strikeRange === 'all' ? 'bg-[#FF2E51]/15 text-[#FF2E51] font-semibold border border-[#FF2E51]/30' : 'text-[#6B7280]'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Clean, readable option chain table */}
        <div className="fin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="fin-table text-center">
              <thead>
                <tr>
                  <th colSpan={5} className="text-center text-[#FF2E51] bg-[#FF2E51]/[0.05] border-r border-[#241117]">
                    CALLS (CE)
                  </th>
                  <th className="text-center text-[#F3F4F6] bg-[#130B10]">STRIKE</th>
                  <th colSpan={5} className="text-center text-[#10B981] bg-[#10B981]/[0.05] border-l border-[#241117]">
                    PUTS (PE)
                  </th>
                </tr>
                <tr>
                  {/* Calls columns */}
                  <th className="text-right">OI</th>
                  <th className="text-right">CHG OI</th>
                  <th className="text-right">IV</th>
                  <th className="text-right">LTP (₹)</th>
                  <th className="text-right border-r border-[#241117]">CHG</th>

                  {/* Strike center */}
                  <th className="text-center bg-[#130B10] text-[#FF2E51]">PRICE</th>

                  {/* Puts columns */}
                  <th className="text-left border-l border-[#241117]">CHG</th>
                  <th className="text-left">LTP (₹)</th>
                  <th className="text-left">IV</th>
                  <th className="text-left">CHG OI</th>
                  <th className="text-left">OI</th>
                </tr>
              </thead>
              <tbody>
                {displayedStrikes.map((s) => {
                  const isHighCallOi = s.callOi >= maxCallOi * 0.9;
                  const isHighPutOi = s.putOi >= maxPutOi * 0.9;

                  return (
                    <tr
                      key={s.strikePrice}
                      className={s.isAtm ? 'bg-[#FF2E51]/[0.08] font-semibold' : ''}
                    >
                      {/* Call OI */}
                      <td className={`text-right font-mono text-xs ${isHighCallOi ? 'text-[#FF2E51] font-bold' : 'text-[#9CA3AF]'}`}>
                        {formatVolume(s.callOi)}
                      </td>
                      <td className="text-right font-mono text-xs">
                        <MetricValue value={s.callOiChange} type="points" className="text-[11px]" />
                      </td>
                      <td className="text-right font-mono text-xs text-[#6B7280]">
                        {s.callIv.toFixed(1)}%
                      </td>
                      <td className="text-right font-mono text-xs font-semibold text-[#F3F4F6]">
                        {s.callLtp.toFixed(2)}
                      </td>
                      <td className="text-right font-mono text-xs border-r border-[#241117]">
                        <MetricValue value={s.callChange} type="points" className="text-[11px]" />
                      </td>

                      {/* Center Strike */}
                      <td className={`text-center font-mono text-xs ${
                        s.isAtm
                          ? 'text-[#FF2E51] font-bold bg-[#FF2E51]/15'
                          : 'text-[#F3F4F6] bg-[#0C070A]'
                      }`}>
                        {s.strikePrice}
                        {s.isAtm && <span className="ml-1 text-[9px] text-[#FF2E51]">ATM</span>}
                      </td>

                      {/* Put Change */}
                      <td className="text-left font-mono text-xs border-l border-white/[0.08]">
                        <MetricValue value={s.putChange} type="points" className="text-[11px]" />
                      </td>
                      <td className="text-left font-mono text-xs font-semibold text-[#F3F4F6]">
                        {s.putLtp.toFixed(2)}
                      </td>
                      <td className="text-left font-mono text-xs text-[#6B7280]">
                        {s.putIv.toFixed(1)}%
                      </td>
                      <td className="text-left font-mono text-xs">
                        <MetricValue value={s.putOiChange} type="points" className="text-[11px]" />
                      </td>
                      {/* Put OI */}
                      <td className={`text-left font-mono text-xs ${isHighPutOi ? 'text-[#00F59B] font-bold' : 'text-[#9CA3AF]'}`}>
                        {formatVolume(s.putOi)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. F&O BUILD-UP DYNAMICS */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          PARTICIPATION BUILD-UP DYNAMICS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {['Long Build-up', 'Short Build-up', 'Short Covering', 'Long Unwinding'].map((type) => {
            const matches = buildUps.filter((b) => b.type === type);
            const color =
              type === 'Long Build-up' ? 'text-[#00F59B]' : type === 'Short Build-up' ? 'text-[#F43F5E]' : 'text-[#38BDF8]';

            return (
              <div key={type} className="fin-card p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>
                    {type}
                  </span>
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    {matches.length} stocks
                  </span>
                </div>
                <div className="space-y-2">
                  {matches.map((item) => (
                    <div key={item.symbol} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-[#F3F4F6]">{item.symbol}</span>
                      <div className="text-right">
                        <MetricValue value={item.priceChange} type="percent" className="text-xs" />
                        <span className="text-[10px] text-[#6B7280] block">OI: +{item.oiChange}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
