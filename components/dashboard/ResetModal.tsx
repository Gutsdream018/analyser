'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useDashboardStore, DEFAULT_WORKSPACES } from '@/store/dashboardStore';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResetModal({ isOpen, onClose }: ResetModalProps) {
  const { resetWorkspace, workspaces, activeWorkspaceId } = useDashboardStore();
  const activeWorkspace = (workspaces && workspaces[activeWorkspaceId]) || DEFAULT_WORKSPACES['my-workspace'] || {
    id: 'my-workspace',
    name: 'My Workspace',
    widgets: [],
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 bg-[#0D131D] border border-border rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Reset your workspace?</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Resetting &ldquo;{activeWorkspace.name}&rdquo;
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-[#111925] p-3 rounded border border-border/60">
          This will restore the default layout, widgets, and positions for this workspace. Any custom
          resizing, minimization, and added widgets will be reset to factory defaults.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-[#111925] hover:bg-[#152030] border border-border/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              resetWorkspace();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
