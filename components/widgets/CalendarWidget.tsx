'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';

export function CalendarWidget() {
  const events = [
    {
      date: 'Today',
      time: '17:30',
      event: 'RBI Foreign Exchange Reserves Data',
      impact: 'MEDIUM',
      country: 'IN',
    },
    {
      date: 'Tomorrow',
      time: '11:00',
      event: 'India Balance of Trade & Current Account',
      impact: 'HIGH',
      country: 'IN',
    },
    {
      date: 'Oct 02',
      time: 'ALL DAY',
      event: 'Mahatma Gandhi Jayanti (NSE/BSE Closed)',
      impact: 'LOW',
      country: 'IN',
    },
    {
      date: 'Oct 04',
      time: '18:00',
      event: 'US Non-Farm Payrolls & Unemployment Rate',
      impact: 'HIGH',
      country: 'US',
    },
  ];

  return (
    <div className="flex flex-col h-full justify-between space-y-2">
      <div className="space-y-1.5 overflow-y-auto max-h-[190px] pr-1">
        {events.map((ev, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 rounded bg-[#111925]/60 border border-border/50 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <div className="text-center font-mono shrink-0 bg-[#0D131D] px-2 py-1 rounded border border-border/70">
                <div className="text-[10px] text-slate-400 font-semibold">{ev.date}</div>
                <div className="text-[9px] text-slate-500">{ev.time}</div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-200 line-clamp-1">{ev.event}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>Region: {ev.country}</span>
                  <span>•</span>
                  <span
                    className={
                      ev.impact === 'HIGH'
                        ? 'text-rose-400 font-semibold'
                        : ev.impact === 'MEDIUM'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }
                  >
                    {ev.impact} IMPACT
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-border/50">
        <Link href="/calendar" className="text-rose-400 hover:text-rose-300 font-medium">
          Open Full Economic Calendar →
        </Link>
        <span>IST Timings</span>
      </div>
    </div>
  );
}
