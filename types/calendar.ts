export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  company?: string;
  symbol?: string;
  category: 'Earnings' | 'Dividend' | 'Bonus/Split' | 'AGM' | 'Macro/RBI';
  impact: 'High' | 'Medium' | 'Low';
  details: string;
}

export interface WatchlistGroup {
  id: string;
  name: string;
  symbols: string[];
}

export interface AlertRule {
  id: string;
  symbol: string;
  name: string;
  condition: 'price_above' | 'price_below' | 'change_gt' | 'volume_surge' | 'rsi_overbought' | 'rsi_oversold';
  threshold: number;
  currentValue: number;
  status: 'active' | 'triggered' | 'disabled';
  createdAt: string;
  triggeredAt?: string;
}

export interface UserTerminalSettings {
  defaultIndex: 'NIFTY 50' | 'BANK NIFTY' | 'SENSEX';
  refreshRateSeconds: number;
  aiTone: 'Concise' | 'Detailed' | 'Quantitative';
  showExtendedHours: boolean;
  dataSource: 'Demo Data Mock Engine' | 'Custom API';
  apiKey?: string;
}
