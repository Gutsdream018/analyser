import React from 'react';
import { MarketDashboard } from '@/frontend/components/MarketDashboard';

export const metadata = {
  title: 'MarketPulse — Provider-to-Engine Overview',
  description: 'Normalized market data flow from provider adapters through pure market calculations into FastAPI and Next.js.',
};

export default function OverviewPage() {
  return (
    <div className="py-2">
      <MarketDashboard />
    </div>
  );
}
