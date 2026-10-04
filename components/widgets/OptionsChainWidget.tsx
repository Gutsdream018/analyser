'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export function OptionsChainWidget() {
  const [symbol, setSymbol] = useState<'NIFTY' | 'BANKNIFTY'>('NIFTY');

  const spot = symbol === 'NIFTY' ? 23140.5 : 55580.4;
  const atm = symbol === 'NIFTY' ? 23150 : 55600;

  const strikes = symbol === 'NIFTY'
    ? [
        { strike: 22950, callOi: '24.1L', callLtp: 242.0, putLtp: 48.5, putOi: '88.3L' },
        { strike: 23000, callOi: '38.5L', callLtp: 198.5, putLtp: 59.2, putOi: '102.5L' },
        { strike: 23050, callOi: '45.2L', callLtp: 159.0, putLtp: 72.8, putOi: '74.2L' },
        { strike: 23100, callOi: '62.8L', callLtp: 124.5, putLtp: 89.0, putOi: '68.9L' },
        { strike: 23150, callOi: '89.4L', callLtp: 94.0, putLtp: 110.5, putOi: '55.3L', isAtm: true },
        { strike: 23200, callOi: '112.5L', callLtp: 69.5, putLtp: 136.0, putOi: '42.1L' },
        { strike: 23250, callOi: '95.1L', callLtp: 49.0, putLtp: 167.2, putOi: '28.4L' },
        { strike: 23300, callOi: '135.2L', callLtp: 33.5, putLtp: 204.0, putOi: '19.8L' },
      ]
    : [
        { strike: 55200, callOi: '14.2L', callLtp: 580.0, putLtp: 142.5, putOi: '32.1L' },
        { strike: 55400, callOi: '22.8L', callLtp: 420.5, putLtp: 185.0, putOi: '45.8L' },
        { strike: 55600, callOi: '38.4L', callLtp: 295.0, putLtp: 248.0, putOi: '41.2L', isAtm: true },
        { strike: 55800, callOi: '52.1L', callLtp: 195.0, putLtp: 340.5, putOi: '28.9L' },
        { strike: 56000, callOi: '74.6L', callLtp: 122.5, putLtp: 460.0, putOi: '18.4L' },
      ];

  return (
    <div className="flex flex-col h-full justify-between space-y-2">
      {/* Control bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#111925] border border-border/70 rounded p-0.5 text-xs">
            {(['NIFTY', 'BANKNIFTY'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSymbol(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  symbol === s
                    ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Spot: <span className="text-white font-semibold">{spot.toLocaleString('en-IN')}</span>
          </span>
        </div>

        <Link
          href={`/fno?symbol=${symbol}`}
          className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors"
        >
          <span>Full Matrix</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Mini Options Chain Grid */}
      <div className="overflow-x-auto rounded border border-border/60 bg-[#111925]/50">
        <table className="w-full text-[11px] font-mono border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-[#111925] text-slate-400 text-[10px]">
              <th className="py-1 px-2 text-left text-rose-400">CALL OI</th>
              <th className="py-1 px-2 text-right text-rose-400">CALL LTP</th>
              <th className="py-1 px-3 text-center bg-[#162030] text-white">STRIKE</th>
              <th className="py-1 px-2 text-left text-emerald-400">PUT LTP</th>
              <th className="py-1 px-2 text-right text-emerald-400">PUT OI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {strikes.map((row) => (
              <tr
                key={row.strike}
                className={`transition-colors ${
                  row.isAtm
                    ? 'bg-amber-500/10 font-bold border-y border-amber-500/40'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <td className="py-1 px-2 text-left text-slate-300">{row.callOi}</td>
                <td className="py-1 px-2 text-right font-medium text-rose-300">
                  ₹{row.callLtp.toFixed(1)}
                </td>
                <td
                  className={`py-1 px-3 text-center ${
                    row.isAtm
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'bg-[#141d2b] text-white font-semibold'
                  }`}
                >
                  {row.strike}
                  {row.isAtm && <span className="ml-1 text-[9px] text-amber-400">ATM</span>}
                </td>
                <td className="py-1 px-2 text-left font-medium text-emerald-300">
                  ₹{row.putLtp.toFixed(1)}
                </td>
                <td className="py-1 px-2 text-right text-slate-300">{row.putOi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Current Expiry</span>
        <span>Lot Size: {symbol === 'NIFTY' ? '25' : '15'}</span>
      </div>
    </div>
  );
}
