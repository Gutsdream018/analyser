import React from 'react';
import Link from 'next/link';
import { getAiDailyBrief, getAttributionReport } from '@/lib/api/analysis';
import { getNewsArticles } from '@/lib/api/news';
import { MetricValue } from '@/components/common/metric-value';
import { ArrowLeft, BookOpen, Layers, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Daily Market Brief & Institutional Analysis | MarketPulse',
  description: 'Structured daily financial intelligence: Market Summary, Institutional Context, and NIFTY Attribution Engine.',
};

export default async function AnalysisPage() {
  const [brief, attribution, news] = await Promise.all([
    getAiDailyBrief(),
    getAttributionReport(),
    getNewsArticles('All'),
  ]);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Daily Market Brief &amp; Research
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Systematic synthesis of today&apos;s price action, institutional order flow, and derivatives positioning
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280]">
          <span>Published: 15:30 IST</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#9CA3AF]">
            NSE / BSE Cash &amp; Derivatives
          </span>
        </div>
      </div>

      {/* 1. DAILY MARKET BRIEF */}
      <article className="fin-card p-6 sm:p-8 space-y-7">
        {/* Section 1: Market Summary */}
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#9CA3AF]">
              CALCULATED SYNTHESIS
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              1. Market Summary
            </h2>
          </div>
          <p className="text-base text-[#F3F4F6] font-normal leading-relaxed">
            {brief.executiveSummary}
          </p>
        </section>

        {/* Section 2: Key Drivers */}
        <section className="space-y-3 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981]">
              OBSERVED SIGNALS
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              2. Key Drivers
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-[#D1D5DB]">
            {brief.signal.keyPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3: Institutional Context */}
        <section className="space-y-3 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#9CA3AF]">
              EXCHANGE DATA
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              3. Institutional Context
            </h2>
          </div>
          <p className="text-sm text-[#D1D5DB] leading-relaxed">
            {brief.context.macroSummary}
          </p>
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.05] text-xs font-mono text-[#9CA3AF]">
            {brief.context.fiiDiiFlowText}
          </div>
        </section>

        {/* Section 4: Sector Rotation */}
        <section className="space-y-3 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#9CA3AF]">
              BREADTH
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              4. Sector Rotation &amp; Leadership
            </h2>
          </div>
          <p className="text-sm text-[#D1D5DB] leading-relaxed">
            {brief.sectorLeadership.commentary}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
            <div className="p-3 rounded bg-[#10B981]/5 border border-[#10B981]/15">
              <span className="text-[#10B981] font-semibold block mb-1">Leading Sectors</span>
              <span className="text-[#F3F4F6]">{brief.sectorLeadership.leading.join(', ')}</span>
            </div>
            <div className="p-3 rounded bg-[#F43F5E]/5 border border-[#F43F5E]/15">
              <span className="text-[#F43F5E] font-semibold block mb-1">Lagging Sectors</span>
              <span className="text-[#F3F4F6]">{brief.sectorLeadership.lagging.join(', ')}</span>
            </div>
          </div>
        </section>

        {/* Section 5: F&O Context */}
        <section className="space-y-3 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#9CA3AF]">
              DERIVATIVES
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              5. F&amp;O &amp; Open Interest Context
            </h2>
          </div>
          <p className="text-sm text-[#D1D5DB] leading-relaxed">
            {brief.derivativesView.pcrAnalysis}
          </p>
          <p className="text-xs text-[#9CA3AF] leading-relaxed font-mono">
            {brief.derivativesView.oiClusterText}
          </p>
        </section>

        {/* Section 6: Global Cues */}
        <section className="space-y-3 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#9CA3AF]">
              MACRO
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              6. Global Cues &amp; Commodity Linkages
            </h2>
          </div>
          <p className="text-sm text-[#D1D5DB] leading-relaxed">
            {brief.context.crudeAndCurrencyText}
          </p>
        </section>

        {/* Section 7: Important News */}
        <section className="space-y-3 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#9CA3AF]">
              CORPORATE
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              7. Important News &amp; Exchange Filings
            </h2>
          </div>
          <div className="space-y-2">
            {news.slice(0, 3).map((item) => (
              <div key={item.id} className="text-xs p-2.5 rounded bg-white/[0.02]">
                <span className="font-semibold text-[#F3F4F6] block">{item.headline}</span>
                <span className="text-[#6B7280] font-mono mt-0.5 block">{item.source} • {item.timeAgo}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: What To Watch */}
        <section className="space-y-3 pt-5 border-t border-[#241117]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF2E51]/10 text-[#FF2E51] border border-[#FF2E51]/25">
              HORIZON
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#FF2E51]">
              8. What To Watch
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-[#D1D5DB]">
            {brief.whatToWatch.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-[#FF2E51] mt-0.5 shrink-0">
                  {idx + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>

      {/* 2. ATTRIBUTION ENGINE ("WHY DID NIFTY MOVE?") */}
      <section className="fin-card p-6 sm:p-8 space-y-5">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-[#241117]">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
                INDEX ATTRIBUTION ENGINE — &ldquo;WHY DID NIFTY MOVE?&rdquo;
              </h2>
              <p className="text-xs text-[#6B7280]">
                Net +{attribution.indexChangePoints} pts (+{attribution.indexChangePercent}%)
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-[#FF2E51] bg-[#FF2E51]/10 border border-[#FF2E51]/25 px-2 py-0.5 rounded font-semibold">RAW EXCHANGE DATA</span>
              <span>vs</span>
              <span className="text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/25 px-2 py-0.5 rounded">AI INTERPRETATION</span>
            </div>
          </div>
          <p className="text-sm text-[#D1D5DB] leading-relaxed mt-3">
            {attribution.synthesis}
          </p>
        </div>

        {/* Contributors Table */}
        <div className="overflow-x-auto">
          <table className="fin-table">
            <thead>
              <tr>
                <th>STOCK</th>
                <th className="text-right">POINTS</th>
                <th className="text-right">CHANGE</th>
                <th className="text-left">RAW OBSERVED FACT</th>
                <th className="text-left">AI RESEARCH INTERPRETATION</th>
              </tr>
            </thead>
            <tbody>
              {attribution.topPositiveContributors.map((c) => (
                <tr key={c.symbol}>
                  <td>
                    <Link
                      href={`/stocks/${c.symbol}`}
                      className="font-mono font-bold text-xs text-[#F3F4F6] hover:text-[#FF2E51] transition-colors"
                    >
                      {c.symbol}
                    </Link>
                  </td>
                  <td className="text-right font-mono text-xs font-bold text-emerald-400">
                    +{c.pointsContributed.toFixed(1)}
                  </td>
                  <td className="text-right font-mono text-xs text-emerald-400">
                    +{c.priceChangePercent}%
                  </td>
                  <td className="text-xs text-[#9CA3AF] max-w-xs whitespace-normal font-sans">
                    {c.observedData}
                  </td>
                  <td className="text-xs text-[#F3F4F6] max-w-sm whitespace-normal font-sans">
                    {c.aiExplanation}
                  </td>
                </tr>
              ))}
              {attribution.topNegativeContributors.map((c) => (
                <tr key={c.symbol}>
                  <td>
                    <Link
                      href={`/stocks/${c.symbol}`}
                      className="font-mono font-bold text-xs text-[#F3F4F6] hover:text-[#FF2E51] transition-colors"
                    >
                      {c.symbol}
                    </Link>
                  </td>
                  <td className="text-right font-mono text-xs font-bold text-[#FF2E51]">
                    {c.pointsContributed.toFixed(1)}
                  </td>
                  <td className="text-right font-mono text-xs text-[#FF2E51]">
                    {c.priceChangePercent}%
                  </td>
                  <td className="text-xs text-[#9CA3AF] max-w-xs whitespace-normal font-sans">
                    {c.observedData}
                  </td>
                  <td className="text-xs text-[#F3F4F6] max-w-sm whitespace-normal font-sans">
                    {c.aiExplanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Source Citation & Methodology */}
      <div className="p-4 rounded-[5px] bg-[#11141A] border border-white/[0.06] text-xs text-[#6B7280] space-y-1">
        <span className="font-semibold text-[#9CA3AF] block uppercase tracking-wider text-[11px]">
          DATA CITATIONS &amp; METHODOLOGY
        </span>
        <p>
          Index attribution calculated using free-float market capitalization weighting methodology of Nifty 50 constituents.
          Institutional cash flows reconciled against National Stock Exchange of India (NSE) end-of-day reports.
        </p>
      </div>
    </div>
  );
}
