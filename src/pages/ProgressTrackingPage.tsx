import React from 'react';
import {
  TrendingDown,
  Target,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { ProgressData, EmissionSummary, PageTab } from '../types/karbon.ts';

interface ProgressTrackingPageProps {
  progress: ProgressData | null;
  emissions: EmissionSummary | null;
  onNavigate: (tab: PageTab) => void;
}

export const ProgressTrackingPage: React.FC<ProgressTrackingPageProps> = ({
  progress,
  emissions,
  onNavigate,
}) => {
  const baseline = progress?.baselineEmissions || 1200;
  const current = emissions?.totalCO2eTonnes || progress?.currentEmissions || 1144.24;
  const target = progress?.targetEmissions || 960;

  const reductionAchieved = Number(Math.max(0, baseline - current).toFixed(1));
  const remainingReduction = Number(Math.max(0, current - target).toFixed(1));
  const totalRequired = baseline - target;
  const completionPct = totalRequired > 0
    ? Math.min(100, Math.max(0, Number(((reductionAchieved / totalRequired) * 100).toFixed(1))))
    : 0;

  const monthlyHistory = progress?.historicalMonthly || [
    { month: 'Jan', label: 'Jan', diesel: 505, electricity: 345, transportation: 245, other: 100, total: 1195, target: 1190 },
    { month: 'Feb', label: 'Feb', diesel: 500, electricity: 342, transportation: 242, other: 96, total: 1180, target: 1165 },
    { month: 'Mar', label: 'Mar', diesel: 495, electricity: 338, transportation: 238, other: 94, total: 1165, target: 1140 },
    { month: 'Apr', label: 'Apr', diesel: 490, electricity: 335, transportation: 235, other: 90, total: 1150, target: 1115 },
    { month: 'May', label: 'May', diesel: 488, electricity: 332, transportation: 232, other: 88, total: 1140, target: 1090 },
    { month: 'Jun', label: 'Jun', diesel: 480, electricity: 330, transportation: 228, other: 87, total: 1125, target: 1065 },
    { month: 'Jul', label: 'Jul', diesel: 475, electricity: 325, transportation: 225, other: 85, total: 1110, target: 1040 },
    { month: 'Aug', label: 'Aug', diesel: 470, electricity: 322, transportation: 220, other: 83, total: 1095, target: 1015 },
    { month: 'Sep', label: 'Sep', diesel: 510, electricity: 350, transportation: 245, other: 93, total: 1198, target: 990 },
    { month: 'Oct', label: 'Oct', diesel: 485.5, electricity: 331, transportation: 237.1, other: 90.6, total: 1144.2, target: 965 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Periodic Emission Monitoring & Progress Tracking</h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Audited periodic comparison of historical baseline against current operational activity and approved reduction targets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Target Scenarios</span>
            </button>
          </div>
        </div>

        {/* Terminology Notice as explicitly required */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Methodology Note:</strong> This is a periodic monitoring and historical tracking framework built on periodic operational records (logbooks, weighbridge tickets, utility meters). There is zero dependency on uncalibrated real-time IoT sensors.
          </p>
        </div>
      </div>

      {/* 2. THREE CORE BENCHMARK CARDS: Baseline, Current, Target */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Baseline Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider font-mono text-[11px]">1. Baseline Emissions</span>
              <span className="text-[10px] text-slate-500 font-mono">Reference Year</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white mb-1">
              {baseline.toLocaleString()}{' '}
              <span className="text-xs text-slate-400 font-normal">tCO₂e / mo</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Historical operational benchmark (FY 2024 monthly average) prior to mitigation initiatives.
            </p>
          </div>
          <div className="pt-3 mt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Source: FY24 Environmental Audit Register
          </div>
        </div>

        {/* Current Card */}
        <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-2 font-semibold">
              <span className="uppercase tracking-wider font-mono text-[11px]">2. Current Emissions</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                Active Logbook
              </span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-300 mb-1">
              {current.toLocaleString()}{' '}
              <span className="text-xs text-slate-400 font-normal">tCO₂e / mo</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
              <span>Reduction from baseline:</span>
              <span className="font-mono font-bold">-{reductionAchieved} tCO₂e</span>
              <span className="text-slate-400 text-[11px]">
                (-{Number(((reductionAchieved / baseline) * 100).toFixed(1))}%)
              </span>
            </div>
          </div>
          <div className="pt-3 mt-4 border-t border-slate-800 text-[11px] text-emerald-400/80">
            Logged from Oct 2025 activity tickets
          </div>
        </div>

        {/* Target Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider font-mono text-[11px]">3. Target Emissions</span>
              <span className="text-[10px] text-amber-400 font-mono">2026 Goal</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-amber-300 mb-1">
              {target.toLocaleString()}{' '}
              <span className="text-xs text-slate-400 font-normal">tCO₂e / mo</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-2 font-medium">
              <span>Remaining Gap:</span>
              <span className="font-mono font-bold">{remainingReduction} tCO₂e</span>
              <span className="text-slate-400 text-[11px]">to achieve goal</span>
            </div>
          </div>
          <div className="pt-3 mt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Approved by Environmental Committee
          </div>
        </div>
      </div>

      {/* 3. SUPPORTING OUTCOME METRICS: Reduction Achieved, Remaining Reduction, Target Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] uppercase font-mono text-slate-400 block">Reduction Achieved</span>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
            -{reductionAchieved} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cumulative abatement vs 1,200 t</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] uppercase font-mono text-slate-400 block">Remaining Reduction</span>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {remainingReduction} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">To reach 960 t interim objective</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono text-slate-400">Target Progress</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{completionPct}%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {completionPct}% <span className="text-xs text-slate-400 font-normal">of goal</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${completionPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4. HISTORICAL TRAJECTORY CHART (Visual 3-way benchmark) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white">Monthly Emission Trajectory vs Target Pathway</h3>
            <span className="text-xs text-slate-400">Periodic variance of actual logbook emissions against the planned reduction curve</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-0.5 bg-slate-500"></span> Baseline (1,200t)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-0.5 bg-emerald-400"></span> Actual Logged
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 border-t border-dashed border-amber-400"></span> Target Curve
            </span>
          </div>
        </div>

        {/* SVG Trajectory Chart */}
        <div className="h-56 w-full pt-2">
          <svg viewBox="0 0 580 180" className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            <line x1="30" y1="20" x2="570" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1="30" y1="65" x2="570" y2="65" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1="30" y1="110" x2="570" y2="110" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1="30" y1="155" x2="570" y2="155" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

            <text x="5" y="24" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.2k</text>
            <text x="5" y="69" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.1k</text>
            <text x="5" y="114" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.0k</text>
            <text x="5" y="159" fill="#94a3b8" fontSize="10" fontFamily="monospace">900</text>

            {/* Baseline 1200 Flat Line */}
            <line x1="45" y1="20" x2="560" y2="20" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Target Decreasing Dashed Polyline */}
            {(() => {
              const points = monthlyHistory.map((d, i) => {
                const x = 55 + i * 50;
                const y = 20 + ((1200 - d.target) / 300) * 135;
                return `${x},${y}`;
              }).join(' ');
              return <polyline fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" points={points} />;
            })()}

            {/* Actual Emissions Solid Polyline with Points */}
            {(() => {
              const points = monthlyHistory.map((d, i) => {
                const x = 55 + i * 50;
                const y = 20 + ((1200 - d.total) / 300) * 135;
                return `${x},${y}`;
              }).join(' ');
              return <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={points} />;
            })()}

            {/* Actual Dots and Month Labels */}
            {monthlyHistory.map((d, i) => {
              const x = 55 + i * 50;
              const y = 20 + ((1200 - d.total) / 300) * 135;
              const isLast = i === monthlyHistory.length - 1;
              return (
                <g key={d.month}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isLast ? '5' : '3.5'}
                    fill={isLast ? '#10b981' : '#047857'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y="173"
                    textAnchor="middle"
                    fill={isLast ? '#34d399' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isLast ? 'bold' : 'normal'}
                  >
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="pt-3 mt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span className="text-emerald-400">✓ Facilities tracking below 2024 benchmark line.</span>
          <span>Interim Target Date: Dec 2026</span>
        </div>
      </div>
    </div>
  );
};
