import { CalendarEvent, WatchlistGroup, AlertRule, UserTerminalSettings } from '@/types/calendar';
import { PresetQuery } from '@/types/screener';
import { mockCalendarEvents, mockWatchlists, mockAlerts, mockScreenerPresets, defaultUserSettings } from '@/lib/mock-data/calendar';
import { getBharatStockBulkDeals } from '@/lib/bharatstock/client';

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const deals = await getBharatStockBulkDeals(5);
    if (deals && deals.length > 0) {
      const dealEvents: CalendarEvent[] = deals.map((d, idx) => ({
        id: `deal-${idx}`,
        date: d.deal_date,
        title: `${d.symbol} Bulk Deal (${d.buy_sell}) by ${d.client_name}`,
        company: d.company_name,
        symbol: d.symbol,
        category: 'Macro/RBI',
        impact: d.quantity * d.avg_price > 50000000 ? 'High' : 'Medium',
        details: `${d.client_name} executed a ${d.buy_sell} of ${d.quantity.toLocaleString('en-IN')} shares at an average execution price of ₹${d.avg_price.toFixed(2)}.`,
      }));

      return [...dealEvents, ...mockCalendarEvents];
    }
  } catch (err) {
    console.error('[getCalendarEvents] Bulk deals error, using mock:', err);
  }

  return mockCalendarEvents;
}

export async function getWatchlists(): Promise<WatchlistGroup[]> {
  return Promise.resolve(mockWatchlists);
}

export async function getAlerts(): Promise<AlertRule[]> {
  return Promise.resolve(mockAlerts);
}

export async function getScreenerPresets(): Promise<PresetQuery[]> {
  return Promise.resolve(mockScreenerPresets);
}

export async function getUserSettings(): Promise<UserTerminalSettings> {
  return Promise.resolve(defaultUserSettings);
}
