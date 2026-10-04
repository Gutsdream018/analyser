import { GlobalMarket, CommodityOrCurrency } from '@/types/market';
import { mockGlobalMarkets, mockCommoditiesAndCurrencies, mockFiiDiiData } from '@/lib/mock-data/macro';
import { getBharatStockFiiDii } from '@/lib/bharatstock/client';

export async function getGlobalMarkets(): Promise<GlobalMarket[]> {
  return Promise.resolve(mockGlobalMarkets);
}

export async function getCommoditiesAndCurrencies(): Promise<CommodityOrCurrency[]> {
  return Promise.resolve(mockCommoditiesAndCurrencies);
}

function formatDateToShort(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${parseInt(parts[2], 10)} ${months[monthIdx] || parts[1]}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export async function getFiiDiiData(): Promise<{ date: string; fiiNet: number; diiNet: number }[]> {
  try {
    const days = await getBharatStockFiiDii();
    if (days && days.length > 0) {
      // BharatStock returns latest first, take recent 12 days and reverse to chronological
      return days
        .slice(0, 12)
        .reverse()
        .map((d) => ({
          date: formatDateToShort(d.date),
          fiiNet: Math.round(d.fii_net * 10) / 10,
          diiNet: Math.round(d.dii_net * 10) / 10,
        }));
    }
  } catch (err) {
    console.error('[getFiiDiiData] BharatStock error, using fallback:', err);
  }

  return mockFiiDiiData;
}
