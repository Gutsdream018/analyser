'use client';

import React, { useState } from 'react';

interface StockChartProps {
  candles: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  symbol: string;
}

export function StockChart({ candles, symbol }: StockChartProps) {
  const [range, setRange] = useState<'1D' | '5D' | '1M' | '6M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candle'>('area');

  if (!candles || candles.length === 0) {
    return <div className="h-64 flex items-center justify-center text-xs text-[#868C97]">Loading chart data...</div>;
  }

  const prices = candles.map((c) => c.close);
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const isPositive = candles[candles.length - 1].close >= candles[0].open;
  const strokeColor = isPositive ? '#00F59B' : '#F43F5E';

  const chartHeight = 220;
  const chartWidth = 700;

  // Generate SVG path for area/line
  const points = candles.map((c, i) => {
    const x = (i / (candles.length - 1)) * (chartWidth - 20) + 10;
    const y = chartHeight - 20 - ((c.close - minPrice) / priceRange) * (chartHeight - 40);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${chartWidth - 10},${chartHeight} L 10,${chartHeight} Z`;

  return (
    <div className="terminal-panel p-3.5 space-y-3">
      {/* Chart Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#23262C] pb-2.5">
        <div className="flex items-center gap-1">
          {(['1D', '5D', '1M', '6M', '1Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-0.5 text-xs font-mono rounded-[3px] transition-colors ${
                range === r
                  ? 'bg-[#00F59B] text-black font-bold shadow-[0_0_8px_rgba(0,245,155,0.4)]'
                  : 'text-[#868C97] hover:text-[#E7E9EC]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType(chartType === 'area' ? 'candle' : 'area')}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161920] border border-[#23262C] text-[#868C97] hover:text-[#E7E9EC]"
          >
            {chartType === 'area' ? 'Line View' : 'Candle Bars'}
          </button>
          <span className="text-[10px] font-mono text-[#868C97]">NSE INTRADAY</span>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full h-[220px] select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={chartHeight / 4} x2={chartWidth} y2={chartHeight / 4} stroke="#23262C" strokeDasharray="3 3" />
          <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#23262C" strokeDasharray="3 3" />
          <line x1="0" y1={(chartHeight * 3) / 4} x2={chartWidth} y2={(chartHeight * 3) / 4} stroke="#23262C" strokeDasharray="3 3" />

          {chartType === 'area' ? (
            <>
              <path d={areaPath} fill={`url(#grad-${symbol})`} />
              <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            // Candlestick visual bars
            candles.map((c, i) => {
              const x = (i / (candles.length - 1)) * (chartWidth - 20) + 10;
              const yOpen = chartHeight - 20 - ((c.open - minPrice) / priceRange) * (chartHeight - 40);
              const yClose = chartHeight - 20 - ((c.close - minPrice) / priceRange) * (chartHeight - 40);
              const yHigh = chartHeight - 20 - ((c.high - minPrice) / priceRange) * (chartHeight - 40);
              const yLow = chartHeight - 20 - ((c.low - minPrice) / priceRange) * (chartHeight - 40);
              const isUp = c.close >= c.open;
              const barColor = isUp ? '#00F59B' : '#F43F5E';

              return (
                <g key={i}>
                  {/* High-Low Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={barColor} strokeWidth={1} />
                  {/* Body */}
                  <rect
                    x={x - 4}
                    y={Math.min(yOpen, yClose)}
                    width={8}
                    height={Math.max(Math.abs(yClose - yOpen), 2)}
                    fill={barColor}
                    rx={1}
                  />
                </g>
              );
            })
          )}
        </svg>

        {/* Price scale annotations */}
        <div className="absolute right-1 top-2 text-[10px] font-mono text-[#868C97]">
          ₹{maxPrice.toFixed(2)}
        </div>
        <div className="absolute right-1 bottom-2 text-[10px] font-mono text-[#868C97]">
          ₹{minPrice.toFixed(2)}
        </div>
      </div>

      {/* Volume Summary */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#868C97] pt-2 border-t border-[#23262C]">
        <span>Open: ₹{candles[0].open.toFixed(2)}</span>
        <span>High: ₹{maxPrice.toFixed(2)}</span>
        <span>Low: ₹{minPrice.toFixed(2)}</span>
        <span>Close: ₹{candles[candles.length - 1].close.toFixed(2)}</span>
      </div>
    </div>
  );
}
