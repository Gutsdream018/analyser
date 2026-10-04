'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCalendarEvents } from '@/lib/api/calendar';
import { CalendarEvent } from '@/types/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  useEffect(() => {
    async function loadEvents() {
      const data = await getCalendarEvents();
      setEvents(data);
    }
    loadEvents();
  }, []);

  const categories = ['All', 'Earnings', 'Macro/RBI', 'AGM'];

  const filteredEvents =
    selectedFilter === 'All'
      ? events
      : events.filter((e) => e.category.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Corporate Actions &amp; Macro Agenda
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Quarterly earnings releases, dividend ex-dates, board meetings, and RBI policy decisions
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#141720] p-1 rounded-[5px] border border-white/[0.08]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-[3px] transition-colors ${
                selectedFilter === cat
                  ? 'bg-white/[0.12] text-[#F3F4F6] font-semibold'
                  : 'text-[#6B7280] hover:text-[#9CA3AF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Agenda List */}
      <div className="fin-card divide-y divide-white/[0.05] overflow-hidden">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-[4px] bg-[#080C14] border border-[#162030] text-center min-w-[76px] shrink-0">
                <span className="font-mono text-xs font-bold text-[#00F59B] block">
                  {evt.date.split(' ')[0]} {evt.date.split(' ')[1]}
                </span>
                <span className="font-mono text-[10px] text-[#6B7280] block mt-0.5">
                  {evt.date.split(' ')[2]}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-semibold text-[#F3F4F6] font-sans">{evt.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#9CA3AF]">
                    {evt.category}
                  </span>
                  {evt.symbol && (
                    <Link
                      href={`/stocks/${evt.symbol}`}
                      className="text-[11px] font-mono font-semibold text-[#00F59B] hover:underline"
                    >
                      {evt.symbol}
                    </Link>
                  )}
                </div>
                <p className="text-xs text-[#9CA3AF] font-sans">{evt.details}</p>
              </div>
            </div>

            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded shrink-0 self-start sm:self-center ${
              evt.impact === 'High' ? 'bg-[#F43F5E]/10 text-[#F43F5E]' : 'bg-white/[0.04] text-[#6B7280]'
            }`}>
              {evt.impact} Impact
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
