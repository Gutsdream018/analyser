export interface MarketIndex {
  symbol: string;
  name: string;
  current: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  sparkline: number[];
  timestamp: string;
}

export interface MarketBreadth {
  advances: number;
  declines: number;
  unchanged: number;
  advanceDeclineRatio: number;
  totalTraded: number;
  nifty50Advances: number;
  nifty50Declines: number;
}

export interface SectorPerformance {
  sector: string;
  name: string;
  change: number;
  pe: number;
  weight: number;
  marketCapCr: number;
  topContributor: string;
  contributorContribution: number;
  status: 'bullish' | 'bearish' | 'neutral';
}

export interface GlobalMarket {
  symbol: string;
  name: string;
  region: string;
  value: number;
  change: number;
  percentChange: number;
  isOpen: boolean;
}

export interface CommodityOrCurrency {
  symbol: string;
  name: string;
  type: 'commodity' | 'currency';
  value: number;
  change: number;
  percentChange: number;
  unit: string;
}
