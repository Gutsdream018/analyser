'use client';

import React, { useState, useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { ResponsiveContainer, ComposedChart, Area, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Maximize2, Minimize2, BarChart2, Layers } from 'lucide-react';

const TIMEFRAMES = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'ALL'];
const INDICATORS = ['SMA', 'EMA', 'RSI', 'MACD', 'BB'];

export function NiftyChartWidget() {
  const { indices, fetchCandles } = useMarketStore();
  const [selectedTf, setSelectedTf] = useState('1D');
  const [chartType, setChartType] = useState<'area' | 'candle'>('area');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['SMA']);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [candles, setCandles] = useState<{ time: string; open: number; high: number; low: number; close: number; volume: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nifty = indices.find((i) => i.symbol === 'NIFTY 50') || indices[0] || {
    symbol: 'NIFTY 50',
    current: 23140.50,
    change: 77.40,
    percentChange: 0.34,
  };

  useEffect(() => {
    let isMounted = true;
    async function loadCandles() {
      setLoading(true);
      const data = await fetchCandles('NIFTY', selectedTf);
      if (isMounted) {
        setCandles(data);
        setLoading(false);
      }
    }
    loadCandles();
    return () => {
      isMounted = false;
    };
  }, [selectedTf, fetchCandles]);

  const toggleIndicator = (ind: string) => {
    setActiveIndicators((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const isPos = nifty.change >= 0;
  const strokeColor = isPos ? '#00F59B' : '#F43F5E';
  const fillColor = isPos ? 'rgba(0, 245, 155, 0.15)' : 'rgba(244, 63, 94, 0.15)';

  const chartContent = (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#202A38]/60 text-xs">
        {/* Symbol Price Display */}
        <div className="flex items-baseline gap-3">
          <span className="text-xl font-bold font-mono text-[#F9FAFB] tabular-nums">
            {nifty.current.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span
            className={`font-mono text-xs font-semibold tabular-nums ${
              isPos ? 'text-[#00F59B]' : 'text-[#F43F5E]'
            }`}
          >
            {isPos ? '+' : ''}{nifty.change.toFixed(2)} ({isPos ? '+' : ''}{nifty.percentChange.toFixed(2)}%)
          </span>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-[#111925] p-0.5 rounded border border-[#202A38]">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTf(tf)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                selectedTf === tf
                  ? 'bg-[#00F59B] text-black font-bold shadow-[0_0_8px_rgba(0,245,155,0.4)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Options */}
        <div className="flex items-center gap-1.5">
          {/* Indicator toggles */}
          <div className="flex items-center gap-1 bg-[#111925] p-0.5 rounded border border-[#202A38]">
            {INDICATORS.map((ind) => (
              <button
                key={ind}
                onClick={() => toggleIndicator(ind)}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                  activeIndicators.includes(ind)
                    ? 'bg-white/[0.12] text-[#F9FAFB] font-semibold'
                    : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>

          {/* Fullscreen Button */}
          <button
            title="Toggle fullscreen chart"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded bg-[#111925] text-[#94A3B8] hover:text-white border border-[#202A38]"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className={`relative w-full ${isFullscreen ? 'h-[75vh]' : 'h-64 sm:h-72'}`}>
        {loading && (
          <div className="absolute inset-0 bg-[#0D131D]/60 flex items-center justify-center z-10">
            <span className="text-xs font-mono text-[#94A3B8] animate-pulse">Loading Chart Feed...</span>
          </div>
        )}

        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={candles} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="niftyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#202A38' }}
              />
              <YAxis
                domain={['auto', 'auto']}
                orientation="right"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#202A38' }}
                tickFormatter={(v: number) => Math.round(v).toString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111925',
                  borderColor: '#202A38',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#F9FAFB',
                }}
                formatter={(val: number) => [`₹${val?.toFixed(2)}`, 'Level']}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={strokeColor}
                strokeWidth={1.75}
                fill="url(#niftyGradient)"
                isAnimationActive={false}
              />
              <Bar dataKey="volume" yAxisId="volumeAxis" fill="rgba(255, 255, 255, 0.05)" />
              <YAxis yAxisId="volumeAxis" hide domain={[0, 'dataMax * 4']} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#111925]/30 rounded">
            <span className="text-xs font-mono text-slate-500">Initializing Chart Engine...</span>
          </div>
        )}
      </div>

      {/* Footer / Active Indicator Legends */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1 border-t border-[#202A38]/40">
        <div className="flex items-center gap-3">
          <span>Active: {activeIndicators.join(', ') || 'Price Action'}</span>
          {activeIndicators.includes('SMA') && <span className="text-[#00F59B]">SMA(20): Bullish</span>}
          {activeIndicators.includes('RSI') && <span className="text-[#38BDF8]">RSI(14): 54.2</span>}
        </div>
        <span>Volume Avg: 1.2x 20D</span>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#070B12]/95 backdrop-blur-md p-6 flex flex-col justify-center">
        <div className="max-w-6xl w-full mx-auto bg-[#0D131D] border border-[#202A38] rounded-xl p-6 shadow-2xl">
          {chartContent}
        </div>
      </div>
    );
  }

  return chartContent;
}
