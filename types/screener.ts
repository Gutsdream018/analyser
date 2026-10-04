export interface ScreenerFilterState {
  marketCap: 'All' | 'Large Cap' | 'Mid Cap' | 'Small Cap';
  minPrice: number;
  maxPrice: number;
  minPercentChange: number;
  maxPercentChange: number;
  minVolumeMultiplier: number;
  minRsi: number;
  maxRsi: number;
  maxDistance52WHigh: number;
  sector: string;
  selectedPreset?: string;
}

export interface PresetQuery {
  id: string;
  label: string;
  description: string;
  category: string;
  filter: Partial<ScreenerFilterState>;
}
