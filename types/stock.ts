export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  avgVolume20D: number;
  volumeMultiplier: number;
  high: number;
  low: number;
  open: number;
  close: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  distanceFrom52WHigh: number;
  marketCapCr: number;
  pe: number;
  sector: string;
  capCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap';
  sparkline: number[];
}

export interface TechnicalSnapshot {
  rsi14: number;
  rsiZone: 'Overbought' | 'Oversold' | 'Neutral';
  dma20: number;
  dma50: number;
  dma200: number;
  distDma20: number;
  distDma50: number;
  distDma200: number;
  macdStatus: 'Bullish Crossover' | 'Bearish Crossover' | 'Neutral';
  macdValue: number;
  macdSignal: number;
  historicalVolatility: number;
  beta20D: number;
  vwap: number;
}

export interface FundamentalData {
  pb: number;
  eps: number;
  dividendYield: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  sectorPe: number;
  faceValue: number;
  freeFloatMarketCapCr: number;
}

export interface StockDetails extends StockQuote {
  technicals: TechnicalSnapshot;
  fundamentals: FundamentalData;
  aiSummary: {
    catalyst: string;
    riskFactor: string;
    keyLevels: {
      support1: number;
      support2: number;
      resistance1: number;
      resistance2: number;
    };
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  };
  upcomingEvents: {
    title: string;
    date: string;
    type: 'Earnings' | 'Dividend' | 'AGM' | 'Board Meeting';
  }[];
}
