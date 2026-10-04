import { BHARATSTOCK_CONFIG } from './config';
import { loadPersistedCache, savePersistedCache } from './disk-cache';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

async function fetchFromBharatStock<T>(
  endpoint: string,
  cacheTtlMs = 180000
): Promise<T | null> {
  const cacheKey = endpoint;
  const cached = memoryCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < cacheTtlMs) {
    return cached.data as T;
  }

  // Active external requests to BharatStock are disabled to prevent leaked secrets and 429 errors.
  // The system relies on backend market endpoints and local snapshots.
  if (!BHARATSTOCK_CONFIG.baseUrl || !BHARATSTOCK_CONFIG.apiKey) {
    return cached ? (cached.data as T) : null;
  }

  // Deduplicate concurrent in-flight requests for identical endpoints
  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as T | null;
  }

  const url = `${BHARATSTOCK_CONFIG.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, {
        headers: {
          'X-API-Key': BHARATSTOCK_CONFIG.apiKey,
          Accept: 'application/json',
        },
        next: { revalidate: Math.floor(cacheTtlMs / 1000) },
      });

      if (!res.ok) {
        return cached ? (cached.data as T) : null;
      }

      const data = await res.json();
      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return data as T;
    } catch {
      return cached ? (cached.data as T) : null;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise as Promise<T | null>;
}

// -------------------------------------------------------------
// Indices API
// -------------------------------------------------------------
export interface BharatStockIndexPricePoint {
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  turnover_crores: number;
  volume: number;
}

export interface BharatStockPaginatedIndexPrices {
  data: BharatStockIndexPricePoint[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export async function getBharatStockIndexPrices(
  indexName: string,
  pageSize = 15
): Promise<BharatStockIndexPricePoint[] | null> {
  const encoded = encodeURIComponent(indexName);
  const result = await fetchFromBharatStock<BharatStockPaginatedIndexPrices>(
    `/indices/${encoded}/prices?page_size=${pageSize}`
  );

  if (result?.data && result.data.length > 0) {
    savePersistedCache({
      indices: { [indexName]: result.data },
    });
    return result.data;
  }

  // Consult persisted disk cache
  const disk = loadPersistedCache();
  if (disk.indices && disk.indices[indexName]) {
    return disk.indices[indexName] as BharatStockIndexPricePoint[];
  }

  return null;
}

// -------------------------------------------------------------
// Movers API
// -------------------------------------------------------------
export interface BharatStockMoverItem {
  symbol: string;
  company_name: string;
  trade_date: string;
  close: number;
  prev_close: number;
  change_pct: number;
  volume: number;
}

export async function getBharatStockMovers(
  category: 'gainers' | 'losers' | 'active',
  limit = 10
): Promise<BharatStockMoverItem[] | null> {
  const result = await fetchFromBharatStock<BharatStockMoverItem[]>(`/movers?category=${category}&limit=${limit}`);

  if (result && result.length > 0) {
    savePersistedCache({
      movers: { [category]: result },
    });
    return result;
  }

  const disk = loadPersistedCache();
  if (disk.movers && disk.movers[category]) {
    return disk.movers[category] as BharatStockMoverItem[];
  }

  return null;
}

// -------------------------------------------------------------
// Quotes API
// -------------------------------------------------------------
export interface BharatStockQuoteItem {
  symbol: string;
  company_name: string;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  prev_close: number;
  change_pct: number;
  volume: number;
  found: boolean;
}

export async function getBharatStockQuotes(symbols: string[]): Promise<BharatStockQuoteItem[] | null> {
  if (symbols.length === 0) return [];
  const joined = symbols.slice(0, 50).join(',');
  const result = await fetchFromBharatStock<BharatStockQuoteItem[]>(`/stocks/quotes?symbols=${encodeURIComponent(joined)}`);

  if (result && result.length > 0) {
    const quoteMap: Record<string, unknown> = {};
    result.forEach((q) => {
      quoteMap[q.symbol] = q;
    });
    savePersistedCache({ quotes: quoteMap });
    return result;
  }

  const disk = loadPersistedCache();
  if (disk.quotes) {
    const list: BharatStockQuoteItem[] = [];
    symbols.forEach((sym) => {
      if (disk.quotes && disk.quotes[sym]) {
        list.push(disk.quotes[sym] as BharatStockQuoteItem);
      }
    });
    if (list.length > 0) return list;
  }

  return null;
}

// -------------------------------------------------------------
// Screener API
// -------------------------------------------------------------
export interface BharatStockScreenerItem {
  symbol: string;
  company_name: string;
  sector: string | null;
  exchange: string;
  price: number;
  high_52w: number | null;
  low_52w: number | null;
  distance_from_52w_high_pct: number | null;
  distance_from_52w_low_pct: number | null;
  avg_volume_30d: number | null;
  price_vs_200dma_pct: number | null;
  price_vs_50dma_pct: number | null;
  return_1w: number | null;
  return_1m: number | null;
  return_3m: number | null;
  return_6m: number | null;
  return_1y: number | null;
  volatility_30d: number | null;
  market_cap: number | null;
  pe_ratio: number | null;
  pb_ratio: number | null;
  book_value_per_share: number | null;
  roe: number | null;
  roce: number | null;
  dividend_yield: number | null;
  eps: number | null;
  debt_to_equity: number | null;
  promoter_holding: number | null;
  fii_holding: number | null;
  dii_holding: number | null;
}

export interface BharatStockScreenerResponse {
  data: BharatStockScreenerItem[];
  pagination?: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export async function getBharatStockScreener(
  sortBy = 'market_cap',
  sortOrder = 'desc',
  pageSize = 50
): Promise<BharatStockScreenerItem[] | null> {
  const result = await fetchFromBharatStock<BharatStockScreenerResponse>(
    `/screener?sort_by=${sortBy}&sort_order=${sortOrder}&page_size=${pageSize}`
  );

  if (result?.data && result.data.length > 0) {
    savePersistedCache({ screener: result.data });
    return result.data;
  }

  const disk = loadPersistedCache();
  if (disk.screener && disk.screener.length > 0) {
    return disk.screener as BharatStockScreenerItem[];
  }

  return null;
}

// -------------------------------------------------------------
// Stock Detail API
// -------------------------------------------------------------
export interface BharatStockStockDetail {
  symbol: string;
  isin: string;
  company_name: string;
  sector: string | null;
  exchange: string;
  is_active: boolean;
  market_cap: number | null;
  market_cap_rank: number | null;
  industry: string | null;
  listing_date: string | null;
  face_value: number | null;
  latest_price: {
    trade_date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    prev_close: number;
    volume: number;
  } | null;
  metrics: {
    price: number;
    high_52w: number;
    low_52w: number;
    distance_from_52w_high_pct: number;
    distance_from_52w_low_pct: number;
    avg_volume_30d: number;
    price_vs_200dma_pct: number;
    price_vs_50dma_pct: number;
    return_1w: number;
    return_1m: number;
    return_3m: number;
    return_6m: number;
    return_1y: number;
    volatility_30d: number;
  } | null;
}

export async function getBharatStockStockDetail(ticker: string): Promise<BharatStockStockDetail | null> {
  return fetchFromBharatStock<BharatStockStockDetail>(`/stocks/${encodeURIComponent(ticker)}`);
}

// -------------------------------------------------------------
// Stock Historical Prices API
// -------------------------------------------------------------
export interface BharatStockPricePoint {
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  prev_close: number;
  volume: number;
  turnover_lakhs?: number;
  num_trades?: number;
  adjusted_close?: number;
}

export interface BharatStockPaginatedPrices {
  data: BharatStockPricePoint[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export async function getBharatStockPrices(ticker: string, pageSize = 60): Promise<BharatStockPricePoint[] | null> {
  const res = await fetchFromBharatStock<BharatStockPaginatedPrices>(
    `/stocks/${encodeURIComponent(ticker)}/prices?page_size=${pageSize}`
  );
  return res?.data ?? null;
}

// -------------------------------------------------------------
// Technical Indicators API
// -------------------------------------------------------------
export interface BharatStockTechnicalPoint {
  trade_date: string;
  close: number;
  sma: number | null;
  ema: number | null;
  rsi: number | null;
  macd: number | null;
  macd_signal: number | null;
  macd_histogram: number | null;
}

export interface BharatStockTechnicalResponse {
  data: BharatStockTechnicalPoint[];
}

export async function getBharatStockTechnicalIndicators(
  ticker: string,
  pageSize = 10
): Promise<BharatStockTechnicalPoint[] | null> {
  const res = await fetchFromBharatStock<BharatStockTechnicalResponse>(
    `/stocks/${encodeURIComponent(ticker)}/technical-indicators?page_size=${pageSize}`
  );
  return res?.data ?? null;
}

// -------------------------------------------------------------
// Stock Ratios API
// -------------------------------------------------------------
export interface BharatStockRatios {
  as_of_date: string;
  price: number;
  market_cap: number;
  shares_outstanding: number;
  pe_ratio: number;
  pb_ratio: number;
  book_value_per_share: number;
  eps: number;
  roe: number;
  roce: number;
  dividend_yield: number;
  face_value: number;
  week_52_high: number;
  week_52_low: number;
}

export async function getBharatStockRatios(ticker: string): Promise<BharatStockRatios | null> {
  return fetchFromBharatStock<BharatStockRatios>(`/stocks/${encodeURIComponent(ticker)}/ratios`);
}

// -------------------------------------------------------------
// Corporate Actions API
// -------------------------------------------------------------
export interface BharatStockCorporateAction {
  action_type: string;
  subject: string;
  ex_date: string;
  record_date: string | null;
  dividend_per_share: number | null;
  face_value: number | null;
}

export interface BharatStockCorporateActionsResponse {
  data: BharatStockCorporateAction[];
}

export async function getBharatStockCorporateActions(ticker: string): Promise<BharatStockCorporateAction[] | null> {
  const res = await fetchFromBharatStock<BharatStockCorporateActionsResponse>(
    `/stocks/${encodeURIComponent(ticker)}/corporate-actions`
  );
  return res?.data ?? null;
}

// -------------------------------------------------------------
// FII / DII Flows API
// -------------------------------------------------------------
export interface BharatStockFiiDiiDay {
  date: string;
  fii_buy: number;
  fii_sell: number;
  fii_net: number;
  dii_buy: number;
  dii_sell: number;
  dii_net: number;
}

export interface BharatStockFiiDiiResponse {
  from: string;
  to: string;
  count: number;
  data: BharatStockFiiDiiDay[];
}

export async function getBharatStockFiiDii(): Promise<BharatStockFiiDiiDay[] | null> {
  const res = await fetchFromBharatStock<BharatStockFiiDiiResponse>('/market/fii-dii');

  if (res?.data && res.data.length > 0) {
    savePersistedCache({ fiiDii: res.data });
    return res.data;
  }

  const disk = loadPersistedCache();
  if (disk.fiiDii && disk.fiiDii.length > 0) {
    return disk.fiiDii as BharatStockFiiDiiDay[];
  }

  return null;
}

// -------------------------------------------------------------
// Bulk Deals API
// -------------------------------------------------------------
export interface BharatStockBulkDeal {
  deal_date: string;
  client_name: string;
  buy_sell: 'BUY' | 'SELL';
  quantity: number;
  avg_price: number;
  remarks: string | null;
  symbol: string;
  company_name: string;
}

export interface BharatStockBulkDealsResponse {
  data: BharatStockBulkDeal[];
}

export async function getBharatStockBulkDeals(pageSize = 10): Promise<BharatStockBulkDeal[] | null> {
  const res = await fetchFromBharatStock<BharatStockBulkDealsResponse>(`/deals/bulk?page_size=${pageSize}`);
  return res?.data ?? null;
}
