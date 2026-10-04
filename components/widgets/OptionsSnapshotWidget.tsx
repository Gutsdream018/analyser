'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, TrendingDown, TrendingUp } from 'lucide-react';
import { useMarketStore } from '@/store/marketStore';

type Underlying = 'NIFTY' | 'BANKNIFTY';

export function OptionsSnapshotWidget() {
  const { fnoSnapshot } = useMarketStore();
  const [underlying, setUnderlying] = useState<Underlying>('NIFTY');

  const data = underlying === 'NIFTY'
    ? {
        spot: fnoSnapshot?.niftySpot ?? 23140.5,
        pcr: fnoSnapshot?.niftyPcr ?? 0.92,
        maxPain: fnoSnapshot?.niftyMaxPain ?? 24600,
        callOi: '1.42 Cr',
        putOi: '1.55 Cr',
        sentiment: (fnoSnapshot?.niftyPcr ?? 0.92) >= 1 ? 'Bullish' : 'Neutral / Rangebound',
        callOiChange: '+18.4L',
        putOiChange: '+24.1L',
        highestCallStrike: 24500,
        highestPutStrike: 23000,
      }
    : {
        spot: fnoSnapshot?.bankNiftySpot ?? 55580.4,
        pcr: fnoSnapshot?.bankNiftyPcr ?? 0.84,
        maxPain: fnoSnapshot?.bankNiftyMaxPain ?? 55000,
        callOi: '98.4 L',
        putOi: '82.6 L',
        sentiment: (fnoSnapshot?.bankNiftyPcr ?? 0.84) >= 1 ? 'Bullish' : 'Neutral / Rangebound',
        callOiChange: '+12.1L',
        putOiChange: '+9.4L',
        highestCallStrike: 56000,
        highestPutStrike: 54500,
      };

  return (
    <div className="flex flex-col h-full justify-between space-y-3">
      {/* Header selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#111925] border border-border/70 rounded p-0.5 text-xs">
          {(['NIFTY', 'BANKNIFTY'] as Underlying[]).map((sym) => (
            <button
              key={sym}
              onClick={() => setUnderlying(sym)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                underlying === sym
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>

        <Link
          href={`/fno?symbol=${underlying}`}
          className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors"
        >
          <span>Open Option Chain</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Snapshot Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#111925] border border-border/60 rounded p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">PUT / CALL RATIO (PCR)</span>
            <span className="text-[10px] text-emerald-400 font-medium">{data.sentiment}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white">{data.pcr}</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {data.pcr > 1 ? 'Bullish bias' : 'Bearish / Neutral'}
            </span>
          </div>
        </div>

        <div className="bg-[#111925] border border-border/60 rounded p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">MAX PAIN STRIKE</span>
            <span className="text-[10px] text-slate-400 font-mono">Expiry T-Thu</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white">
              {data.maxPain.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Diff: {(data.spot - data.maxPain).toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* OI Distribution Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#111925]/70 border border-rose-500/20 rounded p-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>TOTAL CALL OI</span>
            <span className="text-rose-400 font-mono">{data.callOiChange}</span>
          </div>
          <div className="text-base font-bold font-mono text-rose-300">{data.callOi}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Key Wall: {data.highestCallStrike}
          </div>
        </div>

        <div className="bg-[#111925]/70 border border-emerald-500/20 rounded p-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>TOTAL PUT OI</span>
            <span className="text-emerald-400 font-mono">{data.putOiChange}</span>
          </div>
          <div className="text-base font-bold font-mono text-emerald-300">{data.putOi}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Key Support: {data.highestPutStrike}
          </div>
        </div>
      </div>

      {/* OI Visual Bar Balance */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Call Dominance (Resistance)</span>
          <span>Put Dominance (Support)</span>
        </div>
        <div className="w-full h-1.5 bg-[#111925] rounded-full overflow-hidden flex">
          <div className="bg-rose-500 h-full" style={{ width: '48%' }} />
          <div className="bg-emerald-500 h-full" style={{ width: '52%' }} />
        </div>
      </div>
    </div>
  );
}
