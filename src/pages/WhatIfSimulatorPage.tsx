import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Target,
  Layers,
  Save,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Info,
  Fuel,
  Zap,
  Truck,
  FileSpreadsheet,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import {
  EmissionSummary,
  ReductionTarget,
  SimulationScenario,
  ActivityCategory,
  PageTab,
} from '../types/karbon.ts';

interface WhatIfSimulatorPageProps {
  emissions: EmissionSummary | null;
  targets: ReductionTarget[];
  scenarios: SimulationScenario[];
  onSaveScenario: (scenario: SimulationScenario) => void;
  onDeleteScenario: (id: string) => void;
  onNavigate: (tab: PageTab) => void;
}

export const WhatIfSimulatorPage: React.FC<WhatIfSimulatorPageProps> = ({
  emissions,
  targets,
  scenarios,
  onSaveScenario,
  onDeleteScenario,
  onNavigate,
}) => {
  const currentTotal = emissions?.totalCO2eTonnes ?? 1144.24;
  const activeTarget = targets.find((t) => t.status === 'Active') || targets[0];
  const targetGoal = activeTarget?.targetEmissionValue ?? 960;

  // Simulator controls
  const [selectedSource, setSelectedSource] = useState<ActivityCategory | 'All Sources'>('Diesel / Fuel');
  const [reductionPercent, setReductionPercent] = useState<number>(20);
  const [scenarioName, setScenarioName] = useState<string>('20% Diesel Efficiency & Haul Optimization');
  const [notification, setNotification] = useState<string | null>(null);

  // Source-specific baseline tonnes
  const getSourceTonnes = (src: ActivityCategory | 'All Sources'): number => {
    if (src === 'All Sources') return currentTotal;
    const found = emissions?.sourceBreakdown.find((b) => b.category === src);
    if (found) return found.totalCO2eTonnes;
    // Fallback estimates
    switch (src) {
      case 'Diesel / Fuel':
        return 485.54;
      case 'Electricity':
        return 331.0;
      case 'Transportation':
        return 237.1;
      case 'Other Operations':
        return 90.6;
      default:
        return 0;
    }
  };

  const sourceTonnes = getSourceTonnes(selectedSource);
  const estimatedReduction = Number(((sourceTonnes * reductionPercent) / 100).toFixed(2));
  const projectedFootprint = Number(Math.max(0, currentTotal - estimatedReduction).toFixed(2));
  const remainingTargetGap = Number(Math.max(0, projectedFootprint - targetGoal).toFixed(2));
  const overallImpactPercent = Number(((estimatedReduction / currentTotal) * 100).toFixed(1));

  // Quick preset handlers
  const handleSourceChange = (src: ActivityCategory | 'All Sources') => {
    setSelectedSource(src);
    setScenarioName(`${reductionPercent}% ${src} Decarbonization Plan`);
  };

  const handleSliderChange = (pct: number) => {
    setReductionPercent(pct);
    setScenarioName(`${pct}% ${selectedSource} Reduction Scenario`);
  };

  const handleSave = () => {
    if (scenarios.length >= 3) {
      setNotification('Maximum of 3 scenarios reached. Delete an existing scenario to save a new one.');
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const newScenario: SimulationScenario = {
      id: `sim-${Date.now()}`,
      name: scenarioName.trim() || `${reductionPercent}% ${selectedSource} Reduction`,
      sourceCategory: selectedSource,
      reductionPercent,
      currentFootprint: currentTotal,
      projectedFootprint,
      estimatedReduction,
      targetGap: remainingTargetGap,
      overallImpactPercent,
      targetId: activeTarget?.id,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onSaveScenario(newScenario);
    setNotification(`Scenario "${newScenario.name}" saved for comparison.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Strategy Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <Sliders className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Carbon What-If Simulator</h1>
            </div>
            <p className="text-xs text-emerald-400 font-medium max-w-2xl leading-relaxed">
              Explore how operational changes could affect your carbon footprint.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('targets')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Apply Scenario to Roadmap</span>
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-xs shadow-emerald-950"
            >
              <span>Neutrality Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Methodology & Disclaimer Notice */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="text-slate-300 font-semibold">Simulation Note:</span> Illustrative scenario based on entered activity data and configured emission factors. Not an AI or sensor prediction. Actual stored activity logs remain unmodified.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white p-1">
            ✕
          </button>
        </div>
      )}

      {/* MAIN SIMULATOR INTERACTIVE GRID: Left Controls, Right Projected Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SOURCE & SLIDER CONTROLS */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>1. Configure Reduction Hypothesis</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Baseline: {currentTotal.toLocaleString()} tCO₂e
              </span>
            </div>

            {/* Source Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Target Emission Source
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'Diesel / Fuel', label: 'Diesel / Fuel', icon: Fuel, share: '42.4%' },
                    { id: 'Electricity', label: 'Electricity', icon: Zap, share: '28.9%' },
                    { id: 'Transportation', label: 'Transportation', icon: Truck, share: '20.7%' },
                    { id: 'Other Operations', label: 'Other (Blasting/CH4)', icon: FileSpreadsheet, share: '7.9%' },
                  ] as const
                ).map((src) => {
                  const Icon = src.icon;
                  const isSelected = selectedSource === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => handleSourceChange(src.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span className="text-xs font-semibold">{src.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{src.share}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Base: {getSourceTonnes(src.id).toFixed(1)} tCO₂e
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* All sources option */}
              <button
                type="button"
                onClick={() => handleSourceChange('All Sources')}
                className={`w-full p-2.5 rounded-lg border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedSource === 'All Sources'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cross-Cutting Mine-Wide Abatement (All 4 Sources)</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">{currentTotal} tCO₂e</span>
              </button>
            </div>

            {/* Reduction Slider (0% -> 50%) */}
            <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Simulated Reduction Percentage
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xl font-bold text-emerald-400">{reductionPercent}%</span>
                  <span className="text-xs text-slate-400">cut</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={reductionPercent}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
                <span>0% (As-Is)</span>
                <span>10% (Operational)</span>
                <span>25% (Fleet Tech)</span>
                <span>40% (Renewable Switch)</span>
                <span>50% (Aggressive)</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
                {[5, 10, 15, 20, 30, 40].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSliderChange(preset)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                      reductionPercent === preset
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    -{preset}%
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Scenario Title (for comparison)
              </label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g. 20% Diesel Efficiency & Haul Optimization"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setReductionPercent(20);
                setSelectedSource('Diesel / Fuel');
                setScenarioName('20% Diesel Reduction Scenario');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm shadow-emerald-950"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Scenario ({scenarios.length}/3)</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PROJECTED IMPACT & COMPARISON */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>2. Projected Decarbonization Outcome</span>
              </h2>
              <span className="text-[11px] text-emerald-400 font-mono">
                Projected from Logbook Data
              </span>
            </div>

            {/* 4 Core Impact Metric Cards in 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Current Footprint */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Current Footprint</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {currentTotal.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Baseline operational month</span>
              </div>

              {/* Card 2: Projected Footprint */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-800/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-[11px] text-emerald-400 block font-medium">Projected Footprint</span>
                <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                  {projectedFootprint.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
                </div>
                <span className="text-[10px] text-emerald-400/80 mt-1 block font-mono">
                  -{estimatedReduction} tCO₂e cut
                </span>
              </div>

              {/* Card 3: Estimated Reduction */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Estimated Reduction</span>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                  {estimatedReduction.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {overallImpactPercent}% of overall mine total
                </span>
              </div>

              {/* Card 4: Target Gap */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Remaining Target Gap</span>
                <div className="text-xl font-bold font-mono text-slate-200 mt-1">
                  {remainingTargetGap.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Target: {targetGoal.toLocaleString()} tCO₂e
                </span>
              </div>
            </div>

            {/* Comparative Visual Bar */}
            <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Footprint Comparison</span>
                <span className="font-mono text-emerald-400 text-xs">-{overallImpactPercent}% Total Impact</span>
              </div>

              {/* Bar 1: Current */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Measured Status</span>
                  <span className="font-mono text-slate-200">{currentTotal} tCO₂e (100%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-lg h-5 p-0.5 border border-slate-800">
                  <div className="h-full bg-slate-600 rounded flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white" style={{ width: '100%' }}>
                    Current
                  </div>
                </div>
              </div>

              {/* Bar 2: Simulated */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium">Simulated With -{reductionPercent}% {selectedSource}</span>
                  <span className="font-mono text-emerald-300 font-bold">{projectedFootprint} tCO₂e</span>
                </div>
                <div className="w-full bg-slate-900 rounded-lg h-5 p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white transition-all"
                    style={{ width: `${Math.max(10, (projectedFootprint / currentTotal) * 100)}%` }}
                  >
                    {Math.round((projectedFootprint / currentTotal) * 100)}%
                  </div>
                </div>
              </div>

              {/* Bar 3: Target Objective */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400">Approved 2026 Target Goal</span>
                  <span className="font-mono text-amber-300 font-bold">{targetGoal} tCO₂e</span>
                </div>
                <div className="w-full bg-slate-900 rounded-lg h-5 p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-amber-500/80 rounded flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white"
                    style={{ width: `${(targetGoal / currentTotal) * 100}%` }}
                  >
                    Target Goal
                  </div>
                </div>
              </div>
            </div>

            {/* Projected Impact Narrative Callout */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0 font-bold font-mono">
                -{overallImpactPercent}%
              </div>
              <div className="leading-relaxed text-slate-300">
                <strong className="text-white">{reductionPercent}% reduction in {selectedSource}</strong> delivers an estimated savings of <strong className="text-emerald-400">{estimatedReduction} tCO₂e</strong> monthly, moving the facility to within <strong className="text-amber-300">{remainingTargetGap} tCO₂e</strong> of the approved milestone target.
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Engineering Model: Linear activity factor reduction</span>
            <span>Ref: {activeTarget?.targetName || '2026 Milestone'}</span>
          </div>
        </div>
      </div>

      {/* MULTI-SCENARIO COMPARISON MANAGER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Saved Scenario Comparison ({scenarios.length}/3)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Compare strategic decarbonization interventions side by side before proposing capital budget.
            </p>
          </div>

          {scenarios.length === 0 && (
            <span className="text-xs text-slate-400 italic">No saved scenarios yet. Use &quot;Save Scenario&quot; above to store up to 3 options.</span>
          )}
        </div>

        {scenarios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Scenario Name</th>
                  <th className="py-2.5 px-4">Source Category</th>
                  <th className="py-2.5 px-4 text-right">Reduction %</th>
                  <th className="py-2.5 px-4 text-right">Projected Footprint</th>
                  <th className="py-2.5 px-4 text-right">CO₂e Abatement</th>
                  <th className="py-2.5 px-4 text-right">Target Gap</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {scenarios.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{sc.name}</div>
                      <div className="text-[10px] text-slate-400">Created {sc.createdAt}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                        {sc.sourceCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      -{sc.reductionPercent}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                      {sc.projectedFootprint} tCO₂e
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-300">
                      -{sc.estimatedReduction} tCO₂e ({sc.overallImpactPercent}%)
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {sc.targetGap} tCO₂e
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteScenario(sc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        title="Delete scenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center bg-slate-950/40 rounded-lg border border-dashed border-slate-800">
            <Sliders className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-300">Ready to simulate decarbonization paths</div>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1">
              Select an operational source above, adjust the reduction slider, and click &quot;Save Scenario&quot; to populate your multi-scenario decision matrix.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
