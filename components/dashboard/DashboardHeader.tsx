'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Sliders,
  Check,
  RotateCcw,
  Bell,
  ChevronDown,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { useDashboardStore, DEFAULT_WORKSPACES } from '@/store/dashboardStore';
import { useMarketStore } from '@/store/marketStore';
import { GlobalSearchModal } from './GlobalSearchModal';
import { ResetModal } from './ResetModal';

export function DashboardHeader() {
  const {
    workspaces,
    activeWorkspaceId,
    setWorkspace,
    createWorkspace,
    isCustomizeMode,
    setCustomizeMode,
    setAddDrawerOpen,
    isResetModalOpen,
    setResetModalOpen,
  } = useDashboardStore();

  const {
    marketSession,
    istTimeFormatted,
    refreshAllData,
    updateMarketSession,
    isLoading,
    lastUpdatedFormatted,
  } = useMarketStore();

  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateMarketSession();
    const timer = setInterval(() => {
      updateMarketSession();
    }, 1000);
    return () => clearInterval(timer);
  }, [updateMarketSession]);

  const activeWorkspace = mounted && workspaces && workspaces[activeWorkspaceId]
    ? workspaces[activeWorkspaceId]
    : DEFAULT_WORKSPACES['my-workspace'] || {
        id: 'my-workspace',
        name: 'My Workspace',
        widgets: [],
      };

  const workspaceList = mounted && workspaces && Object.keys(workspaces).length > 0
    ? Object.values(workspaces)
    : Object.values(DEFAULT_WORKSPACES);

  // Status badge styling
  const getStatusBadge = () => {
    switch (marketSession) {
      case 'LIVE':
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF2E51]/10 border border-[#FF2E51]/30 text-[#FF2E51] font-mono text-[11px] font-semibold shadow-[0_0_8px_rgba(255,46,81,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#FF2E51] animate-pulse shadow-[0_0_6px_#FF2E51]" />
            <span>LIVE TELEMETRY</span>
          </div>
        );
      case 'PRE-MARKET':
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] font-mono text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span>PRE-MARKET</span>
          </div>
        );
      case 'POST-MARKET':
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] font-mono text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span>POST-MARKET</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#241117] border border-[#241117] text-slate-400 font-mono text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>SESSION CLOSED</span>
          </div>
        );
    }
  };

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      createWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
      setIsCreatingWorkspace(false);
      setIsWorkspaceMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-14 bg-[#030407]/95 backdrop-blur-md border-b border-[#241117] px-4 flex items-center justify-between gap-4">
        {/* Left: Brand + PRO + Workspace Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-[4px] bg-[#FF2E51] shadow-[0_0_12px_rgba(255,46,81,0.5)] flex items-center justify-center font-bold text-white font-mono text-sm tracking-tighter">
              M
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#FF2E51] transition-colors">
                MARKET<span className="text-[#FF2E51]">PULSE</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF2E51]/10 text-[#FF2E51] border border-[#FF2E51]/30 tracking-widest uppercase">
                TERMINAL
              </span>
            </div>
          </Link>

          <span className="h-4 w-px bg-[#241117] hidden sm:inline-block" />

          {/* Workspace Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold text-slate-200 bg-[#0C070A] border border-[#241117] hover:border-[#FF2E51]/45 hover:text-white transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#FF2E51]" />
              <span className="max-w-[120px] truncate">{activeWorkspace.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {isWorkspaceMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    setIsCreatingWorkspace(false);
                  }}
                />
                <div className="absolute left-0 mt-1.5 w-56 rounded-lg bg-[#0C070A] border border-[#241117] shadow-2xl py-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Workspaces
                  </div>

                <div className="max-h-48 overflow-y-auto">
                  {workspaceList.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setWorkspace(ws.id);
                        setIsWorkspaceMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left flex items-center justify-between transition-colors ${
                        ws.id === activeWorkspaceId
                          ? 'bg-[#FF2E51]/15 text-[#FF2E51] font-semibold border-l-2 border-[#FF2E51]'
                          : 'text-slate-300 hover:bg-[#160B10] hover:text-white'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {ws.widgets.length}w
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-[#241117] mt-1 pt-1.5 px-2">
                  {isCreatingWorkspace ? (
                    <div className="flex items-center gap-1 p-1">
                      <input
                        type="text"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        placeholder="Workspace name..."
                        className="w-full bg-[#130B10] border border-[#241117] rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E51]"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                      />
                      <button
                        onClick={handleCreateWorkspace}
                        className="px-2 py-1 bg-[#FF2E51] text-white rounded text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsCreatingWorkspace(true)}
                      className="w-full px-2 py-1 rounded text-left text-xs font-medium text-[#FF2E51] hover:text-[#FF1744] hover:bg-[#FF2E51]/10 flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ New Workspace</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between bg-[#0C070A] hover:bg-[#130B10] border border-[#241117] hover:border-[#FF2E51]/45 rounded-[4px] px-3 py-1.5 text-xs text-slate-400 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF2E51] transition-colors" />
              <span className="font-normal text-slate-400 group-hover:text-slate-300">
                Search stocks, indices, options, institutional flow...
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#030407] text-slate-400 border border-[#241117]">
              ⌘K
            </span>
          </button>
        </div>

        {/* Right: Market Status, Action Controls, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Market Status with IST Time & Refresh Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {getStatusBadge()}
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#FF2E51]">{istTimeFormatted}</span>
            <button
              onClick={() => refreshAllData()}
              disabled={isLoading}
              className={`p-1 rounded text-slate-400 hover:text-[#FF2E51] hover:bg-[#0C070A] border border-transparent hover:border-[#241117] transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              title={`Last updated: ${lastUpdatedFormatted}. Click to refresh market data.`}
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-[#FF2E51]' : ''}`} />
            </button>
          </div>

          <span className="h-4 w-px bg-[#241117] hidden sm:inline-block" />

          {/* Add Widget Button */}
          <button
            onClick={() => setAddDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-mono font-bold bg-[#FF2E51] hover:bg-[#FF1744] text-white shadow-md shadow-[0_0_14px_rgba(255,46,81,0.35)] transition-all hover:scale-[1.02]"
            title="Add widgets to dashboard"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Add Widget</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Customize Mode Toggle */}
          <button
            onClick={() => setCustomizeMode(!isCustomizeMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-xs font-medium transition-all ${
              isCustomizeMode
                ? 'bg-[#FF2E51]/15 text-[#FF2E51] border border-[#FF2E51]/40 hover:bg-[#FF2E51]/25'
                : 'bg-[#0C070A] text-slate-300 border border-[#241117] hover:text-white hover:bg-[#130B10]'
            }`}
            title="Toggle drag handles and resizing mode"
          >
            {isCustomizeMode ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#FF2E51]" />
                <span className="font-semibold text-[#FF2E51]">✓ Done</span>
              </>
            ) : (
              <>
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Customize</span>
              </>
            )}
          </button>

          {/* Reset Workspace Button */}
          <button
            onClick={() => setResetModalOpen(true)}
            className="p-1.5 rounded-[4px] text-slate-400 hover:text-[#FF2E51] hover:bg-[#0C070A] border border-transparent hover:border-[#241117] transition-colors"
            title="Reset workspace to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Mobile search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-1.5 rounded-[4px] text-slate-400 hover:text-white bg-[#0C070A]"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Notification bell */}
          <button className="relative p-1.5 rounded-[4px] text-slate-400 hover:text-[#FF2E51] hover:bg-[#0C070A] transition-colors">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF2E51] rounded-full shadow-[0_0_6px_#FF2E51]" />
          </button>

          {/* User Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#0C070A] border border-[#241117] flex items-center justify-center font-bold text-xs text-[#FF2E51] font-mono shadow-sm">
            A
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Reset Confirmation Modal */}
      <ResetModal isOpen={isResetModalOpen} onClose={() => setResetModalOpen(false)} />
    </>
  );
}
