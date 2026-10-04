'use client';

import React from 'react';
import { GlobalMarket, CommodityOrCurrency } from '@/types/market';
import { MetricValue } from '@/components/common/metric-value';

interface GlobalStripProps {
  globals: GlobalMarket[];
  commodities: CommodityOrCurrency[];
}

export function GlobalStrip({ globals, commodities }: GlobalStripProps) {
  // Select items matching spec: S&P 500, NASDAQ, DOW, CRUDE, GOLD, USD/INR
  const usIndices = globals.filter((g) =>
    ['S&P 500', 'NASDAQ', 'DOW JONES'].includes(g.symbol)
  );
  const crude = commodities.find((c) => c.symbol === 'BRENT') || {
    symbol: 'CRUDE',
    name: 'Brent Crude',
    value: 71.85,
    percentChange: -1.7,
    unit: '$/bbl',
  };
  const gold = commodities.find((c) => c.symbol === 'GOLD') || {
    symbol: 'GOLD',
    name: 'Gold',
    value: 75620,
    percentChange: 0.32,
    unit: '₹/10g',
  };
  const usdinr = commodities.find((c) => c.symbol === 'USD/INR') || {
    symbol: 'USD/INR',
    name: 'USD/INR',
    value: 83.68,
    percentChange: -0.07,
    unit: 'INR',
  };

  const stripItems = [
    ...usIndices.map((i) => ({
      name: i.symbol === 'DOW JONES' ? 'DOW' : i.symbol,
      value: i.value.toLocaleString('en-IN', { maximumFractionDigits: 1 }),
      change: i.percentChange,
    })),
    {
      name: 'DXY',
      value: '100.82',
      change: -0.15,
    },
    {
      name: 'CRUDE',
      value: `$${crude.value}`,
      change: crude.percentChange,
    },
    {
      name: 'GOLD',
      value: `₹${(gold.value / 1000).toFixed(1)}k`,
      change: gold.percentChange,
    },
    {
      name: 'USD/INR',
      value: `${usdinr.value}`,
      change: usdinr.percentChange,
    },
  ];

  return (
    <div className="py-2.5 px-4 rounded-[4px] bg-[#0C070A] border border-[#241117] overflow-x-auto shadow-sm hover:border-[#FF2E51]/45 transition-colors">
      <div className="flex items-center gap-6 text-xs whitespace-nowrap min-w-max">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E51] animate-pulse shadow-[0_0_8px_#FF2E51]" />
          GLOBAL MACRO TELEMETRY
        </span>

        {stripItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 font-mono">
            <span className="text-[#94A3B8] font-medium">{item.name}</span>
            <span className="text-[#F8FAFC] font-semibold">{item.value}</span>
            <MetricValue value={item.change} type="percent" className="text-[11px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
