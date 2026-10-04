export interface IndexQuote {
  symbol: string;
  name: string;
  value: number;
  change: number;
  change_percent: number;
  as_of: string;
  source: string;
  delayed: boolean;
}

export interface Breadth {
  advances: number;
  declines: number;
  unchanged: number;
}

export interface SectorPerformance {
  name: string;
  change_percent: number;
}

export interface MarketOverview {
  status: string;
  as_of: string;
  indices: IndexQuote[];
  breadth: Breadth;
  sectors: SectorPerformance[];
}

export interface MarketSummary {
  advance_ratio: number;
  market_tone: 'positive' | 'mixed' | 'negative';
  top_sector: SectorPerformance | null;
  bottom_sector: SectorPerformance | null;
}

export interface MarketOverviewResponse {
  overview: MarketOverview;
  summary: MarketSummary;
}
