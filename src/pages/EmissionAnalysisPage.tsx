import React, { useState } from 'react';
import {
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Fuel,
  Zap,
  Truck,
  FileSpreadsheet,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  Sliders,
} from 'lucide-react';
import {
  EmissionSummary,
  ProgressData,
  PageTab,
} from '../types/karbon.ts';

interface EmissionAnalysisPageProps {
  emissions: EmissionSummary | null;
  progress: ProgressData | null;
  selectedPeriod: string;
  onNavigate: (tab: PageTab) => void;
}

export const EmissionAnalysisPage: React.FC<EmissionAnalysisPageProps> = ({
  emissions,
  progress,
  selectedPeriod,
  onNavigate,
}) => {
  const [granularity, setGranularity] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const totalTonnes = emissions?.totalCO2eTonnes || 1144.24;
  const hotspot = emissions?.hotspot || {
    highestSource: 'Diesel / Fuel',
    highestCO2eTonnes: 485.54,
    percentageOfTotal: 42.4,
    potentialFocusArea: 'Heavy earthmoving fleet efficiency and haul road grading',
    recommendedActions: [
      'Implement telematics-based idle-time limiters on hydraulic excavators',
      'Optimize haul road gradients from 10% to 7% to decrease truck fuel strain',
      'Replace aging mechanical fuel injectors on Belaz 100T dump trucks',
    ],
  };

  const categoryIcons: Record<string, React.ElementType> = {
    'Diesel / Fuel': Fuel,
    'Electricity': Zap,
    'Transportation': Truck,
    'Other Operations': FileSpreadsheet,
  };

  const categoryColors: Record<string, { hex: string; bg: string }> = {
    'Diesel / Fuel': { hex: '#f59e0b', bg: 'bg-amber-500' },
    'Electricity': { hex: '#10b981', bg: 'bg-emerald-500' },
    'Transportation': { hex: '#06b6d4', bg: 'bg-cyan-500' },
    'Other Operations': { hex: '#8b5cf6', bg: 'bg-purple-500' },
  };

  // Historical data for different granularities
  const historicalData = {
    Monthly: [
      { label: 'Jan', val: 1195 },
      { label: 'Feb', val: 1180 },
      { label: 'Mar', val: 1165 },
      { label: 'Apr', val: 1150 },
      { label: 'May', val: 1140 },
      { label: 'Jun', val: 1125 },
      { label: 'Jul', val: 1110 },
      { label: 'Aug', val: 1095 },
      { label: 'Sep', val: 1198 },
      { label: 'Oct', val: 1144, active: true },
    ],
    Quarterly: [
      { label: 'Q1-24', val: 3650 },
      { label: 'Q2-24', val: 3580 },
      { label: 'Q3-24', val: 3510 },
      { label: 'Q4-24', val: 3480 },
      { label: 'Q1-25', val: 3540 },
      { label: 'Q2-25', val: 3415 },
      { label: 'Q3-25', val: 3403, active: true },
    ],
    Yearly: [
      { label: '2022', val: 15400 },
      { label: '2023', val: 14850 },
      { label: '2024', val: 14220 },
      { label: '2025 (YTD)', val: 11280, active: true },
    ],
  };

  const currentChartData = historicalData[granularity];
  const maxChartVal = Math.max(...currentChartData.map((d) => d.val));

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Detailed Operational Emission Analysis</h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Diagnostic assessment of operational activity records to pinpoint highest carbon-intensive mining operations and evaluate historical trajectory.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs shadow-emerald-950"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulate Reductions</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-mono uppercase block">Total Period Footprint</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalTonnes.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">October 2025 logbook</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-amber-400 font-mono uppercase block">Highest Emission Source</span>
          <div className="text-xl font-bold text-amber-300 mt-1 truncate">
            {hotspot.highestSource}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {hotspot.highestCO2eTonnes} tCO₂e ({hotspot.percentageOfTotal}% share)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-mono uppercase block">Scope 1 Direct Share</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            75.1%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Fuel combustion & explosives</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-mono uppercase block">Scope 2 Grid Electricity</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            24.9%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Prep plant, pumps & conveyors</span>
        </div>
      </div>

      {/* 3. DUAL COLUMN: Source Breakdown + Historical Trends with Granularity Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Source-wise Emissions */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Source-Wise Emissions</h3>
                <span className="text-xs text-slate-400">Share of monthly operational volume</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">4 Categories</span>
            </div>

            <div className="space-y-4 my-2">
              {(emissions?.sourceBreakdown || [
                { category: 'Diesel / Fuel', totalCO2eTonnes: 485.54, percentage: 42.4, activityCount: 4 },
                { category: 'Electricity', totalCO2eTonnes: 331.0, percentage: 28.9, activityCount: 3 },
                { category: 'Transportation', totalCO2eTonnes: 237.1, percentage: 20.7, activityCount: 2 },
                { category: 'Other Operations', totalCO2eTonnes: 90.6, percentage: 7.9, activityCount: 2 },
              ]).map((src) => {
                const Icon = categoryIcons[src.category] || Layers;
                const color = categoryColors[src.category]?.hex || '#64748b';
                return (
                  <div key={src.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-200">{src.category}</span>
                      </div>
                      <div className="font-mono text-xs">
                        <span className="font-bold text-white">{src.totalCO2eTonnes} t</span>
                        <span className="text-slate-400 ml-1.5">({src.percentage}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${src.percentage}%`, backgroundColor: color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Direct Fuel & Fleet: ~75%</span>
            <span>Prep Plant Grid: ~25%</span>
          </div>
        </div>

        {/* Historical Trends with Monthly / Quarterly / Yearly Selector */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Historical Emission Trends</h3>
                <span className="text-xs text-slate-400">Periodic variance and baseline trajectory</span>
              </div>

              {/* Granularity Selector Buttons (Monthly, Quarterly, Yearly) */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['Monthly', 'Quarterly', 'Yearly'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGranularity(g)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      granularity === g
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic SVG Bar Chart */}
            <div className="h-48 w-full pt-2">
              <div className="flex items-end justify-between h-40 gap-2 px-2 border-b border-slate-800 pb-2">
                {currentChartData.map((d) => {
                  const heightPct = Math.max(12, (d.val / maxChartVal) * 100);
                  return (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.val}t
                      </div>
                      <div className="w-full bg-slate-950 rounded-t h-32 flex items-end">
                        <div
                          className={`w-full rounded-t transition-all ${
                            d.active ? 'bg-emerald-500' : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      <span className={`text-[10px] font-mono ${d.active ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Viewing: <strong className="text-white">{granularity} Time Series</strong></span>
            <span className="font-mono text-emerald-400">Consistent Downward Trend</span>
          </div>
        </div>
      </div>

      {/* 4. DETAILED EMISSION HOTSPOTS IN-DEPTH */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-700 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Emission Hotspots & Operational Abatement Priorities</h3>
            <span className="text-xs text-slate-400">Highest-leverage areas for immediate Scope 1 and Scope 2 interventions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Primary Hotspot</span>
            <div className="text-lg font-bold text-amber-300 font-mono mt-1">{hotspot.highestSource}</div>
            <div className="text-xs text-slate-400 mt-1">
              {hotspot.highestCO2eTonnes} tCO₂e ({hotspot.percentageOfTotal}% of facility footprint)
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 md:col-span-2">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Operational Focus Area</span>
            <div className="text-xs font-semibold text-slate-200 mt-1 leading-relaxed">
              {hotspot.potentialFocusArea}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Capital expenditure targeted at this specific operational hotspot generates the highest tCO₂e mitigation per dollar invested.
            </p>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recommended Engineering Mitigations for {hotspot.highestSource}:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {hotspot.recommendedActions.map((action, i) => (
              <div key={i} className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-[10px] font-bold font-mono text-emerald-400 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
