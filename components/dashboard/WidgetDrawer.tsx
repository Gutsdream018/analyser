'use client';

import React, { useState } from 'react';
import { X, Search, Check, Plus, Layers } from 'lucide-react';
import { useDashboardStore, WIDGET_CATALOG, DEFAULT_WORKSPACES } from '@/store/dashboardStore';

export function WidgetDrawer() {
  const {
    isAddDrawerOpen,
    setAddDrawerOpen,
    workspaces,
    activeWorkspaceId,
    addWidget,
    removeWidget,
  } = useDashboardStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isAddDrawerOpen) return null;

  const activeWorkspace = (workspaces && workspaces[activeWorkspaceId]) || DEFAULT_WORKSPACES['my-workspace'] || {
    id: 'my-workspace',
    name: 'My Workspace',
    widgets: [],
  };
  const currentWidgetTypes = new Set(activeWorkspace.widgets.map((w) => w.type));

  const categories = ['ALL', 'MARKETS', 'TRADING', 'NEWS', 'ANALYSIS', 'PORTFOLIO'];

  const catalogList = Object.values(WIDGET_CATALOG);

  const filteredCatalog = catalogList.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity flex justify-end">
      <div
        className="fixed inset-0"
        onClick={() => setAddDrawerOpen(false)}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-md bg-[#0D131D] border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-border/80 flex items-center justify-between bg-[#070B12]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Customize Dashboard</h2>
              <p className="text-[11px] text-slate-400">
                Workspace: <span className="text-rose-400 font-semibold">{activeWorkspace.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setAddDrawerOpen(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border/60 bg-[#0D131D]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search widgets (e.g., Chart, FII, Options)..."
              className="w-full bg-[#111925] border border-border/80 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 text-[11px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Widget list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredCatalog.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No matching widgets found.
            </div>
          ) : (
            filteredCatalog.map((item) => {
              const isAdded = currentWidgetTypes.has(item.type);

              return (
                <div
                  key={item.type}
                  className={`p-3 rounded-lg border transition-all ${
                    isAdded
                      ? 'bg-[#111925]/40 border-border/50 opacity-90'
                      : 'bg-[#111925] border-border/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{item.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-border/60 text-slate-400 uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        Default width: {item.defaultColSpan}/12 cols
                      </div>
                    </div>

                    <div>
                      {isAdded ? (
                        <button
                          onClick={() => {
                            const widget = activeWorkspace.widgets.find((w) => w.type === item.type);
                            if (widget) removeWidget(widget.id);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-colors group"
                          title="Click to remove from workspace"
                        >
                          <Check className="w-3.5 h-3.5 group-hover:hidden" />
                          <X className="w-3.5 h-3.5 hidden group-hover:inline-block" />
                          <span className="group-hover:hidden">Added</span>
                          <span className="hidden group-hover:inline">Remove</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => addWidget(item.type)}
                          className="flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/80 bg-[#070B12] flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            {activeWorkspace.widgets.length} active widgets
          </span>
          <button
            onClick={() => setAddDrawerOpen(false)}
            className="px-4 py-1.5 bg-[#111925] hover:bg-[#152030] text-slate-200 border border-border/80 rounded font-medium text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
