'use client';

import React from 'react';
import { useMarketStore } from '@/store/marketStore';

export function MarketSentimentWidget() {
  const { breadth } = useMarketStore();

  const advances = breadth?.advances ?? 1842;
  const declines = breadth?.declines ?? 824;
  const total = advances + declines || 1;
  const advancePct = Math.round((advances / total) * 100);

  // Score between 0 and 100 based on advance percentage
  const sentimentScore = Math.min(95, Math.max(15, advancePct));
  const sentimentLabel =
    sentimentScore >= 60 ? 'BULLISH' : sentimentScore <= 40 ? 'BEARISH' : 'NEUTRAL';
  const labelColor =
    sentimentScore >= 60 ? 'text-[#00F59B]' : sentimentScore <= 40 ? 'text-[#F43F5E]' : 'text-[#38BDF8]';

  // SVG Semicircle Arc calculation (radius 55, center 75,70)
  // angle from 180 to 0 degrees:
  // circumference of semicircle = PI * 55 ≈ 172.78
  const radius = 55;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (arcLength * sentimentScore) / 100;

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-4 py-1">
      {/* Semicircle Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center">
        <svg width="160" height="95" viewBox="0 0 160 95" className="overflow-visible">
          {/* Background Track */}
          <path
            d="M 25 80 A 55 55 0 0 1 135 80"
            fill="none"
            stroke="#162030"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Active Gradient Arc */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#00F59B" />
            </linearGradient>
          </defs>
          <path
            d="M 25 80 A 55 55 0 0 1 135 80"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score & Label */}
        <div className="absolute top-10 flex flex-col items-center">
          <span className="text-3xl font-extrabold font-mono text-[#F9FAFB] tracking-tight">
            {sentimentScore}
          </span>
          <span className={`text-[11px] font-mono font-bold tracking-widest mt-0.5 ${labelColor}`}>
            {sentimentLabel}
          </span>
        </div>
      </div>

      {/* Advancing vs Declining Split */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-semibold">
          <div className="flex items-center gap-1.5 text-[#00F59B]">
            <span className="w-2 h-2 rounded-full bg-[#00F59B] shadow-[0_0_6px_#00F59B]" />
            <span>{advances.toLocaleString()} Advancing</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#F43F5E]">
            <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
            <span>{declines.toLocaleString()} Declining</span>
          </div>
        </div>

        {/* Proportional Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[#162030] overflow-hidden flex">
          <div
            style={{ width: `${advancePct}%` }}
            className="h-full bg-[#00F59B] shadow-[0_0_8px_rgba(0,245,155,0.4)] transition-all duration-500"
          />
          <div
            style={{ width: `${100 - advancePct}%` }}
            className="h-full bg-[#F43F5E] transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
}
