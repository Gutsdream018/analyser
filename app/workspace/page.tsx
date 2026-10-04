import React from 'react';
import { WorkspaceView } from '@/components/dashboard/WorkspaceView';

export const metadata = {
  title: 'MarketPulse — Custom Modular Workspace',
  description: 'Customizable trading workspace for Indian equities, derivatives, macro and sector intelligence.',
};

export default function WorkspacePage() {
  return <WorkspaceView />;
}
