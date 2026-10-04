import { create } from 'zustand';
import { MarketIndex, MarketBreadth, SectorPerformance, GlobalMarket, CommodityOrCurrency } from '@/types/market';
import { StockDetails } from '@/types/stock';
import { FnoSnapshot, OptionChain } from '@/types/fno';
import { NewsArticle } from '@/types/news';
import { AiDailyBrief } from '@/types/analysis';
import { CalendarEvent, AlertRule } from '@/types/calendar';

import { getMarketIndices, getMarketBreadth, getSectorHeatmap } from '@/lib/api/market';
import { getAllStocks, getTopMovers, getHistoricalCandles } from '@/lib/api/stocks';
import { getGlobalMarkets, getCommoditiesAndCurrencies, getFiiDiiData } from '@/lib/api/macro';
import { getFnoSnapshot, getOptionChain } from '@/lib/api/fno';
import { getNewsArticles } from '@/lib/api/news';
import { getAiDailyBrief } from '@/lib/api/analysis';
import { getCalendarEvents, getAlerts } from '@/lib/api/calendar';

export type IndianMarketSession = 'LIVE' | 'PRE-MARKET' | 'POST-MARKET' | 'MARKET CLOSED';

export interface MarketState {
  // Session & Status
  marketSession: IndianMarketSession;
  istTimeFormatted: string;
  lastUpdatedFormatted: string;
  isLoading: boolean;
  isInitialLoaded: boolean;
  error: string | null;

  // Data
  indices: MarketIndex[];
  breadth: MarketBreadth;
  sectors: SectorPerformance[];
  stocks: StockDetails[];
  topMovers: {
    gainers: StockDetails[];
    losers: StockDetails[];
    volumeShockers: StockDetails[];
  };
  fiiDii: { date: string; fiiNet: number; diiNet: number }[];
  globalMarkets: GlobalMarket[];
  commodities: CommodityOrCurrency[];
  news: NewsArticle[];
  fnoSnapshot: FnoSnapshot | null;
  optionChain: OptionChain | null;
  aiBrief: AiDailyBrief | null;
  calendarEvents: CalendarEvent[];
  alerts: AlertRule[];

  // Candles cache by symbol+timeframe
  candlesCache: Record<string, { time: string; open: number; high: number; low: number; close: number; volume: number }[]>;

  // Actions
  refreshAllData: () => Promise<void>;
  fetchCandles: (symbol: string, timeframe?: string) => Promise<{ time: string; open: number; high: number; low: number; close: number; volume: number }[]>;
  updateMarketSession: () => void;
}

export function computeIndianMarketStatus(): { session: IndianMarketSession; timeStr: string } {
  const now = new Date();

  // Robustly extract IST time components regardless of local machine timezone
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    weekday: 'short',
  });

  const parts = formatter.formatToParts(now);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  const hours = parseInt(partMap.hour, 10) || 0;
  const minutes = parseInt(partMap.minute, 10) || 0;
  const seconds = parseInt(partMap.second, 10) || 0;
  const weekday = partMap.weekday || '';
  const totalMinutes = hours * 60 + minutes;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} IST`;

  // Weekends: Saturday and Sunday
  if (weekday === 'Sat' || weekday === 'Sun') {
    return { session: 'MARKET CLOSED', timeStr };
  }

  // 09:00 to 09:15: Pre-market
  if (totalMinutes >= 540 && totalMinutes < 555) {
    return { session: 'PRE-MARKET', timeStr };
  }

  // 09:15 to 15:30: Live Trading Session
  if (totalMinutes >= 555 && totalMinutes <= 930) {
    return { session: 'LIVE', timeStr };
  }

  // 15:30 to 16:00: Post-market closing
  if (totalMinutes > 930 && totalMinutes < 960) {
    return { session: 'POST-MARKET', timeStr };
  }

  // Outside operating hours
  return { session: 'MARKET CLOSED', timeStr };
}

let inFlightFetchPromise: Promise<void> | null = null;

const initialStatus = computeIndianMarketStatus();

export const useMarketStore = create<MarketState>((set, get) => ({
  marketSession: initialStatus.session,
  istTimeFormatted: initialStatus.timeStr,
  lastUpdatedFormatted: 'Just now',
  isLoading: false,
  isInitialLoaded: false,
  error: null,

  indices: [],
  breadth: {
    advances: 1485,
    declines: 812,
    unchanged: 98,
    advanceDeclineRatio: 1.83,
    totalTraded: 2395,
    nifty50Advances: 32,
    nifty50Declines: 18,
  },
  sectors: [],
  stocks: [],
  topMovers: { gainers: [], losers: [], volumeShockers: [] },
  fiiDii: [],
  globalMarkets: [],
  commodities: [],
  news: [],
  fnoSnapshot: null,
  optionChain: null,
  aiBrief: null,
  calendarEvents: [],
  alerts: [],
  candlesCache: {},

  updateMarketSession: () => {
    const { session, timeStr } = computeIndianMarketStatus();
    set({ marketSession: session, istTimeFormatted: timeStr });
  },

  refreshAllData: async () => {
    // Request deduplication: if a refresh is already in-flight, reuse it
    if (inFlightFetchPromise) {
      return inFlightFetchPromise;
    }

    set({ isLoading: true, error: null });

    inFlightFetchPromise = (async () => {
      try {
        const { session, timeStr } = computeIndianMarketStatus();

        const results = await Promise.allSettled([
          getMarketIndices(),
          getMarketBreadth(),
          getSectorHeatmap(),
          getAllStocks(),
          getTopMovers(),
          getFiiDiiData(),
          getGlobalMarkets(),
          getCommoditiesAndCurrencies(),
          getNewsArticles('All'),
          getFnoSnapshot(),
          getOptionChain('NIFTY 50'),
          getCalendarEvents(),
          getAlerts(),
        ]);

        const current = get();
        const val = <T>(res: PromiseSettledResult<T>, fallback: T): T =>
          res.status === 'fulfilled' && res.value !== undefined && res.value !== null ? res.value : fallback;

        const indicesData = val(results[0], current.indices);
        const breadthData = val(results[1], current.breadth);
        const sectorsData = val(results[2], current.sectors);
        const stocksData = val(results[3], current.stocks);
        const moversData = val(results[4], current.topMovers);
        const fiiDiiData = val(results[5], current.fiiDii);
        const globalsData = val(results[6], current.globalMarkets);
        const commoditiesData = val(results[7], current.commodities);
        const newsData = val(results[8], current.news);
        const fnoSnapData = val(results[9], current.fnoSnapshot);
        const optChainData = val(results[10], current.optionChain);
        const calendarData = val(results[11], current.calendarEvents);
        const alertsData = val(results[12], current.alerts);

        // Derive dynamic AI Daily Brief using already fetched indices, fiiDii, and stocks
        const aiBriefData = await getAiDailyBrief({
          indices: indicesData,
          fiiDii: fiiDiiData,
          stocks: stocksData,
        });

        const nowFormatted = new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }) + ' IST';

        set({
          marketSession: session,
          istTimeFormatted: timeStr,
          lastUpdatedFormatted: nowFormatted,
          indices: indicesData,
          breadth: breadthData,
          sectors: sectorsData,
          stocks: stocksData,
          topMovers: moversData,
          fiiDii: fiiDiiData,
          globalMarkets: globalsData,
          commodities: commoditiesData,
          news: newsData,
          fnoSnapshot: fnoSnapData,
          optionChain: optChainData,
          aiBrief: aiBriefData,
          calendarEvents: calendarData,
          alerts: alertsData,
          isInitialLoaded: true,
          isLoading: false,
          error: null,
        });
      } catch (err: unknown) {
        console.error('[useMarketStore] Failed to refresh market data:', err);
        set({
          isLoading: false,
          error: 'Market data feed momentarily delayed. Displaying latest valid snapshot.',
        });
      } finally {
        inFlightFetchPromise = null;
      }
    })();

    return inFlightFetchPromise;
  },

  fetchCandles: async (symbol: string, timeframe = '1D') => {
    const key = `${symbol.toUpperCase()}-${timeframe}`;
    const cache = get().candlesCache;

    if (cache[key] && cache[key].length > 0) {
      return cache[key];
    }

    try {
      const candles = await getHistoricalCandles(symbol, timeframe);
      set((state) => ({
        candlesCache: { ...state.candlesCache, [key]: candles },
      }));
      return candles;
    } catch (err) {
      console.error(`[useMarketStore] Failed to fetch candles for ${symbol}:`, err);
      return [];
    }
  },
}));
