import React from 'react';
import { StockDetails } from '@/types/stock';
import { TerminalCard } from '@/components/common/terminal-card';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricValue } from '@/components/common/metric-value';
import Link from 'next/link';

interface DashboardWatchlistProps {
  stocks: StockDetails[];
}

export function DashboardWatchlist({ stocks }: DashboardWatchlistProps) {
  return (
    <TerminalCard
      title="Personal Watchlist"
      subtitle="Core Portfolio"
      action={
        <Link href="/watchlist" className="text-[11px] font-mono text-[#868C97] hover:text-[#00F59B] transition-colors">
          Manage Lists →
        </Link>
      }
    >
      <div className="space-y-2">
        {stocks.slice(0, 5).map((stock) => {
          const isPos = stock.change >= 0;
          return (
            <Link
              key={stock.symbol}
              href={`/stocks/${stock.symbol}`}
              className="flex items-center justify-between p-2 rounded-[3px] bg-[#080C14] hover:bg-[#0D131F] border border-[#162030] hover:border-[#00F59B]/40 transition-colors group"
            >
              <div className="min-w-0">
                <span className="font-mono text-xs font-semibold text-[#E7E9EC] group-hover:text-[#00F59B] transition-colors">
                  {stock.symbol}
                </span>
                <span className="text-[10px] text-[#868C97] block truncate max-w-[120px]">
                  {stock.name}
                </span>
              </div>

              <div className="hidden sm:block">
                <Sparkline data={stock.sparkline} width={50} height={16} positive={isPos} />
              </div>

              <div className="text-right">
                <span className="font-mono text-xs text-[#E7E9EC] block tabular-nums">
                  ₹{stock.price.toFixed(2)}
                </span>
                <MetricValue value={stock.percentChange} type="percent" className="text-[10px]" />
              </div>
            </Link>
          );
        })}
      </div>
    </TerminalCard>
  );
}
