import { MarketOverviewResponse } from './types';

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    // If accessed via LAN IP or hostname other than localhost
    const host = window.location.hostname;
    return `http://${host}:8000/api/v1`;
  }
  return 'http://127.0.0.1:8000/api/v1';
}

export async function fetchMarketOverview(): Promise<MarketOverviewResponse> {
  // Try Next.js route handler proxy first (handles backend proxy & graceful fallback server-side)
  try {
    const res = await fetch('/api/v1/market/overview', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      return (await res.json()) as MarketOverviewResponse;
    }
  } catch (proxyErr) {
    console.warn('[MarketPulse API] Relative proxy endpoint failed, attempting direct call:', proxyErr);
  }

  // Direct backend call as fallback if running standalone
  const primaryUrl = `${getApiBaseUrl()}/market/overview`;
  try {
    const res = await fetch(primaryUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      return (await res.json()) as MarketOverviewResponse;
    }
  } catch (directErr) {
    console.error('[MarketPulse API] Direct call failed:', directErr);
  }

  throw new Error(
    'Unable to connect to MarketPulse API server. Ensure the service is running.'
  );
}
