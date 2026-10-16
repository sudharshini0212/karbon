import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { DemoDataBadge } from './DemoDataBadge.tsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral'; // note: in emissions, negative change is good (reduction)!
  subtitle?: string;
  icon?: React.ElementType;
  isDemo?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  changeType = 'neutral',
  subtitle,
  icon: Icon,
  isDemo = true,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-xs">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {isDemo && <DemoDataBadge label="Demo" />}
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700/60 group-hover:scale-105 transition-transform">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
      </div>

      {(change || subtitle) && (
        <div className="flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded text-[11px] ${
                changeType === 'positive'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' // good: reduction
                  : changeType === 'negative'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800/60' // increase in emissions
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {changeType === 'positive' && <ArrowDownRight className="w-3 h-3" />}
              {changeType === 'negative' && <ArrowUpRight className="w-3 h-3" />}
              {changeType === 'neutral' && <Minus className="w-3 h-3" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400 text-[11px] truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
