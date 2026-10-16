import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';

interface DemoDataBadgeProps {
  label?: string;
  subtext?: string;
  variant?: 'subtle' | 'banner';
}

export const DemoDataBadge: React.FC<DemoDataBadgeProps> = ({
  label = 'Demo Data',
  subtext = 'Periodic operational records for demonstration. Not actual certified mine readings.',
  variant = 'subtle',
}) => {
  if (variant === 'banner') {
    return (
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg px-4 py-2.5 text-xs text-amber-300 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-200 uppercase tracking-wide mr-1.5">
              [ {label} ]
            </strong>
            {subtext}
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-400/80 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/20">
          <FileText className="w-3 h-3" /> Manual Logbook Entry
        </span>
      </div>
    );
  }

  return (
    <span
      title="Demo Data: Periodic operational records for demonstration"
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 tracking-tight"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
      {label}
    </span>
  );
};
