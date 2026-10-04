import { GlobalMarket, CommodityOrCurrency } from '@/types/market';

export const mockGlobalMarkets: GlobalMarket[] = [
  { symbol: 'GIFT NIFTY', name: 'Gift Nifty Futures', region: 'SGX/NSE IX', value: 24690.50, change: 106.00, percentChange: 0.43, isOpen: true },
  { symbol: 'DOW JONES', name: 'Dow Jones Ind. Avg', region: 'US', value: 42124.65, change: 137.89, percentChange: 0.33, isOpen: false },
  { symbol: 'S&P 500', name: 'S&P 500 Index', region: 'US', value: 5738.17, change: 9.20, percentChange: 0.16, isOpen: false },
  { symbol: 'NASDAQ', name: 'Nasdaq Composite', region: 'US', value: 18137.85, change: -24.40, percentChange: -0.13, isOpen: false },
  { symbol: 'NIKKEI 225', name: 'Nikkei 225', region: 'Japan', value: 39829.56, change: 903.93, percentChange: 2.32, isOpen: true },
  { symbol: 'HANG SENG', name: 'Hang Seng Index', region: 'Hong Kong', value: 20632.30, change: 707.72, percentChange: 3.55, isOpen: true },
  { symbol: 'FTSE 100', name: 'FTSE 100', region: 'UK', value: 8320.72, change: 36.45, percentChange: 0.44, isOpen: false },
  { symbol: 'DAX', name: 'DAX Performance', region: 'Germany', value: 19473.63, change: 235.10, percentChange: 1.22, isOpen: false },
];

export const mockCommoditiesAndCurrencies: CommodityOrCurrency[] = [
  { symbol: 'BRENT', name: 'Brent Crude Oil', type: 'commodity', value: 71.85, change: -1.24, percentChange: -1.70, unit: '$/bbl' },
  { symbol: 'GOLD', name: 'Gold (MCX)', type: 'commodity', value: 75620, change: 240, percentChange: 0.32, unit: '₹/10g' },
  { symbol: 'SILVER', name: 'Silver (MCX)', type: 'commodity', value: 92840, change: 680, percentChange: 0.74, unit: '₹/kg' },
  { symbol: 'NATGAS', name: 'Natural Gas', type: 'commodity', value: 242.30, change: 4.80, percentChange: 2.02, unit: '₹/mmBtu' },
  { symbol: 'USD/INR', name: 'US Dollar / Indian Rupee', type: 'currency', value: 83.68, change: -0.06, percentChange: -0.07, unit: 'INR' },
  { symbol: 'EUR/INR', name: 'Euro / Indian Rupee', type: 'currency', value: 93.45, change: 0.12, percentChange: 0.13, unit: 'INR' },
  { symbol: 'GBP/INR', name: 'British Pound / INR', type: 'currency', value: 111.82, change: 0.28, percentChange: 0.25, unit: 'INR' },
  { symbol: 'US 10Y', name: 'US 10-Year Treasury Yield', type: 'commodity', value: 3.78, change: -0.03, percentChange: -0.79, unit: '%' },
];

export const mockFiiDiiData = [
  { date: '12 Sep', fiiNet: -1420.5, diiNet: 1845.2 },
  { date: '13 Sep', fiiNet: 340.2, diiNet: 920.4 },
  { date: '16 Sep', fiiNet: -890.1, diiNet: 1450.0 },
  { date: '17 Sep', fiiNet: 480.3, diiNet: 610.8 },
  { date: '18 Sep', fiiNet: 1150.4, diiNet: -210.5 },
  { date: '19 Sep', fiiNet: 680.0, diiNet: 840.2 },
  { date: '20 Sep', fiiNet: 1420.9, diiNet: 1210.0 },
  { date: '23 Sep', fiiNet: 890.2, diiNet: 410.6 },
  { date: '24 Sep', fiiNet: -410.0, diiNet: 1680.5 },
  { date: '25 Sep', fiiNet: 970.6, diiNet: 540.2 },
  { date: '26 Sep', fiiNet: 1840.8, diiNet: 790.1 },
  { date: '27 Sep', fiiNet: 1285.4, diiNet: 852.7 },
];
