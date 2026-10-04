'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Clock, Activity, User } from 'lucide-react';
import { CommandPalette } from './command-palette';
import { isMarketOpen } from '@/lib/formatters/date';

export function Topbar() {
  const [timeStr, setTimeStr] = useState<string>('');
  const [marketActive, setMarketActive] = useState<boolean>(false);
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
      setMarketActive(isMarketOpen());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 h-14 w-full bg-[#030407]/95 backdrop-blur-md border-b border-[#241117] px-4 lg:px-6 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-[4px] bg-[#FF2E51] shadow-[0_0_12px_rgba(255,46,81,0.5)] flex items-center justify-center font-mono font-black text-xs text-white">
              M
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-sm tracking-tight text-[#F3F4F6]">
                MARKET<span className="text-[#FF2E51] tracking-wider">PULSE</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#FF2E51] px-1.5 py-0.5 rounded bg-[#FF2E51]/10 border border-[#FF2E51]/30 uppercase">
                INSTITUTIONAL
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Clean Global Search Input (⌘K) */}
        <div className="flex-1 max-w-lg mx-6 hidden md:block">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-[#9CA3AF] bg-[#0C070A] hover:bg-[#130B10] border border-[#241117] hover:border-[#FF2E51]/45 rounded-[4px] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="font-sans text-[13px] text-[#6B7280]">
                Search NIFTY, BANKNIFTY, RELIANCE, TCS...
              </span>
            </div>
            <kbd className="font-mono text-[10px] text-[#9CA3AF] bg-[#030407] border border-[#241117] px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Market Status, Time, Alerts, Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Market Status & Time */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#0C070A] border border-[#241117] text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                marketActive ? 'bg-[#FF2E51] shadow-[0_0_8px_#FF2E51]' : 'bg-[#64748B]'
              }`}
            />
            <span className="text-[11px] font-medium text-[#9CA3AF]">
              {marketActive ? 'Market Live' : 'Market Closed'}
            </span>
            <span className="text-white/[0.2]">•</span>
            <span className="text-[11px] font-mono text-[#FF2E51]">
              {timeStr || '15:30 IST'}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#241117]" />

          {/* Notifications / Alerts Link */}
          <Link
            href="/alerts"
            className="p-1.5 rounded-[4px] text-[#9CA3AF] hover:text-[#FF2E51] hover:bg-white/[0.05] transition-colors relative"
            title="Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF2E51] rounded-full shadow-[0_0_6px_#FF2E51]" />
          </Link>

          {/* Profile / Settings */}
          <Link
            href="/settings"
            className="flex items-center gap-2 p-1 rounded-[4px] hover:bg-white/[0.05] transition-colors"
            title="Account Settings"
          >
            <div className="w-7 h-7 rounded-full bg-[#0C070A] border border-[#241117] flex items-center justify-center text-xs font-semibold text-[#FF2E51]">
              P
            </div>
          </Link>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
