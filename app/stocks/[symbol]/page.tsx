import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStockQuote, getHistoricalCandles } from '@/lib/api/stocks';
import { getNewsArticles } from '@/lib/api/news';
import { StockChart } from '@/components/stocks/stock-chart';
import { MetricValue } from '@/components/common/metric-value';
import { formatRupees, formatVolume, formatMarketCapCr } from '@/lib/formatters/currency';
import { ArrowLeft, ArrowUpRight, Calendar, ExternalLink } from 'lucide-react';

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetailPage({ params }: StockPageProps) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol.toUpperCase();
  const [stock, allNews] = await Promise.all([
    getStockQuote(symbol),
    getNewsArticles('All'),
  ]);

  if (!stock) {
    return (
      <div className="p-12 text-center fin-card">
        <h2 className="text-base font-bold text-[#F3F4F6] font-mono mb-2">Symbol Not Found</h2>
        <p className="text-xs text-[#9CA3AF] mb-4">
          Stock ticker &ldquo;{symbol}&rdquo; was not found in the demo dataset.
        </p>
        <Link href="/dashboard" className="text-xs font-mono text-[#FF2E51] underline">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const candles = await getHistoricalCandles(symbol, '1D');
  const relatedNews = allNews.filter((n) => n.relatedSymbols.includes(stock.symbol));
  const displayNews = relatedNews.length > 0 ? relatedNews : allNews.slice(0, 2);

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280]">
        <Link href="/dashboard" className="hover:text-[#F3F4F6] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <span>/</span>
        <Link href="/markets" className="hover:text-[#F3F4F6] transition-colors">
          Equities
        </Link>
        <span>/</span>
        <span className="text-[#FF2E51] font-bold">{stock.symbol}</span>
      </div>

      {/* 1. STOCK HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-5 border-b border-[#241117]">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#F3F4F6]">
              {stock.symbol}
            </h1>
            <span className="text-sm text-[#9CA3AF] font-sans font-normal">
              {stock.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-[#6B7280]">
            <span>{stock.exchange}: {stock.symbol}</span>
            <span>•</span>
            <span>{stock.sector}</span>
            <span>•</span>
            <span>{stock.capCategory}</span>
          </div>
        </div>

        {/* Live Price Focus */}
        <div className="sm:text-right">
          <div className="text-3xl sm:text-4xl font-bold font-mono text-[#F3F4F6] tabular-nums tracking-tight">
            ₹{stock.price.toFixed(2)}
          </div>
          <div className="flex items-center sm:justify-end gap-2 mt-1 text-sm">
            <MetricValue value={stock.change} type="points" className="font-semibold" />
            <MetricValue value={stock.percentChange} type="percent" className="font-semibold" />
          </div>
        </div>
      </div>

      {/* 2. PRICE CHART */}
      <section>
        <StockChart candles={candles} symbol={stock.symbol} />
      </section>

      {/* 3. KEY METRICS */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          KEY METRICS
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              Market Cap
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
              {formatMarketCapCr(stock.marketCapCr)}
            </span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              P/E Ratio
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
              {stock.pe.toFixed(1)}
            </span>
            <span className="text-[10px] text-[#6B7280]">Sector: {stock.fundamentals.sectorPe}</span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              EPS (TTM)
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
              ₹{stock.fundamentals.eps.toFixed(2)}
            </span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              52W High
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
              ₹{stock.fiftyTwoWeekHigh.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#38BDF8]">-{stock.distanceFrom52WHigh.toFixed(1)}% gap</span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              52W Low
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
              ₹{stock.fiftyTwoWeekLow.toFixed(2)}
            </span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              Volume
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#F3F4F6] tabular-nums block mt-1">
              {formatVolume(stock.volume)}
            </span>
            <span className="text-[10px] text-[#00F59B]">{stock.volumeMultiplier.toFixed(1)}x avg</span>
          </div>
        </div>
      </section>

      {/* 4. TODAY'S MOVEMENT */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          TODAY&apos;S MOVEMENT
        </h2>
        <div className="fin-card p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#6B7280] block text-[11px]">Day Open:</span>
              <span className="text-base font-bold text-[#F3F4F6]">₹{stock.open.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Previous Close:</span>
              <span className="text-base font-bold text-[#9CA3AF]">₹{stock.close.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Day High:</span>
              <span className="text-base font-bold text-[#10B981]">₹{stock.high.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Day Low:</span>
              <span className="text-base font-bold text-[#F43F5E]">₹{stock.low.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TECHNICAL SNAPSHOT */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          TECHNICAL SNAPSHOT
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              RSI (14)
            </span>
            <span className="text-lg font-bold font-mono text-[#F3F4F6] block mt-1">
              {stock.technicals.rsi14}
            </span>
            <span className="text-[10px] text-[#00F59B]">{stock.technicals.rsiZone}</span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              20 DMA
            </span>
            <span className="text-lg font-bold font-mono text-[#F3F4F6] block mt-1">
              ₹{stock.technicals.dma20.toFixed(0)}
            </span>
            <span className="text-[10px] text-[#00F59B]">+{stock.technicals.distDma20}% dist</span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              50 DMA
            </span>
            <span className="text-lg font-bold font-mono text-[#F3F4F6] block mt-1">
              ₹{stock.technicals.dma50.toFixed(0)}
            </span>
            <span className="text-[10px] text-[#10B981]">+{stock.technicals.distDma50}% dist</span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              200 DMA
            </span>
            <span className="text-lg font-bold font-mono text-[#F3F4F6] block mt-1">
              ₹{stock.technicals.dma200.toFixed(0)}
            </span>
            <span className="text-[10px] text-[#10B981]">+{stock.technicals.distDma200}% dist</span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              MACD
            </span>
            <span className="text-sm font-bold text-[#10B981] block mt-1 truncate">
              {stock.technicals.macdStatus}
            </span>
            <span className="text-[10px] font-mono text-[#6B7280]">Val: {stock.technicals.macdValue}</span>
          </div>

          <div className="fin-card p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] block">
              Beta / Volatility
            </span>
            <span className="text-lg font-bold font-mono text-[#F3F4F6] block mt-1">
              β {stock.technicals.beta20D}
            </span>
            <span className="text-[10px] text-[#6B7280]">HV: {stock.technicals.historicalVolatility}%</span>
          </div>
        </div>
      </section>

      {/* 6. NEWS */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          COMPANY DISPATCHES &amp; NEWS
        </h2>
        <div className="fin-card divide-y divide-white/[0.05] overflow-hidden">
          {displayNews.map((news) => (
            <div key={news.id} className="p-4 flex items-baseline justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#6B7280]">
                  {news.source} • {news.timeAgo}
                </span>
                <h4 className="text-sm font-medium text-[#F3F4F6] hover:text-[#FF2E51] transition-colors leading-snug cursor-pointer">
                  {news.headline}
                </h4>
                <p className="text-xs text-[#9CA3AF] line-clamp-1">{news.summary}</p>
              </div>
              <span className="text-[10px] font-mono text-[#FF2E51] px-2 py-0.5 rounded bg-[#FF2E51]/10 border border-[#FF2E51]/25 shrink-0">
                {news.impact} Impact
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AI SUMMARY */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          EQUITY SYNTHESIS &amp; REGIME
        </h2>
        <div className="fin-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF2E51] block mb-1.5">
                • PRIMARY CATALYST
              </span>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                {stock.aiSummary.catalyst}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF2E51] block mb-1.5">
                • RISK FACTORS / HEADWINDS
              </span>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                {stock.aiSummary.riskFactor}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF2E51] block mb-1.5">
                • INFLECTION LEVELS
              </span>
              <div className="space-y-1 text-xs font-mono text-[#D1D5DB]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Resistance:</span>
                  <span className="font-semibold text-[#F3F4F6]">
                    ₹{stock.aiSummary.keyLevels.resistance1} / ₹{stock.aiSummary.keyLevels.resistance2}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Support:</span>
                  <span className="font-semibold text-[#F3F4F6]">
                    ₹{stock.aiSummary.keyLevels.support1} / ₹{stock.aiSummary.keyLevels.support2}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-white/[0.04] text-[11px] text-[#6B7280]">
            Factual synthesis derived from financial filings and market pricing data.
          </div>
        </div>
      </section>

      {/* 8. UPCOMING EVENTS */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          UPCOMING EVENTS &amp; CORPORATE ACTIONS
        </h2>
        <div className="fin-card divide-y divide-white/[0.05] overflow-hidden">
          {stock.upcomingEvents.map((evt, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#00F59B]" />
                <span className="font-medium text-[#F3F4F6]">{evt.title}</span>
                <span className="text-[10px] font-mono text-[#9CA3AF] px-1.5 py-0.5 rounded bg-white/[0.05]">
                  {evt.type}
                </span>
              </div>
              <span className="font-mono text-[#6B7280]">{evt.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
