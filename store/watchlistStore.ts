import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WatchlistStockItem {
  symbol: string;
  name: string;
  addedAt: string;
}

const DEFAULT_WATCHLIST_SYMBOLS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'INFY', name: 'Infosys Ltd' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd' },
];

interface WatchlistState {
  symbols: string[];
  maxDisplayCount: number;
  addStock: (symbol: string) => void;
  removeStock: (symbol: string) => void;
  setMaxDisplayCount: (count: number) => void;
  resetDefaultWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      symbols: DEFAULT_WATCHLIST_SYMBOLS.map((s) => s.symbol),
      maxDisplayCount: 6,

      addStock: (symbol) => {
        const normalized = symbol.trim().toUpperCase();
        set((state) => {
          if (state.symbols.includes(normalized)) return state;
          return { symbols: [normalized, ...state.symbols] };
        });
      },

      removeStock: (symbol) => {
        const normalized = symbol.trim().toUpperCase();
        set((state) => ({
          symbols: state.symbols.filter((s) => s !== normalized),
        }));
      },

      setMaxDisplayCount: (count) => set({ maxDisplayCount: count }),

      resetDefaultWatchlist: () =>
        set({
          symbols: DEFAULT_WATCHLIST_SYMBOLS.map((s) => s.symbol),
          maxDisplayCount: 6,
        }),
    }),
    {
      name: 'marketpulse-watchlist-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
