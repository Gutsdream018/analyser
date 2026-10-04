import { NewsArticle, MarketContextItem } from '@/types/news';
import { mockNewsArticles, mockMarketContextItems } from '@/lib/mock-data/news';

export async function getNewsArticles(category: string = 'All'): Promise<NewsArticle[]> {
  if (category === 'All') return Promise.resolve(mockNewsArticles);
  return Promise.resolve(mockNewsArticles.filter((item) => item.category.toLowerCase() === category.toLowerCase()));
}

export async function getMarketContext(): Promise<MarketContextItem[]> {
  return Promise.resolve(mockMarketContextItems);
}
