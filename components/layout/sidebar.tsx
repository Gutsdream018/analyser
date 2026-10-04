'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LayoutGrid,
  TrendingUp,
  BarChart3,
  Layers,
  Binary,
  SlidersHorizontal,
  Newspaper,
  BrainCircuit,
  Bookmark,
  Calendar,
  Bell,
  Briefcase,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspace', path: '/workspace', icon: LayoutGrid },
  { name: 'Live Feed', path: '/overview', icon: Activity },
  { name: 'Markets', path: '/markets', icon: TrendingUp },
  { name: 'Stocks', path: '/stocks/RELIANCE', icon: BarChart3, matchPrefix: '/stocks' },
  { name: 'Indices', path: '/markets?tab=indices', icon: Layers },
  { name: 'F&O', path: '/fno', icon: Binary },
  { name: 'Screener', path: '/screener', icon: SlidersHorizontal },
  { name: 'News', path: '/news', icon: Newspaper },
  { name: 'Analysis', path: '/analysis', icon: BrainCircuit },
  { name: 'Watchlist', path: '/watchlist', icon: Bookmark },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Alerts', path: '/alerts', icon: Bell },
  { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  { name: 'Tools', path: '/screener', icon: Wrench },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`h-[calc(100vh-56px)] bg-[#030407] border-r border-[#241117] flex flex-col justify-between py-3 select-none shrink-0 transition-all duration-200 ease-in-out z-30 sticky top-14 ${
        isCollapsed ? 'w-16 px-2' : 'w-52 px-3'
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-0.5">
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                Workspace
              </span>
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.matchPrefix
                ? pathname.startsWith(item.matchPrefix)
                : pathname === item.path || (item.path === '/dashboard' && pathname === '/');

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-[3px] text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF2E51]/12 text-[#FF2E51] font-bold border-l-2 border-[#FF2E51] shadow-[0_0_15px_rgba(255,46,81,0.2)]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={item.name}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#FF2E51]' : 'text-[#64748B] group-hover:text-[#94A3B8]'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer controls & Collapse button */}
      <div className="pt-2 border-t border-border/80">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs text-slate-500 hover:text-slate-300 hover:bg-[#111925] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          ) : (
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">Collapse</span>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
