'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function SettingsPage() {
  const [defaultIndex, setDefaultIndex] = useState('NIFTY 50');
  const [aiTone, setAiTone] = useState<'Quantitative' | 'Concise' | 'Detailed'>('Quantitative');
  const [brokerKey, setBrokerKey] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Terminal Settings &amp; Data Gateways
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Configure default benchmarks, analytical methodology, and live broker API connections
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 rounded-[4px] text-xs font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Data Engine Section */}
        <div className="space-y-3">
          <div className="pb-2 border-b border-white/[0.06]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              DATA SOURCE ENGINE
            </h2>
          </div>
          <div className="fin-card p-5 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-[4px] bg-[#141720] border border-white/[0.05]">
              <div>
                <span className="font-semibold text-sm text-[#F3F4F6] block">
                  MarketPulse Simulated Exchange Engine
                </span>
                <span className="text-xs text-[#6B7280] block mt-0.5">
                  High-fidelity deterministic Indian equity, derivatives, and macro fixtures with zero latency.
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded">
                ACTIVE
              </span>
            </div>

            <div>
              <label className="text-xs font-medium text-[#9CA3AF] block mb-1">
                Broker Feed API Key (Migration Slot)
              </label>
              <input
                type="password"
                placeholder="kite_live_key_****************"
                value={brokerKey}
                onChange={(e) => setBrokerKey(e.target.value)}
                className="w-full bg-[#0E1117] border border-white/[0.08] rounded-[4px] p-2.5 text-xs font-mono text-[#F3F4F6] outline-none placeholder-[#6B7280]"
              />
              <span className="text-[11px] text-[#6B7280] block mt-1.5">
                Swap the internal implementation of <code className="text-[#00F59B] font-mono">lib/api/*</code> functions in priority order: Indices → Breadth → Stocks → F&amp;O → News.
              </span>
            </div>
          </div>
        </div>

        {/* Intelligence Synthesis Settings */}
        <div className="space-y-3">
          <div className="pb-2 border-b border-white/[0.06]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              ANALYTICAL PREFERENCES
            </h2>
          </div>
          <div className="fin-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-xs font-medium text-[#9CA3AF] block mb-1">
                Synthesis Tone
              </label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value as any)}
                className="w-full bg-[#0E1117] border border-white/[0.08] rounded-[4px] p-2.5 text-[#F3F4F6] outline-none font-mono"
              >
                <option value="Quantitative">Quantitative &amp; Structural (Points, Volumes, DMAs)</option>
                <option value="Concise">Executive 60-Second Concise</option>
                <option value="Detailed">Comprehensive Macro Breakdown</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#9CA3AF] block mb-1">
                Default Index
              </label>
              <select
                value={defaultIndex}
                onChange={(e) => setDefaultIndex(e.target.value)}
                className="w-full bg-[#0E1117] border border-white/[0.08] rounded-[4px] p-2.5 text-[#F3F4F6] outline-none font-mono"
              >
                <option value="NIFTY 50">NIFTY 50</option>
                <option value="BANK NIFTY">NIFTY BANK</option>
                <option value="SENSEX">BSE SENSEX</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#00F59B] text-black font-mono font-bold text-xs rounded-[4px] hover:bg-[#00F59B]/90 shadow-[0_0_10px_rgba(0,245,155,0.25)] transition-colors"
          >
            Apply &amp; Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
