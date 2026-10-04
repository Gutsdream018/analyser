'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, Plus, AlertTriangle } from 'lucide-react';

export function AlertsWidget() {
  const [alerts, setAlerts] = useState([
    { id: '1', symbol: 'NIFTY 50', condition: 'Crosses Above 23,200', status: 'ACTIVE', trigger: 'Pending' },
    { id: '2', symbol: 'RELIANCE', condition: 'RSI(14) > 70 (Overbought)', status: 'ACTIVE', trigger: 'Pending' },
    { id: '3', symbol: 'HDFCBANK', condition: 'Crosses 1,650 (52W High Test)', status: 'TRIGGERED', trigger: '14:22' },
    { id: '4', symbol: 'INDIA VIX', condition: 'Spikes > 15.0', status: 'ACTIVE', trigger: 'Pending' },
  ]);

  return (
    <div className="flex flex-col h-full justify-between space-y-2">
      {/* Alert items */}
      <div className="space-y-1.5 overflow-y-auto max-h-[190px] pr-1">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="flex items-center justify-between p-2 rounded bg-[#111925]/60 border border-border/50 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start gap-2">
              {alt.status === 'TRIGGERED' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <Bell className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">{alt.symbol}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      alt.status === 'TRIGGERED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {alt.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans mt-0.5">
                  {alt.condition}
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-400 shrink-0 text-right">
              {alt.trigger}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-border/50">
        <Link href="/alerts" className="text-rose-400 hover:text-rose-300 font-medium">
          + Manage All Alerts
        </Link>
        <span>Instant Notifications</span>
      </div>
    </div>
  );
}
