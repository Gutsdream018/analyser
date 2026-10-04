export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  timestamp: string;
  category: 'All' | 'Corporate' | 'Earnings' | 'Macro' | 'Sector';
  impact: 'High' | 'Medium' | 'Low';
  relatedSymbols: string[];
  summary: string;
  url?: string;
}

export interface MarketContextItem {
  id: string;
  title: string;
  impactLevel: 'High' | 'Medium';
  affectedSectors: string[];
  summary: string;
}
