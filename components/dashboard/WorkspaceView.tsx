'use client';

import React, { useState, useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { useDashboardStore, DEFAULT_WORKSPACES } from '@/store/dashboardStore';
import { DashboardGrid } from './DashboardGrid';
import { WidgetDrawer } from './WidgetDrawer';
import { Sliders, Clock } from 'lucide-react';

export function WorkspaceView() {
  const {
    workspaces,
    activeWorkspaceId,
    isCustomizeMode,
    setCustomizeMode,
  } = useDashboardStore();

  const {
    refreshAllData,
    updateMarketSession,
    marketSession,
    istTimeFormatted,
  } = useMarketStore();

  const [mounted, setMounted] = useState(false);

  const activeWorkspace = mounted && workspaces && workspaces[activeWorkspaceId]
    ? workspaces[activeWorkspaceId]
    : DEFAULT_WORKSPACES['my-workspace'] || {
        id: 'my-workspace',
        name: 'My Workspace',
        widgets: [],
      };

  useEffect(() => {
    setMounted(true);
    refreshAllData();
    updateMarketSession();

    // 1-second clock updater for IST time and market session
    const clockTimer = setInterval(() => {
      updateMarketSession();
    }, 1000);

    // Controlled market data polling interval: 60s
    const pollTimer = setInterval(() => {
      refreshAllData();
    }, 60000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(pollTimer);
    };
  }, [refreshAllData, updateMarketSession]);

  return (
    <div className="space-y-4">
      {/* Workspace Bar: Active Preset & Quick Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{activeWorkspace.name}</span>
          </h1>
          <span className="text-xs text-slate-400 font-mono hidden md:inline-block">
            • {activeWorkspace.widgets.length} active widgets
          </span>
        </div>

        {/* Customization Guidance Banner */}
        {isCustomizeMode && (
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-md animate-in fade-in">
            <Sliders className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Customize mode active: Drag to reorder, use [-] / [+] to resize widgets</span>
            <button
              onClick={() => setCustomizeMode(false)}
              className="ml-2 font-bold underline hover:text-white"
            >
              Done
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{istTimeFormatted}</span>
          </span>
          <span>•</span>
          <span className="text-slate-400">
            {marketSession === 'LIVE' ? (
              <span className="text-emerald-400 font-semibold">Live Market Session</span>
            ) : marketSession === 'PRE-MARKET' ? (
              <span className="text-amber-400 font-semibold">Pre-Market Open</span>
            ) : (
              <span className="text-slate-400">Session Closed (09:15-15:30 IST)</span>
            )}
          </span>
        </div>
      </div>

      {/* Grid workspace */}
      <DashboardGrid />

      {/* Slide-over widget catalog drawer */}
      <WidgetDrawer />
    </div>
  );
}
