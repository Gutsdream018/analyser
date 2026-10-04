import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type WidgetType =
  | 'MARKET_TICKERS'
  | 'NIFTY_CHART'
  | 'WATCHLIST'
  | 'MARKET_SENTIMENT'
  | 'FII_DII'
  | 'OPTIONS_SNAPSHOT'
  | 'OPTIONS_CHAIN'
  | 'MARKET_HEATMAP'
  | 'SECTOR_PERFORMANCE'
  | 'GLOBAL_MARKETS'
  | 'NEWS'
  | 'TOP_MOVERS'
  | 'AI_MARKET_INTELLIGENCE'
  | 'PORTFOLIO'
  | 'ALERTS'
  | 'CALENDAR';

export type WidgetCategory = 'MARKETS' | 'TRADING' | 'NEWS' | 'ANALYSIS' | 'PORTFOLIO';

export interface WidgetMeta {
  type: WidgetType;
  title: string;
  subtitle?: string;
  category: WidgetCategory;
  defaultColSpan: number; // in 12-col grid
  minColSpan: number;
  maxColSpan: number;
  description: string;
}

export const WIDGET_CATALOG: Record<WidgetType, WidgetMeta> = {
  MARKET_TICKERS: {
    type: 'MARKET_TICKERS',
    title: 'Market Tickers',
    subtitle: 'NIFTY, BANK NIFTY, VIX, IT',
    category: 'MARKETS',
    defaultColSpan: 12,
    minColSpan: 6,
    maxColSpan: 12,
    description: 'High-frequency benchmarks with sparklines, day high/low, and live percentage changes.',
  },
  NIFTY_CHART: {
    type: 'NIFTY_CHART',
    title: 'NIFTY 50 Chart',
    subtitle: 'Interactive Candlestick & Indicators',
    category: 'TRADING',
    defaultColSpan: 8,
    minColSpan: 6,
    maxColSpan: 12,
    description: 'Professional candlestick/area chart with timeframe controls (1D-ALL) and indicators (SMA, EMA, RSI, MACD).',
  },
  MARKET_SENTIMENT: {
    type: 'MARKET_SENTIMENT',
    title: 'Market Sentiment',
    subtitle: 'Breadth & Gauge Score',
    category: 'ANALYSIS',
    defaultColSpan: 4,
    minColSpan: 3,
    maxColSpan: 6,
    description: 'Semicircle institutional gauge score with real-time advancing vs declining equity count.',
  },
  WATCHLIST: {
    type: 'WATCHLIST',
    title: 'Personal Watchlist',
    subtitle: 'Tracked Indian Equities',
    category: 'PORTFOLIO',
    defaultColSpan: 4,
    minColSpan: 3,
    maxColSpan: 6,
    description: 'Live equity watchlist with LTP, change, %, and inline stock search modal.',
  },
  FII_DII: {
    type: 'FII_DII',
    title: 'FII / DII Activity',
    subtitle: 'Institutional Cash Flows (₹ Cr)',
    category: 'ANALYSIS',
    defaultColSpan: 4,
    minColSpan: 3,
    maxColSpan: 8,
    description: 'Historical net institutional cash flows for Foreign & Domestic institutions.',
  },
  OPTIONS_SNAPSHOT: {
    type: 'OPTIONS_SNAPSHOT',
    title: 'Options Snapshot',
    subtitle: 'PCR, Max Pain, Open Interest',
    category: 'TRADING',
    defaultColSpan: 4,
    minColSpan: 3,
    maxColSpan: 6,
    description: 'Derivatives sentiment pulse featuring Put-Call Ratio, strike Max Pain, and Call vs Put OI.',
  },
  OPTIONS_CHAIN: {
    type: 'OPTIONS_CHAIN',
    title: 'Options Chain',
    subtitle: 'Active Strike Matrix',
    category: 'TRADING',
    defaultColSpan: 12,
    minColSpan: 6,
    maxColSpan: 12,
    description: 'Deep strike option chain matrix with ATM highlights and participant OI builds.',
  },
  MARKET_HEATMAP: {
    type: 'MARKET_HEATMAP',
    title: 'Market Heatmap',
    subtitle: 'Intensity by Capital Flow',
    category: 'MARKETS',
    defaultColSpan: 6,
    minColSpan: 4,
    maxColSpan: 12,
    description: 'Visual green/red intensity grid covering NIFTY 50, NIFTY 500, or Sectoral baskets.',
  },
  SECTOR_PERFORMANCE: {
    type: 'SECTOR_PERFORMANCE',
    title: 'Sector Performance',
    subtitle: 'Sectoral Dispersion',
    category: 'MARKETS',
    defaultColSpan: 6,
    minColSpan: 4,
    maxColSpan: 12,
    description: 'Key Indian sector indices performance with mini sparklines and trend categorization.',
  },
  GLOBAL_MARKETS: {
    type: 'GLOBAL_MARKETS',
    title: 'Global Markets & Macro',
    subtitle: 'US, Asian & Commodities',
    category: 'MARKETS',
    defaultColSpan: 4,
    minColSpan: 3,
    maxColSpan: 6,
    description: 'Global benchmark indices (DOW, S&P 500, NASDAQ, DXY) and key commodities (Crude, Gold).',
  },
  NEWS: {
    type: 'NEWS',
    title: 'Live Dispatches & News',
    subtitle: 'Categorized Real-time Feed',
    category: 'NEWS',
    defaultColSpan: 6,
    minColSpan: 4,
    maxColSpan: 12,
    description: 'Categorized institutional news feed (Market, Economy, Stocks, Global) with impact tags.',
  },
  TOP_MOVERS: {
    type: 'TOP_MOVERS',
    title: 'Top Movers',
    subtitle: 'Gainers, Losers & Active Volume',
    category: 'TRADING',
    defaultColSpan: 6,
    minColSpan: 4,
    maxColSpan: 12,
    description: 'Active session leaders across top percentage gainers, losers, and high-volume shockers.',
  },
  AI_MARKET_INTELLIGENCE: {
    type: 'AI_MARKET_INTELLIGENCE',
    title: "Today's Market Intelligence",
    subtitle: 'AI Synthesis & Catalysts',
    category: 'ANALYSIS',
    defaultColSpan: 6,
    minColSpan: 4,
    maxColSpan: 12,
    description: 'Factual market narrative synthesis: Executive Summary, Key Drivers, and What to Watch.',
  },
  PORTFOLIO: {
    type: 'PORTFOLIO',
    title: 'Portfolio Snapshot',
    subtitle: 'Holdings, P&L & Allocation',
    category: 'PORTFOLIO',
    defaultColSpan: 6,
    minColSpan: 4,
    maxColSpan: 12,
    description: 'Personal simulated holdings tracker showing invested value, current value, and day P&L.',
  },
  ALERTS: {
    type: 'ALERTS',
    title: 'Active Alerts',
    subtitle: 'Thresholds & Technical Triggers',
    category: 'TRADING',
    defaultColSpan: 6,
    minColSpan: 4,
    maxColSpan: 12,
    description: 'Configured price inflection, DMA crossover, and volatility breach triggers.',
  },
  CALENDAR: {
    type: 'CALENDAR',
    title: 'Corporate Actions & Agenda',
    subtitle: 'Earnings & Bulk Deals',
    category: 'ANALYSIS',
    defaultColSpan: 6,
    minColSpan: 4,
    maxColSpan: 12,
    description: 'Upcoming corporate board meetings, dividend ex-dates, and institutional bulk trades.',
  },
};

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  title?: string;
  colSpan: number; // 1 to 12
  isMinimized?: boolean;
  settings?: Record<string, unknown>;
}

export interface WorkspaceConfig {
  id: string;
  name: string;
  isDefault?: boolean;
  widgets: WidgetInstance[];
}

export const DEFAULT_WORKSPACES: Record<string, WorkspaceConfig> = {
  'my-workspace': {
    id: 'my-workspace',
    name: 'My Workspace',
    isDefault: true,
    widgets: [
      { id: 'w-tickers', type: 'MARKET_TICKERS', colSpan: 12 },
      { id: 'w-chart', type: 'NIFTY_CHART', colSpan: 8 },
      { id: 'w-sentiment', type: 'MARKET_SENTIMENT', colSpan: 4 },
      { id: 'w-watchlist', type: 'WATCHLIST', colSpan: 4 },
      { id: 'w-fii-dii', type: 'FII_DII', colSpan: 4 },
      { id: 'w-options', type: 'OPTIONS_SNAPSHOT', colSpan: 4 },
      { id: 'w-sectors', type: 'SECTOR_PERFORMANCE', colSpan: 6 },
      { id: 'w-global', type: 'GLOBAL_MARKETS', colSpan: 6 },
      { id: 'w-heatmap', type: 'MARKET_HEATMAP', colSpan: 6 },
      { id: 'w-movers', type: 'TOP_MOVERS', colSpan: 6 },
      { id: 'w-ai', type: 'AI_MARKET_INTELLIGENCE', colSpan: 6 },
      { id: 'w-news', type: 'NEWS', colSpan: 6 },
    ],
  },
  'day-trading': {
    id: 'day-trading',
    name: 'Day Trading',
    widgets: [
      { id: 'dt-tickers', type: 'MARKET_TICKERS', colSpan: 12 },
      { id: 'dt-chart', type: 'NIFTY_CHART', colSpan: 8 },
      { id: 'dt-movers', type: 'TOP_MOVERS', colSpan: 4 },
      { id: 'dt-watchlist', type: 'WATCHLIST', colSpan: 4 },
      { id: 'dt-options', type: 'OPTIONS_SNAPSHOT', colSpan: 4 },
      { id: 'dt-sentiment', type: 'MARKET_SENTIMENT', colSpan: 4 },
      { id: 'dt-news', type: 'NEWS', colSpan: 6 },
      { id: 'dt-alerts', type: 'ALERTS', colSpan: 6 },
    ],
  },
  'options': {
    id: 'options',
    name: 'Options',
    widgets: [
      { id: 'opt-tickers', type: 'MARKET_TICKERS', colSpan: 12 },
      { id: 'opt-snapshot', type: 'OPTIONS_SNAPSHOT', colSpan: 4 },
      { id: 'opt-sentiment', type: 'MARKET_SENTIMENT', colSpan: 4 },
      { id: 'opt-fii', type: 'FII_DII', colSpan: 4 },
      { id: 'opt-chain', type: 'OPTIONS_CHAIN', colSpan: 12 },
      { id: 'opt-chart', type: 'NIFTY_CHART', colSpan: 8 },
      { id: 'opt-news', type: 'NEWS', colSpan: 4 },
    ],
  },
  'long-term': {
    id: 'long-term',
    name: 'Long Term',
    widgets: [
      { id: 'lt-tickers', type: 'MARKET_TICKERS', colSpan: 12 },
      { id: 'lt-sectors', type: 'SECTOR_PERFORMANCE', colSpan: 6 },
      { id: 'lt-fii', type: 'FII_DII', colSpan: 6 },
      { id: 'lt-ai', type: 'AI_MARKET_INTELLIGENCE', colSpan: 6 },
      { id: 'lt-portfolio', type: 'PORTFOLIO', colSpan: 6 },
      { id: 'lt-watchlist', type: 'WATCHLIST', colSpan: 6 },
      { id: 'lt-calendar', type: 'CALENDAR', colSpan: 6 },
    ],
  },
  'research': {
    id: 'research',
    name: 'Research',
    widgets: [
      { id: 'res-ai', type: 'AI_MARKET_INTELLIGENCE', colSpan: 12 },
      { id: 'res-heatmap', type: 'MARKET_HEATMAP', colSpan: 6 },
      { id: 'res-sectors', type: 'SECTOR_PERFORMANCE', colSpan: 6 },
      { id: 'res-fii', type: 'FII_DII', colSpan: 6 },
      { id: 'res-calendar', type: 'CALENDAR', colSpan: 6 },
      { id: 'res-news', type: 'NEWS', colSpan: 12 },
    ],
  },
};

interface DashboardState {
  activeWorkspaceId: string;
  workspaces: Record<string, WorkspaceConfig>;
  isCustomizeMode: boolean;
  isAddDrawerOpen: boolean;
  isResetModalOpen: boolean;
  isSidebarCollapsed: boolean;

  // Actions
  setCustomizeMode: (enabled: boolean) => void;
  setAddDrawerOpen: (open: boolean) => void;
  setResetModalOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  setWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string) => string;
  deleteWorkspace: (workspaceId: string) => void;
  resetWorkspace: () => void;

  addWidget: (type: WidgetType, customTitle?: string) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  resizeWidget: (id: string, colSpan: number) => void;
  toggleMinimizeWidget: (id: string) => void;
  updateWidgetSettings: (id: string, settings: Record<string, unknown>) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      activeWorkspaceId: 'my-workspace',
      workspaces: DEFAULT_WORKSPACES,
      isCustomizeMode: false,
      isAddDrawerOpen: false,
      isResetModalOpen: false,
      isSidebarCollapsed: false,

      setCustomizeMode: (enabled) => set({ isCustomizeMode: enabled }),
      setAddDrawerOpen: (open) => set({ isAddDrawerOpen: open }),
      setResetModalOpen: (open) => set({ isResetModalOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

      setWorkspace: (workspaceId) => {
        if (get().workspaces[workspaceId]) {
          set({ activeWorkspaceId: workspaceId });
        }
      },

      createWorkspace: (name) => {
        const id = `workspace-${Date.now()}`;
        const newWorkspace: WorkspaceConfig = {
          id,
          name: name.trim() || 'New Workspace',
          widgets: [...DEFAULT_WORKSPACES['my-workspace'].widgets],
        };

        set((state) => ({
          workspaces: { ...state.workspaces, [id]: newWorkspace },
          activeWorkspaceId: id,
        }));
        return id;
      },

      deleteWorkspace: (workspaceId) => {
        if (workspaceId === 'my-workspace') return; // Cannot delete primary
        set((state) => {
          const updated = { ...state.workspaces };
          delete updated[workspaceId];
          return {
            workspaces: updated,
            activeWorkspaceId:
              state.activeWorkspaceId === workspaceId ? 'my-workspace' : state.activeWorkspaceId,
          };
        });
      },

      resetWorkspace: () => {
        const { activeWorkspaceId } = get();
        const defaultLayout = DEFAULT_WORKSPACES[activeWorkspaceId] || DEFAULT_WORKSPACES['my-workspace'];
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [activeWorkspaceId]: {
              ...defaultLayout,
              id: activeWorkspaceId,
              name: state.workspaces[activeWorkspaceId]?.name || defaultLayout.name,
            },
          },
          isResetModalOpen: false,
          isCustomizeMode: false,
        }));
      },

      addWidget: (type, customTitle) => {
        const { activeWorkspaceId, workspaces } = get();
        const currentWorkspace = workspaces[activeWorkspaceId];
        if (!currentWorkspace) return;

        const meta = WIDGET_CATALOG[type];
        const newInstance: WidgetInstance = {
          id: `w-${type.toLowerCase()}-${Date.now()}`,
          type,
          title: customTitle || meta.title,
          colSpan: meta.defaultColSpan,
          isMinimized: false,
        };

        const updatedWidgets = [newInstance, ...currentWorkspace.widgets];

        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [activeWorkspaceId]: {
              ...currentWorkspace,
              widgets: updatedWidgets,
            },
          },
        }));
      },

      removeWidget: (id) => {
        const { activeWorkspaceId, workspaces } = get();
        const currentWorkspace = workspaces[activeWorkspaceId];
        if (!currentWorkspace) return;

        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [activeWorkspaceId]: {
              ...currentWorkspace,
              widgets: currentWorkspace.widgets.filter((w) => w.id !== id),
            },
          },
        }));
      },

      reorderWidgets: (startIndex, endIndex) => {
        const { activeWorkspaceId, workspaces } = get();
        const currentWorkspace = workspaces[activeWorkspaceId];
        if (!currentWorkspace) return;

        const widgets = [...currentWorkspace.widgets];
        const [moved] = widgets.splice(startIndex, 1);
        widgets.splice(endIndex, 0, moved);

        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [activeWorkspaceId]: {
              ...currentWorkspace,
              widgets,
            },
          },
        }));
      },

      resizeWidget: (id, colSpan) => {
        const { activeWorkspaceId, workspaces } = get();
        const currentWorkspace = workspaces[activeWorkspaceId];
        if (!currentWorkspace) return;

        const clampedSpan = Math.max(1, Math.min(12, colSpan));
        const updated = currentWorkspace.widgets.map((w) =>
          w.id === id ? { ...w, colSpan: clampedSpan } : w
        );

        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [activeWorkspaceId]: {
              ...currentWorkspace,
              widgets: updated,
            },
          },
        }));
      },

      toggleMinimizeWidget: (id) => {
        const { activeWorkspaceId, workspaces } = get();
        const currentWorkspace = workspaces[activeWorkspaceId];
        if (!currentWorkspace) return;

        const updated = currentWorkspace.widgets.map((w) =>
          w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
        );

        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [activeWorkspaceId]: {
              ...currentWorkspace,
              widgets: updated,
            },
          },
        }));
      },

      updateWidgetSettings: (id, settings) => {
        const { activeWorkspaceId, workspaces } = get();
        const currentWorkspace = workspaces[activeWorkspaceId];
        if (!currentWorkspace) return;

        const updated = currentWorkspace.widgets.map((w) =>
          w.id === id ? { ...w, settings: { ...w.settings, ...settings } } : w
        );

        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [activeWorkspaceId]: {
              ...currentWorkspace,
              widgets: updated,
            },
          },
        }));
      },
    }),
    {
      name: 'marketpulse-dashboard-store-v3',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      version: 3,
      migrate: (persistedState: any) => {
        if (!persistedState || typeof persistedState !== 'object' || !persistedState.workspaces) {
          return {
            activeWorkspaceId: 'my-workspace',
            workspaces: DEFAULT_WORKSPACES,
            isSidebarCollapsed: false,
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
        workspaces: state.workspaces,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);
