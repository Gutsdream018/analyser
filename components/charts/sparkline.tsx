'use client';

import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  width = 96,
  height = 24,
  positive,
  strokeWidth = 1.5,
  className = '',
}: SparklineProps) {
  const reactId = React.useId();

  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="bg-white/[0.04] rounded-[2px]" />;
  }

  const isPos = positive !== undefined ? positive : data[data.length - 1] >= data[0];
  const strokeColor = isPos ? '#00F59B' : '#FF2E51';

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const effectiveHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 4) + 2;
    const y = height - padding - ((val - min) / range) * effectiveHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${(width - 2).toFixed(1)},${height} L 2,${height} Z`;

  const gradientId = `spark-grad-${reactId.replace(/:/g, '')}`;

  return (
    <svg
      width={width}
      height={height}
      className={`overflow-visible select-none shrink-0 ${className}`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
