'use client';

import React, { useState, useEffect } from 'react';
import { getAlerts } from '@/lib/api/calendar';
import { AlertRule } from '@/types/calendar';
import { Plus, Trash2, Power } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('RELIANCE');
  const [newCondition, setNewCondition] = useState<'price_above' | 'price_below' | 'rsi_overbought'>('price_above');
  const [newThreshold, setNewThreshold] = useState('3050');

  useEffect(() => {
    async function loadAlerts() {
      const data = await getAlerts();
      setAlerts(data);
    }
    loadAlerts();
  }, []);

  const handleToggleStatus = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'active' ? 'disabled' : 'active';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleDelete = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AlertRule = {
      id: `alt-${Date.now()}`,
      symbol: newSymbol.toUpperCase(),
      name: `${newSymbol.toUpperCase()} Trigger`,
      condition: newCondition,
      threshold: parseFloat(newThreshold) || 100,
      currentValue: parseFloat(newThreshold) * 0.98,
      status: 'active',
      createdAt: 'Today',
    };
    setAlerts([created, ...alerts]);
    setShowModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#F3F4F6]">
            Alerts &amp; Trigger Conditions
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Price thresholds, volatility compression, and technical condition trigger rules
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF2E51] text-white font-mono font-bold text-xs rounded-[4px] hover:bg-[#FF1744] shadow-[0_0_12px_rgba(255,46,81,0.35)] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Alert Trigger</span>
        </button>
      </div>

      {/* Alerts Table */}
      <div className="fin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="fin-table">
            <thead>
              <tr>
                <th>STATUS</th>
                <th>ASSET / TICKER</th>
                <th>CONDITION</th>
                <th className="text-right">THRESHOLD</th>
                <th className="text-right">CURRENT</th>
                <th>CREATED</th>
                <th className="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alt) => (
                <tr key={alt.id}>
                  <td>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        alt.status === 'active'
                          ? 'bg-[#FF2E51]/10 text-[#FF2E51] border border-[#FF2E51]/25'
                          : alt.status === 'triggered'
                          ? 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25'
                          : 'bg-white/[0.04] text-[#6B7280]'
                      }`}
                    >
                      {alt.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="font-mono text-xs font-bold text-[#F3F4F6]">
                    {alt.symbol}
                    <span className="block text-[11px] text-[#6B7280] font-normal">{alt.name}</span>
                  </td>
                  <td className="text-xs text-[#9CA3AF]">
                    {alt.condition === 'price_above'
                      ? 'Price crosses above'
                      : alt.condition === 'price_below'
                      ? 'Price drops below'
                      : 'RSI(14) crosses overbought (>70)'}
                  </td>
                  <td className="text-right font-mono text-xs font-bold text-[#FF2E51]">
                    {alt.threshold}
                  </td>
                  <td className="text-right font-mono text-xs text-[#F3F4F6]">
                    {alt.currentValue}
                  </td>
                  <td className="font-mono text-xs text-[#6B7280]">{alt.createdAt}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(alt.id)}
                        className="p-1 text-[#6B7280] hover:text-[#FF2E51] transition-colors"
                        title="Toggle active"
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(alt.id)}
                        className="p-1 text-[#6B7280] hover:text-[#FF2E51] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#141720] border border-white/[0.1] rounded-[6px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold uppercase text-[#F3F4F6] font-sans">
                Configure Alert Trigger
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-[#F3F4F6]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Asset Symbol</label>
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full bg-[#0E1117] border border-white/[0.08] rounded-[4px] p-2 text-[#F3F4F6] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Condition</label>
                <select
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value as any)}
                  className="w-full bg-[#0C070A] border border-[#241117] rounded-[4px] p-2 text-[#F3F4F6] outline-none"
                >
                  <option value="price_above">Price Crosses Above</option>
                  <option value="price_below">Price Drops Below</option>
                  <option value="rsi_overbought">RSI (14) Overbought (&gt;70)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Threshold</label>
                <input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="w-full bg-[#0C070A] border border-[#241117] rounded-[4px] p-2 text-[#F3F4F6] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#241117]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-[4px] bg-[#130B10] text-[#9CA3AF] hover:text-[#F3F4F6] border border-[#241117]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[4px] bg-[#FF2E51] text-white font-bold hover:bg-[#FF1744] shadow-[0_0_12px_rgba(255,46,81,0.35)]"
                >
                  Save Trigger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
