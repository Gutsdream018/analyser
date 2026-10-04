import React from 'react';
import { InstitutionalDashboard } from '@/components/dashboard/InstitutionalDashboard';

export const metadata = {
  title: 'MarketPulse — Institutional Indian Market Intelligence Terminal',
  description: 'Understand the Indian stock market in 60 seconds with institutional intelligence, key benchmarks, derivatives, and macro context.',
};

export default function DashboardPage() {
  return <InstitutionalDashboard />;
}
