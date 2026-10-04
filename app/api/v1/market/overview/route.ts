import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Attempt proxying to the local FastAPI backend
    const backendRes = await fetch('http://127.0.0.1:8000/api/v1/market/overview', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // FastAPI might be offline or starting up; proceed to fallback response
  }

  // Graceful fallback mock response
  const now = new Date().toISOString();
  return NextResponse.json({
    overview: {
      status: 'ok',
      as_of: now,
      indices: [
        {
          symbol: 'NIFTY',
          name: 'NIFTY 50',
          value: 24584.2,
          change: 142.6,
          change_percent: 0.58,
          as_of: now,
          source: 'mock',
          delayed: true,
        },
        {
          symbol: 'BANKNIFTY',
          name: 'NIFTY BANK',
          value: 52410.85,
          change: 412.3,
          change_percent: 0.79,
          as_of: now,
          source: 'mock',
          delayed: true,
        },
        {
          symbol: 'SENSEX',
          name: 'BSE SENSEX',
          value: 80436.84,
          change: 395.2,
          change_percent: 0.49,
          as_of: now,
          source: 'mock',
          delayed: true,
        },
        {
          symbol: 'INDIA VIX',
          name: 'India Volatility Index',
          value: 12.82,
          change: -0.48,
          change_percent: -3.61,
          as_of: now,
          source: 'mock',
          delayed: true,
        },
      ],
      breadth: {
        advances: 1485,
        declines: 812,
        unchanged: 98,
      },
      sectors: [
        { name: 'NIFTY AUTO', change_percent: 2.14 },
        { name: 'NIFTY METAL', change_percent: 1.62 },
        { name: 'NIFTY BANK', change_percent: 0.79 },
        { name: 'NIFTY PHARMA', change_percent: 0.45 },
        { name: 'NIFTY FMCG', change_percent: -0.12 },
        { name: 'NIFTY IT', change_percent: -0.27 },
        { name: 'NIFTY REALTY', change_percent: -1.15 },
      ],
    },
    summary: {
      advance_ratio: 1.83,
      market_tone: 'positive',
      top_sector: { name: 'NIFTY AUTO', change_percent: 2.14 },
      bottom_sector: { name: 'NIFTY REALTY', change_percent: -1.15 },
    },
  });
}
