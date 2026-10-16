import React, { useState } from 'react';
import {
  Flame,
  Calendar,
  Target,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Sliders,
  CheckCircle2,
  CircleDot,
  Clock,
  Circle,
  FileSpreadsheet,
  Fuel,
  Zap,
  Truck,
  Database,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import {
  EmissionSummary,
  ProgressData,
  ReductionTarget,
  RoadmapStage,
  MineProfile,
  UserRole,
  PageTab,
} from '../types/karbon.ts';

interface DashboardPageProps {
  emissions: EmissionSummary | null;
  progress: ProgressData | null;
  targets: ReductionTarget[];
  roadmap: RoadmapStage[];
  mineProfile: MineProfile;
  userRole: UserRole;
  selectedPeriod: string;
  onNavigate: (tab: PageTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  emissions,
  progress,
  targets,
  roadmap,
  mineProfile,
  selectedPeriod,
  onNavigate,
}) => {
  // 1. PRIMARY METRICS
  const currentFootprint = emissions?.totalCO2eTonnes ?? 1144.24;
  const previousPeriodVal = emissions?.previousPeriodTonnes ?? 948.89;
  const changeValue = currentFootprint - previousPeriodVal;
  const changePercent = Number(((changeValue / previousPeriodVal) * 100).toFixed(1));
  const isIncrease = changeValue > 0;

  // 2. SECONDARY KPIS
  const baselineTonnes = progress?.baselineEmissions ?? 1200;
  const activeTarget = targets.find((t) => t.status === 'Active') || targets[0];
  const targetEmissionGoal = activeTarget?.targetEmissionValue ?? 960;
  const reductionAchieved = Number(Math.max(0, baselineTonnes - currentFootprint).toFixed(1));
  const baseTargetProgress = activeTarget?.completionPercent ?? 68;

  // 3. SOURCE BREAKDOWN
  const dieselTonnes = 485.54;
  const electricityTonnes = 331.00;
  const transportationTonnes = 237.10;
  const otherTonnes = 90.60;

  const sourceItems = [
    { name: 'Diesel / Fuel', tonnes: dieselTonnes, percent: 42, color: '#f59e0b', bgClass: 'bg-amber-500' },
    { name: 'Electricity', tonnes: electricityTonnes, percent: 29, color: '#10b981', bgClass: 'bg-emerald-500' },
    { name: 'Transportation', tonnes: transportationTonnes, percent: 21, color: '#06b6d4', bgClass: 'bg-cyan-500' },
    { name: 'Other Operations', tonnes: otherTonnes, percent: 8, color: '#8b5cf6', bgClass: 'bg-purple-500' },
  ];

  // 4. WHAT-IF SIMULATOR STATE (Sliders 0% to 30%)
  const [dieselCut, setDieselCut] = useState<number>(15);
  const [elecCut, setElecCut] = useState<number>(0);
  const [transCut, setTransCut] = useState<number>(0);

  // Dynamic calculations for What-If Simulator
  const simulatedDieselSavings = (dieselTonnes * dieselCut) / 100;
  const simulatedElecSavings = (electricityTonnes * elecCut) / 100;
  const simulatedTransSavings = (transportationTonnes * transCut) / 100;
  const totalSimulatedSavings = Number((simulatedDieselSavings + simulatedElecSavings + simulatedTransSavings).toFixed(2));
  const projectedFootprint = Number(Math.max(0, currentFootprint - totalSimulatedSavings).toFixed(2));

  // Projected target progress computation
  const requiredReduction = baselineTonnes - targetEmissionGoal;
  const projectedTotalReduction = reductionAchieved + totalSimulatedSavings;
  const projectedTargetProgress = Math.min(
    100,
    Number(((projectedTotalReduction / requiredReduction) * 100).toFixed(1))
  );

  // 5. HISTORICAL MONTHLY DATA (Jan - Oct 2025)
  const monthlyHistory = [
    { m: 'Jan', val: 1195 },
    { m: 'Feb', val: 1180 },
    { m: 'Mar', val: 1165 },
    { m: 'Apr', val: 1150 },
    { m: 'May', val: 1140 },
    { m: 'Jun', val: 1125 },
    { m: 'Jul', val: 1110 },
    { m: 'Aug', val: 1095 },
    { m: 'Sep', val: 948.89 },
    { m: 'Oct', val: 1144.24, current: true },
  ];

  // 6. ROADMAP 5-STEP SUMMARY
  const roadmapSteps = [
    { number: '01', title: 'Measure', status: 'Completed', detail: 'Logbook accounting established', icon: CheckCircle2, color: 'text-emerald-400' },
    { number: '02', title: 'Analyse', status: 'Completed', detail: 'Pareto hotspots identified', icon: CheckCircle2, color: 'text-emerald-400' },
    { number: '03', title: 'Reduce', status: 'In Progress', detail: 'Diesel fleet & haul road optimization', icon: CircleDot, color: 'text-cyan-400' },
    { number: '04', title: 'Monitor', status: 'Upcoming', detail: 'Periodic audit variance tracking', icon: Clock, color: 'text-slate-500' },
    { number: '05', title: 'Neutralize', status: 'Long Term', detail: 'Solar PV & bio-sequestration sink', icon: Circle, color: 'text-slate-600' },
  ];

  // 7. RECENT ACTIVITY RECORDS
  const recentActivities = [
    { date: 'Oct 2025', activity: 'Diesel Fuel Dispenser (Pit 4 Excavators)', quantity: '45,000 L', co2e: '120.60 tCO₂e', status: 'Calculated' },
    { date: 'Oct 2025', activity: 'Coal Handling Prep Plant Electricity', quantity: '120,000 kWh', co2e: '98.40 tCO₂e', status: 'Calculated' },
    { date: 'Oct 2025', activity: '100T Belaz Heavy Haulage Fleet', quantity: '28,000 L', co2e: '75.04 tCO₂e', status: 'Calculated' },
    { date: 'Sep 2025', activity: 'Substation Water Drainage Pumps', quantity: '85,000 kWh', co2e: '69.70 tCO₂e', status: 'Calculated' },
    { date: 'Sep 2025', activity: 'Overburden Bench Blasting (ANFO)', quantity: '25,000 kg', co2e: '4.25 tCO₂e', status: 'Calculated' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. DATA STATUS / REPORTING PERIOD BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">From Measurement to Carbon Neutrality</h1>
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              · Demo data — replace with verified mine records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Periodic operational records for {mineProfile.mineName} · Reporting Period: {selectedPeriod === 'all' ? 'All Cumulative' : 'October 2025'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('activity-entry')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Operational Log</span>
          </button>
        </div>
      </div>

      {/* 2. PRIMARY CARBON METRIC: CURRENT CARBON FOOTPRINT */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              CURRENT CARBON FOOTPRINT
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {currentFootprint.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">tCO₂e</span>
            </div>
            <div className="text-xs text-slate-400">
              Operational period: <strong className="text-slate-200">October 2025</strong>
            </div>
          </div>

          {/* Previous Period & Change Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:min-w-[280px] flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Previous Period</span>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {previousPeriodVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
              </div>
              <span className="text-[11px] text-slate-500">September 2025 benchmark</span>
            </div>

            <div className="text-right border-l border-slate-800 pl-4">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Period Variance</span>
              <div className={`text-base font-bold font-mono flex items-center justify-end gap-1 mt-0.5 ${
                isIncrease ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isIncrease ? '+' : ''}{changePercent}%</span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {isIncrease ? 'Seasonal increase' : 'Operational reduction'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECONDARY KPI CARDS (4 compact cards in responsive grid: 4 desktop / 2 tablet / 1 mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Emissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] uppercase font-mono text-slate-400">1. Current Emissions</span>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-white">
              {currentFootprint.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">Active logbook total</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            October 2025 reporting period
          </div>
        </div>

        {/* Card 2: Reduction Target */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] uppercase font-mono text-amber-400">2. Reduction Target</span>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-amber-300">
              {targetEmissionGoal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">-20% approved 2026 goal</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            Remaining gap: {Math.max(0, currentFootprint - targetEmissionGoal).toFixed(1)} tCO₂e
          </div>
        </div>

        {/* Card 3: Reduction Achieved */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] uppercase font-mono text-emerald-400">3. Reduction Achieved</span>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-emerald-300">
              -{reductionAchieved.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">Below initial benchmark</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            Baseline: {baselineTonnes.toLocaleString()} tCO₂e
          </div>
        </div>

        {/* Card 4: Target Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono text-slate-400">4. Target Progress</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{baseTargetProgress}%</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-white">
              {baseTargetProgress}% <span className="text-xs text-slate-400 font-normal">completed</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${baseTargetProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            Trajectory on schedule for Q4 2026
          </div>
        </div>
      </div>

      {/* 4. EMISSION ANALYSIS (TWO-COLUMN SECTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Emissions by Source */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Emissions by Source</h2>
                <span className="text-xs text-slate-400">Monthly breakdown across 4 operational activities</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('analysis')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                Deep Analysis <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5 my-2">
              {sourceItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="font-semibold text-slate-200">{item.name}</span>
                    </div>
                    <div className="font-mono text-slate-200 text-xs">
                      <span>{item.tonnes} tCO₂e</span>
                      <span className="text-slate-400 ml-1.5">({item.percent}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Direct Fuel & Fleet: ~63%</span>
            <span>Grid Prep Plant: ~29%</span>
          </div>
        </div>

        {/* RIGHT: Emission Hotspots */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Emission Hotspots</h2>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Highest Emission Source</span>
                <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">Diesel / Fuel</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Contribution</span>
                  <div className="text-base font-bold font-mono text-white mt-0.5">42%</div>
                  <span className="text-[10px] text-slate-500">485.54 tCO₂e</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Potential Focus</span>
                  <div className="text-xs font-semibold text-slate-200 mt-1">Fuel consumption reduction</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <span className="text-slate-400">Recommended Action:</span> Fleet telematics idle-time limiters, haul road regrading (10% to 7%), and scheduled injector audits.
              </div>
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Primary abatement focus</span>
            <button
              type="button"
              onClick={() => onNavigate('analysis')}
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              Hotspot Matrix <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. NEW FEATURE: CARBON WHAT-IF SIMULATOR */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">CARBON WHAT-IF SIMULATOR</h2>
            </div>
            <p className="text-xs text-emerald-400 font-medium mt-0.5">
              Explore how operational changes could affect your carbon footprint.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('targets')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <span>Apply Scenario to Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sliders and Dynamic Calculations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: 3 Multi-Source Sliders (0% to 30%) */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Simulate Operational Reductions:
            </span>

            {/* Slider 1: Diesel Reduction */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Diesel Reduction</span>
                <span className="font-mono font-bold text-amber-400">{dieselCut}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={dieselCut}
                onChange={(e) => setDieselCut(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Slider 2: Electricity Reduction */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Electricity Reduction</span>
                <span className="font-mono font-bold text-emerald-400">{elecCut}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={elecCut}
                onChange={(e) => setElecCut(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Slider 3: Transportation Reduction */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Transportation Reduction</span>
                <span className="font-mono font-bold text-cyan-400">{transCut}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={transCut}
                onChange={(e) => setTransCut(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Dynamic Calculations & Comparison */}
          <div className="lg:col-span-6 bg-slate-950/80 p-4 sm:p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Current Footprint</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {currentFootprint.toFixed(2)} <span className="text-xs text-slate-400 font-normal">t</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-emerald-800/80">
                <span className="text-[10px] uppercase font-mono text-emerald-400 block">Projected Footprint</span>
                <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                  {projectedFootprint.toFixed(2)} <span className="text-xs text-slate-400 font-normal">t</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-amber-400 block">Estimated Reduction</span>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                  -{totalSimulatedSavings.toFixed(2)} <span className="text-xs text-slate-400 font-normal">t</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Target Progress</span>
                <div className="text-sm font-bold font-mono text-slate-200 mt-1">
                  {baseTargetProgress}% → <strong className="text-emerald-400">{projectedTargetProgress}%</strong>
                </div>
                <span className="text-[10px] text-slate-400">Projected completion</span>
              </div>
            </div>

            {/* Before / After Visual Comparison Bar */}
            <div className="space-y-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Before vs After Comparison</span>
                <span className="font-mono text-emerald-400 text-xs">
                  {totalSimulatedSavings > 0 ? `-${totalSimulatedSavings.toFixed(1)} tCO₂e cut` : 'Adjust sliders to simulate'}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 flex">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${Math.max(15, (projectedFootprint / currentFootprint) * 100)}%` }}
                  title={`Projected Footprint: ${projectedFootprint} tCO2e`}
                ></div>
                <div
                  className="bg-amber-500/80 h-full transition-all"
                  style={{ width: `${Math.min(85, (totalSimulatedSavings / currentFootprint) * 100)}%` }}
                  title={`Simulated Abatement: ${totalSimulatedSavings} tCO2e`}
                ></div>
              </div>
            </div>

            {/* Explicit Methodology Disclaimer */}
            <p className="text-[11px] text-slate-400 leading-tight">
              Illustrative scenario based on entered activity data and configured emission factors. Not an AI or sensor prediction. Actual stored activity logs remain unmodified.
            </p>
          </div>
        </div>
      </div>

      {/* 6. NEW FEATURE CARD: DATA SOURCE & QUALITY */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">DATA SOURCE</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs mb-3">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Source</span>
            <div className="text-xs font-semibold text-white mt-1">Manual Operational Records</div>
            <span className="text-[11px] text-slate-500">Fuel logs, Electricity records, Transportation tickets</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Frequency</span>
            <div className="text-xs font-semibold text-white mt-1">Periodic</div>
            <span className="text-[11px] text-slate-500">Monthly invoice & dispenser slip audits</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Status</span>
            <div className="text-xs font-semibold text-emerald-400 mt-1">Data entered manually</div>
            <span className="text-[11px] text-slate-500">Verified by authorized shift officers</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          KARBON uses operational records provided by authorized users. The platform does not directly collect measurements from physical sensors.
        </p>
      </div>

      {/* 7. HISTORICAL EMISSIONS CHART (Large & Easy to Read) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">Historical Carbon Emissions</h2>
            <span className="text-xs text-slate-400">Monthly periodic operational emissions vs approved target line</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Actual Logged (tCO₂e)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-4 h-0.5 border-t border-dashed border-amber-400"></span> 2026 Target Goal (960 t)
            </span>
          </div>
        </div>

        {/* Large SVG Chart */}
        <div className="h-64 w-full pt-2">
          <svg viewBox="0 0 620 180" className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            <line x1="35" y1="20" x2="610" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1="35" y1="65" x2="610" y2="65" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1="35" y1="110" x2="610" y2="110" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1="35" y1="155" x2="610" y2="155" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

            <text x="5" y="24" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.2k</text>
            <text x="5" y="69" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.1k</text>
            <text x="5" y="114" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.0k</text>
            <text x="5" y="159" fill="#94a3b8" fontSize="10" fontFamily="monospace">900</text>

            {/* Target 960 t Horizontal Dashed Line */}
            <line x1="45" y1="125" x2="600" y2="125" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Monthly Bars */}
            {monthlyHistory.map((item, idx) => {
              const x = 50 + idx * 56;
              const barHeight = Math.max(12, ((item.val - 800) / 450) * 135);
              const y = 155 - barHeight;
              const isCurrent = item.current;

              return (
                <g key={item.m}>
                  <rect
                    x={x}
                    y={y}
                    width="30"
                    height={barHeight}
                    rx="4"
                    fill={isCurrent ? '#10b981' : '#334155'}
                    className="transition-colors hover:fill-emerald-400 cursor-pointer"
                  >
                    <title>{item.m} 2025: {item.val} tCO₂e</title>
                  </rect>
                  <text
                    x={x + 15}
                    y="173"
                    textAnchor="middle"
                    fill={isCurrent ? '#34d399' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isCurrent ? 'bold' : 'normal'}
                  >
                    {item.m}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>X-axis: 2025 Operational Period</span>
          <span className="font-mono text-emerald-400">Y-axis: Metric Tonnes CO₂e</span>
        </div>
      </div>

      {/* 8. NEUTRALITY ROADMAP PREVIEW & 9. RECENT ACTIVITY (Split Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 8. NEUTRALITY ROADMAP (Compact Timeline Preview) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Carbon Neutrality Roadmap</h2>
              <span className="text-[11px] text-slate-400 font-mono">5 Steps</span>
            </div>

            <div className="space-y-3.5">
              {roadmapSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 w-5 mt-0.5">
                      {step.number}
                    </span>
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${step.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{step.title}</span>
                        <span className={`text-[10px] font-mono ${step.color}`}>
                          {step.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">{step.detail}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onNavigate('roadmap')}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <span>View Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 9. RECENT ACTIVITY (Clean Table) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white">Recent Activity Records</h2>
                <span className="text-xs text-slate-400">Periodic entries from operational logbooks</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('activity-entry')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                View All Activity <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Activity</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">CO₂e</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentActivities.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400 whitespace-nowrap">{row.date}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-200">
                        <div className="truncate max-w-[180px] sm:max-w-[220px]">{row.activity}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300 whitespace-nowrap">{row.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">{row.co2e}</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-1.5 py-0.5 rounded font-mono">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Verified logbook entries</span>
            <span>Singrauli Audit Trail</span>
          </div>
        </div>
      </div>
    </div>
  );
};
