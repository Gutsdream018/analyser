'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useDashboardStore,
  WidgetInstance,
  DEFAULT_WORKSPACES,
} from '@/store/dashboardStore';
import { WidgetWrapper } from './WidgetWrapper';

// Widget imports
import { MarketTickerWidget } from '@/components/widgets/MarketTickerWidget';
import { NiftyChartWidget } from '@/components/widgets/NiftyChartWidget';
import { WatchlistWidget } from '@/components/widgets/WatchlistWidget';
import { MarketSentimentWidget } from '@/components/widgets/MarketSentimentWidget';
import { FiiDiiWidget } from '@/components/widgets/FiiDiiWidget';
import { OptionsSnapshotWidget } from '@/components/widgets/OptionsSnapshotWidget';
import { OptionsChainWidget } from '@/components/widgets/OptionsChainWidget';
import { MarketHeatmapWidget } from '@/components/widgets/MarketHeatmapWidget';
import { SectorPerformanceWidget } from '@/components/widgets/SectorPerformanceWidget';
import { GlobalMarketsWidget } from '@/components/widgets/GlobalMarketsWidget';
import { NewsWidget } from '@/components/widgets/NewsWidget';
import { TopMoversWidget } from '@/components/widgets/TopMoversWidget';
import { MarketIntelligenceWidget } from '@/components/widgets/MarketIntelligenceWidget';
import { PortfolioWidget } from '@/components/widgets/PortfolioWidget';
import { AlertsWidget } from '@/components/widgets/AlertsWidget';
import { CalendarWidget } from '@/components/widgets/CalendarWidget';

export function DashboardGrid() {
  const {
    workspaces,
    activeWorkspaceId,
    reorderWidgets,
    setAddDrawerOpen,
  } = useDashboardStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const activeWorkspace = (workspaces && workspaces[activeWorkspaceId]) || DEFAULT_WORKSPACES['my-workspace'] || {
    id: 'my-workspace',
    name: 'My Workspace',
    widgets: [],
  };

  // Render widget content by type
  const renderWidgetContent = (widget: WidgetInstance) => {
    switch (widget.type) {
      case 'MARKET_TICKERS':
        return <MarketTickerWidget />;
      case 'NIFTY_CHART':
        return <NiftyChartWidget />;
      case 'WATCHLIST':
        return <WatchlistWidget />;
      case 'MARKET_SENTIMENT':
        return <MarketSentimentWidget />;
      case 'FII_DII':
        return <FiiDiiWidget />;
      case 'OPTIONS_SNAPSHOT':
        return <OptionsSnapshotWidget />;
      case 'OPTIONS_CHAIN':
        return <OptionsChainWidget />;
      case 'MARKET_HEATMAP':
        return <MarketHeatmapWidget />;
      case 'SECTOR_PERFORMANCE':
        return <SectorPerformanceWidget />;
      case 'GLOBAL_MARKETS':
        return <GlobalMarketsWidget />;
      case 'NEWS':
        return <NewsWidget />;
      case 'TOP_MOVERS':
        return <TopMoversWidget />;
      case 'AI_MARKET_INTELLIGENCE':
        return <MarketIntelligenceWidget />;
      case 'PORTFOLIO':
        return <PortfolioWidget />;
      case 'ALERTS':
        return <AlertsWidget />;
      case 'CALENDAR':
        return <CalendarWidget />;
      default:
        return (
          <div className="p-4 text-xs text-slate-400">
            Widget [{widget.type}] content preview
          </div>
        );
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderWidgets(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-3.5 pb-12">
      {activeWorkspace.widgets.map((widget, index) => (
        <WidgetWrapper
          key={widget.id}
          widget={widget}
          index={index}
          isDragOver={dragOverIndex === index}
          isDragging={draggedIndex === index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {renderWidgetContent(widget)}
        </WidgetWrapper>
      ))}

      {/* Trailing "+ Add Widget" dashed placeholder card as seen in the reference screenshot */}
      <div
        className="col-span-12 sm:col-span-6 lg:col-span-3 min-h-[120px] rounded-lg border-2 border-dashed border-border/80 hover:border-rose-500/50 hover:bg-[#111925]/30 transition-all flex flex-col items-center justify-center cursor-pointer p-4 group"
        onClick={() => setAddDrawerOpen(true)}
      >
        <div className="p-2.5 rounded-full bg-[#111925] border border-border/80 group-hover:border-rose-500/40 group-hover:bg-rose-500/10 text-slate-400 group-hover:text-rose-400 transition-all mb-2">
          <Plus className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
          + Add Widget
        </span>
        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
          Customize workspace layout
        </span>
      </div>
    </div>
  );
}
