import { OptionChain, FnoSnapshot, FnoBuildUp } from '@/types/fno';
import { mockOptionChainNifty, mockFnoSnapshot, mockFnoBuildUps } from '@/lib/mock-data/fno';

/**
 * 3. Priority 4 in Real API migration: F&O Derivatives & Option Chains
 */
export async function getOptionChain(_symbol: string = 'NIFTY 50'): Promise<OptionChain> {
  return Promise.resolve(mockOptionChainNifty);
}

export async function getFnoSnapshot(): Promise<FnoSnapshot> {
  return Promise.resolve(mockFnoSnapshot);
}

export async function getFnoBuildUps(): Promise<FnoBuildUp[]> {
  return Promise.resolve(mockFnoBuildUps);
}
