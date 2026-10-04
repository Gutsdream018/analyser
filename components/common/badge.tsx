import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'demo' | 'pos' | 'neg' | 'neutral' | 'accent' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variantStyles = {
    demo: 'bg-[#FF2E51]/10 text-[#FF2E51] border border-[#FF2E51]/30 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 font-semibold',
    pos: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 font-mono text-xs px-1.5 py-0.5',
    neg: 'bg-[#FF2E51]/10 text-[#FF2E51] border border-[#FF2E51]/25 font-mono text-xs px-1.5 py-0.5',
    accent: 'bg-[#FF2E51]/15 text-[#FF2E51] border border-[#FF2E51]/30 font-mono text-xs px-1.5 py-0.5',
    neutral: 'bg-[#0C070A] text-[#E7E9EC] border border-[#241117] text-xs px-2 py-0.5',
    muted: 'bg-[#030407] text-[#868C97] border border-[#241117] text-xs px-1.5 py-0.5',
  };

  return (
    <span className={`inline-flex items-center rounded-[3px] select-none ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function DemoDataBadge({ className = '' }: { className?: string }) {
  return (
    <Badge variant="demo" className={`shadow-sm ${className}`}>
      DEMO DATA
    </Badge>
  );
}
