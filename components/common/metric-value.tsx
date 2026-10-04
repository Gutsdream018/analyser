import React from 'react';
import { formatRupees } from '@/lib/formatters/currency';
import { formatPercent, formatIndexPoints } from '@/lib/formatters/numbers';

interface MetricValueProps {
  value: number;
  type?: 'currency' | 'percent' | 'points' | 'number';
  direction?: 'auto' | 'pos' | 'neg' | 'neutral';
  prefix?: string;
  suffix?: string;
  className?: string;
  showSign?: boolean;
}

export function MetricValue({
  value,
  type = 'number',
  direction = 'auto',
  prefix = '',
  suffix = '',
  className = '',
  showSign = true,
}: MetricValueProps) {
  let color = 'text-[#F3F4F6]';

  if (direction === 'auto') {
    if (value > 0) color = 'text-[#00F59B]';
    else if (value < 0) color = 'text-[#F43F5E]';
    else color = 'text-[#94A3B8]';
  } else if (direction === 'pos') {
    color = 'text-[#00F59B]';
  } else if (direction === 'neg') {
    color = 'text-[#F43F5E]';
  } else if (direction === 'neutral') {
    color = 'text-[#F8FAFC]';
  }

  let formatted = '';
  if (type === 'currency') {
    formatted = formatRupees(value);
  } else if (type === 'percent') {
    formatted = formatPercent(value, showSign);
  } else if (type === 'points') {
    formatted = `${showSign && value > 0 ? '+' : ''}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    formatted = `${showSign && value > 0 ? '+' : ''}${value.toLocaleString('en-IN')}`;
  }

  return (
    <span className={`font-mono tabular-nums font-medium ${color} ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
