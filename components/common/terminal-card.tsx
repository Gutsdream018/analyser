import React from 'react';

interface TerminalCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function TerminalCard({
  children,
  title,
  subtitle,
  badge,
  action,
  className = '',
  bodyClassName = 'p-3.5',
}: TerminalCardProps) {
  return (
    <div className={`terminal-panel overflow-hidden ${className}`}>
      {(title || badge || action) && (
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#23262C] bg-[#111318]/90">
          <div className="flex items-center gap-2">
            {typeof title === 'string' ? (
              <h3 className="text-xs font-semibold text-[#E7E9EC] tracking-wide uppercase font-sans">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && <span className="text-[11px] text-[#868C97] font-mono">{subtitle}</span>}
            {badge}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
