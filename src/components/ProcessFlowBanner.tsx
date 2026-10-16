import React from 'react';
import { PageTab } from '../types/karbon.ts';

interface ProcessFlowBannerProps {
  currentTab?: PageTab;
  onNavigate?: (tab: PageTab) => void;
}

export const ProcessFlowBanner: React.FC<ProcessFlowBannerProps> = ({
  currentTab,
  onNavigate,
}) => {
  const steps: { number: string; title: string; tab: PageTab }[] = [
    { number: '01', title: 'Measure', tab: 'activity-entry' },
    { number: '02', title: 'Calculate', tab: 'calculation' },
    { number: '03', title: 'Analyse', tab: 'analysis' },
    { number: '04', title: 'Identify Hotspots', tab: 'analysis' },
    { number: '05', title: 'Set Targets', tab: 'targets' },
    { number: '06', title: 'Reduce', tab: 'simulator' },
    { number: '07', title: 'Monitor', tab: 'progress' },
    { number: '08', title: 'Neutralize', tab: 'roadmap' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
        <span className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
          Decarbonization Workflow
        </span>
        <span className="text-[11px] text-slate-400">
          Measure • Understand • Simulate • Reduce • Track • Neutralize
        </span>
      </div>

      {/* Responsive Grid Stepper: 2 cols on mobile, 4 on tablet, 8 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((step) => {
          const isActive = currentTab === step.tab;
          return (
            <button
              key={step.number}
              type="button"
              onClick={() => onNavigate && onNavigate(step.tab)}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-950/70 border-emerald-500 text-white'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {step.number}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-700'}`}></span>
              </div>
              <span className="text-xs font-semibold leading-tight line-clamp-1 truncate">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
