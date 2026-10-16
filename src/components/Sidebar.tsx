import React from 'react';
import {
  LayoutDashboard,
  Building2,
  ClipboardPenLine,
  Calculator,
  PieChart,
  Target,
  Sliders,
  Milestone,
  TrendingDown,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { PageTab, UserRole } from '../types/karbon.ts';

interface SidebarProps {
  currentTab: PageTab;
  onNavigate: (tab: PageTab) => void;
  userRole: UserRole;
  collapsed?: boolean;
  onCloseMobile?: () => void;
}

interface NavSection {
  title: string;
  items: {
    tab: PageTab;
    label: string;
    icon: React.ElementType;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onCloseMobile,
}) => {
  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CONFIGURATION',
      items: [
        { tab: 'mine-profile', label: 'Mine Profile', icon: Building2 },
      ],
    },
    {
      title: 'DATA',
      items: [
        { tab: 'activity-entry', label: 'Activity Data', icon: ClipboardPenLine },
        { tab: 'calculation', label: 'Carbon Calculation', icon: Calculator },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { tab: 'analysis', label: 'Emission Analysis', icon: PieChart },
      ],
    },
    {
      title: 'STRATEGY',
      items: [
        { tab: 'targets', label: 'Reduction Targets', icon: Target },
        { tab: 'simulator', label: 'What-If Simulator', icon: Sliders },
        { tab: 'roadmap', label: 'Neutrality Roadmap', icon: Milestone },
      ],
    },
    {
      title: 'MONITORING',
      items: [
        { tab: 'progress', label: 'Progress Tracking', icon: TrendingDown },
        { tab: 'reports', label: 'Reports', icon: FileSpreadsheet },
      ],
    },
  ];

  return (
    <aside className="w-full h-full bg-slate-900 border-r border-slate-800 flex flex-col select-none">
      {/* Scrollable Nav Items list: tight containment, no extra blank overflow */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 font-mono uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => {
                      onNavigate(item.tab);
                      onCloseMobile?.();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon
                        className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {isActive && <ChevronRight className="w-4 h-4 text-emerald-200 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Compact Disclaimer pinned at the bottom of the sidebar */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-900">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs uppercase font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Operational Method</span>
          </div>
          <p className="text-[11px] leading-tight text-slate-400">
            Manual operational records. Zero IoT or physical sensors.
          </p>
        </div>
      </div>
    </aside>
  );
};
