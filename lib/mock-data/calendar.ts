import { CalendarEvent, WatchlistGroup, AlertRule, UserTerminalSettings } from '@/types/calendar';
import { PresetQuery } from '@/types/screener';

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    date: '01 Oct 2026',
    title: 'Monthly Auto & Cement Dispatch Numbers',
    category: 'Macro/RBI',
    impact: 'High',
    details: 'Automakers (Maruti, Tata Motors, M&M, Bajaj Auto) report wholesale vehicle deliveries for September.',
  },
  {
    id: 'evt-2',
    date: '04 Oct 2026',
    title: 'RBI Monetary Policy Committee (MPC) Resolution',
    category: 'Macro/RBI',
    impact: 'High',
    details: 'Governor address and repo rate decision; liquidity management framework announcement.',
  },
  {
    id: 'evt-3',
    date: '10 Oct 2026',
    title: 'TCS Q2 FY27 Earnings & Second Interim Dividend',
    company: 'Tata Consultancy Services',
    symbol: 'TCS',
    category: 'Earnings',
    impact: 'High',
    details: 'Board meeting to approve standalone and consolidated Q2 financial results and declaration of dividend.',
  },
  {
    id: 'evt-4',
    date: '17 Oct 2026',
    title: 'Infosys Q2 FY27 Financial Results & Guidance',
    company: 'Infosys Ltd',
    symbol: 'INFY',
    category: 'Earnings',
    impact: 'High',
    details: 'Quarterly financial report and potential revision to constant-currency annual revenue growth guidance.',
  },
  {
    id: 'evt-5',
    date: '19 Oct 2026',
    title: 'HDFC Bank Q2 FY27 Financial Statements',
    company: 'HDFC Bank Ltd',
    symbol: 'HDFCBANK',
    category: 'Earnings',
    impact: 'High',
    details: 'Key monitorables: Deposit accretion velocity, NIM stability, and gross NPA movement.',
  },
  {
    id: 'evt-6',
    date: '24 Oct 2026',
    title: 'Reliance Industries Q2 Results Announcement',
    company: 'Reliance Industries',
    symbol: 'RELIANCE',
    category: 'Earnings',
    impact: 'High',
    details: 'Consolidated performance review across O2C, Jio Infocomm, and Reliance Retail arms.',
  },
  {
    id: 'evt-7',
    date: '06 Nov 2026',
    title: 'Tata Steel Port Talbot Transition Review Meeting',
    company: 'Tata Steel',
    symbol: 'TATASTEEL',
    category: 'AGM',
    impact: 'Medium',
    details: 'Stakeholder meeting on EAF equipment procurement timelines and decarbonization roadmap.',
  },
];

export const mockWatchlists: WatchlistGroup[] = [
  {
    id: 'wl-1',
    name: 'Core Portfolio',
    symbols: ['RELIANCE', 'HDFCBANK', 'TCS', 'ICICIBANK', 'BHARTIARTL'],
  },
  {
    id: 'wl-2',
    name: 'F&O Momentum Watch',
    symbols: ['TATAMOTORS', 'M&M', 'TATASTEEL', 'BAJFINANCE', 'DLF'],
  },
  {
    id: 'wl-3',
    name: 'Value Candidates',
    symbols: ['INFY', 'SUNPHARMA', 'DLF'],
  },
];

export const mockAlerts: AlertRule[] = [
  {
    id: 'alt-1',
    symbol: 'NIFTY 50',
    name: 'Nifty Resistance Breakout',
    condition: 'price_above',
    threshold: 24650,
    currentValue: 24584.20,
    status: 'active',
    createdAt: '25 Sep 2026',
  },
  {
    id: 'alt-2',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Psychological Hurdle',
    condition: 'price_above',
    threshold: 1700,
    currentValue: 1678.90,
    status: 'active',
    createdAt: '26 Sep 2026',
  },
  {
    id: 'alt-3',
    symbol: 'INDIA VIX',
    name: 'Volatility Compression Alert',
    condition: 'price_below',
    threshold: 12.50,
    currentValue: 12.82,
    status: 'active',
    createdAt: '27 Sep 2026',
  },
  {
    id: 'alt-4',
    symbol: 'M&M',
    name: 'RSI Overbought Warning',
    condition: 'rsi_overbought',
    threshold: 70,
    currentValue: 72.1,
    status: 'triggered',
    createdAt: '22 Sep 2026',
    triggeredAt: '28 Sep 2026 14:15 IST',
  },
];

export const mockScreenerPresets: PresetQuery[] = [
  {
    id: 'preset-1',
    label: 'Unusual Volume Surges',
    description: 'Stocks with today’s volume exceeding 1.5x of their 20-day historical average volume.',
    category: 'Volume & Activity',
    filter: {
      minVolumeMultiplier: 1.4,
    },
  },
  {
    id: 'preset-2',
    label: 'Strong Momentum (RSI > 60)',
    description: 'Equities showing strong bullish momentum with RSI(14) above 60 and trading above 20 DMA.',
    category: 'Technicals',
    filter: {
      minRsi: 60,
    },
  },
  {
    id: 'preset-3',
    label: 'Near 52-Week High Breakout',
    description: 'Companies trading within 5% of their 52-week all-time highs with positive day momentum.',
    category: 'Breakout',
    filter: {
      maxDistance52WHigh: 5.0,
      minPercentChange: 0.1,
    },
  },
  {
    id: 'preset-4',
    label: 'Large Cap Movers',
    description: 'Bluechip Large Cap stocks (> ₹20,000 Cr market cap) moving more than ±1% today.',
    category: 'Market Cap',
    filter: {
      marketCap: 'Large Cap',
      minPercentChange: 1.0,
    },
  },
  {
    id: 'preset-5',
    label: 'Oversold Pullback Candidates',
    description: 'Stocks trading at lower RSI levels (< 45) offering potential mean-reversion watch setups.',
    category: 'Mean Reversion',
    filter: {
      maxRsi: 45,
    },
  },
];

export const defaultUserSettings: UserTerminalSettings = {
  defaultIndex: 'NIFTY 50',
  refreshRateSeconds: 5,
  aiTone: 'Quantitative',
  showExtendedHours: true,
  dataSource: 'Demo Data Mock Engine',
};
