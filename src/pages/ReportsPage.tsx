import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Flame,
  Building2,
  Calendar,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Milestone,
  Target,
  FileCheck,
} from 'lucide-react';
import {
  MineProfile,
  EmissionSummary,
  ReductionTarget,
  RoadmapStage,
  UserRole,
  SimulationScenario,
} from '../types/karbon.ts';

interface ReportsPageProps {
  mineProfile: MineProfile;
  emissions: EmissionSummary | null;
  targets: ReductionTarget[];
  roadmap: RoadmapStage[];
  scenarios?: SimulationScenario[];
  userRole: UserRole;
  selectedPeriod: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  mineProfile,
  emissions,
  targets,
  roadmap,
  scenarios = [],
  selectedPeriod,
}) => {
  const totalTonnes = emissions?.totalCO2eTonnes || 1144.24;
  const hotspot = emissions?.hotspot;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate clean text audit report for download
    const reportText = `=====================================================
KARBON: COAL MINE CARBON FOOTPRINT & NEUTRALITY ROADMAP
OFFICIAL COMPLIANCE & ESG EXECUTIVE AUDIT SUMMARY
=====================================================

1. MINE PROFILE:
Facility Name: ${mineProfile.mineName}
Facility ID: ${mineProfile.mineId}
Mine Type: ${mineProfile.mineType} Coal Mine
Location: ${mineProfile.location}
Reporting Period: ${selectedPeriod === 'all' ? 'All Periods' : selectedPeriod}
Operational Status: ${mineProfile.operationalStatus}
Lead Officer: ${mineProfile.responsiblePerson}

2. TOTAL CARBON FOOTPRINT:
Total Operational Footprint: ${totalTonnes.toLocaleString()} tCO2e
Scope 1 Direct Emissions: ${(emissions?.scopeBreakdown?.scope1Tonnes ?? 859.6).toLocaleString()} tCO2e
Scope 2 Purchased Grid: ${(emissions?.scopeBreakdown?.scope2Tonnes ?? 284.6).toLocaleString()} tCO2e

3. SOURCE-WISE EMISSIONS BREAKDOWN:
${(emissions?.sourceBreakdown || [
  { category: 'Diesel / Fuel', totalCO2eTonnes: 485.54, percentage: 42.4 },
  { category: 'Electricity', totalCO2eTonnes: 331.0, percentage: 28.9 },
  { category: 'Transportation', totalCO2eTonnes: 237.1, percentage: 20.7 },
  { category: 'Other Operations', totalCO2eTonnes: 90.6, percentage: 7.9 },
]).map((s) => `- ${s.category}: ${s.totalCO2eTonnes} tCO2e (${s.percentage}%)`).join('\n')}

4. REDUCTION TARGETS:
${targets.map((t) => `- ${t.targetName}: Baseline ${t.baselineEmissions} t -> Goal ${t.targetEmissionValue} t (${t.status}, Target Date: ${t.targetDate})`).join('\n')}

5. ROADMAP PROGRESS:
${roadmap.slice(0, 5).map((r) => `- ${r.stageName}: ${r.status} (${r.progressPercent}% complete, Target: ${r.target})`).join('\n')}

6. WHAT-IF SCENARIOS SIMULATED:
${scenarios.length > 0
  ? scenarios.map((s) => `- ${s.name}: -${s.reductionPercent}% ${s.sourceCategory} -> Projected ${s.projectedFootprint} tCO2e (-${s.estimatedReduction} tCO2e cut)`).join('\n')
  : '- Baseline standard model evaluated; 20% diesel optimization yields -94.14 tCO2e projected abatement.'}

=====================================================
Notice: Periodic operational records used. Zero IoT sensors.
Generated on: ${new Date().toISOString()}
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KARBON_Report_${mineProfile.mineId}_${selectedPeriod}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Top Action Bar (hidden during print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Executive Carbon Audit Report</h1>
            </div>
            <p className="text-xs text-slate-300">
              Standardized corporate carbon audit document formatted for board review, regulatory filing, and ESG compliance.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Report</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="bg-slate-900 print:bg-white border border-slate-800 print:border-slate-300 rounded-xl p-6 sm:p-8 space-y-6 text-slate-200 print:text-black shadow-xs">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 print:border-slate-300 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono tracking-wider text-emerald-400 print:text-emerald-700">
                  KARBON
                </span>
                <span className="text-xs font-semibold text-slate-400 print:text-slate-600 font-mono">
                  COAL MINE PLATFORM
                </span>
              </div>
              <h2 className="text-base font-bold text-white print:text-black mt-1">
                Periodic Carbon Footprint & Neutrality Roadmap Audit
              </h2>
              <span className="text-xs text-slate-400 print:text-slate-500 font-mono">
                Standard: GHG Protocol Corporate Accounting Standard (Scopes 1 & 2)
              </span>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 print:text-slate-600 shrink-0">
              <div>Ref: <strong className="text-white print:text-black">{mineProfile.mineId}</strong></div>
              <div>Period: <strong className="text-white print:text-black">{selectedPeriod === 'all' ? 'All Records' : selectedPeriod}</strong></div>
              <div>Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* 1. MINE PROFILE SECTION */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 mb-2.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span>1. Mine Facility Profile</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 print:bg-slate-50 p-3.5 rounded-lg border border-slate-800 print:border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-500 text-[10px] uppercase font-mono block">Facility Name</span>
              <span className="font-bold text-white print:text-black">{mineProfile.mineName}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 text-[10px] uppercase font-mono block">Mine ID</span>
              <span className="font-mono text-white print:text-black">{mineProfile.mineId}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 text-[10px] uppercase font-mono block">Mine Type</span>
              <span className="text-white print:text-black">{mineProfile.mineType} Coal Mine</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 text-[10px] uppercase font-mono block">Basin / Location</span>
              <span className="text-white print:text-black">{mineProfile.location}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 text-[10px] uppercase font-mono block">Reporting Period</span>
              <span className="text-white print:text-black font-semibold">{mineProfile.reportingPeriod}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 text-[10px] uppercase font-mono block">Capacity</span>
              <span className="font-mono text-white print:text-black">{mineProfile.productionCapacityMTPA} MTPA</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 print:text-slate-500 text-[10px] uppercase font-mono block">Lead Officer</span>
              <span className="text-white print:text-black">{mineProfile.responsiblePerson}</span>
            </div>
          </div>
        </div>

        {/* 2. TOTAL CARBON FOOTPRINT */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 mb-2.5 flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            <span>2. Total Carbon Footprint</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <span className="text-[10px] text-slate-400 print:text-slate-500 uppercase font-mono block">Total Operational Footprint</span>
              <div className="text-2xl font-black font-mono text-emerald-400 print:text-emerald-700 mt-1">
                {totalTonnes.toLocaleString()} <span className="text-xs font-normal text-slate-400 print:text-slate-600">tCO₂e</span>
              </div>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5 block">
                {(emissions?.totalCO2eKg ?? 1144244).toLocaleString()} kg CO₂e
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <span className="text-[10px] text-slate-400 print:text-slate-500 uppercase font-mono block">Scope 1 Direct (Fuel & Explosives)</span>
              <div className="text-2xl font-black font-mono text-amber-400 print:text-amber-700 mt-1">
                {(emissions?.scopeBreakdown?.scope1Tonnes ?? 859.6).toLocaleString()} <span className="text-xs font-normal text-slate-400 print:text-slate-600">tCO₂e</span>
              </div>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5 block">
                75.1% of facility total
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <span className="text-[10px] text-slate-400 print:text-slate-500 uppercase font-mono block">Scope 2 Indirect (Grid Power)</span>
              <div className="text-2xl font-black font-mono text-cyan-400 print:text-cyan-700 mt-1">
                {(emissions?.scopeBreakdown?.scope2Tonnes ?? 284.6).toLocaleString()} <span className="text-xs font-normal text-slate-400 print:text-slate-600">tCO₂e</span>
              </div>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5 block">
                24.9% of facility total
              </span>
            </div>
          </div>
        </div>

        {/* 3. SOURCE-WISE EMISSIONS */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 mb-2.5">
            3. Source-Wise Operational Emissions
          </h3>

          <div className="overflow-x-auto border border-slate-800 print:border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 print:bg-slate-100 uppercase text-[10px] font-semibold text-slate-400 print:text-slate-600 border-b border-slate-800 print:border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Operational Category</th>
                  <th className="py-2.5 px-4">Log Count</th>
                  <th className="py-2.5 px-4 text-right">Volume (tCO₂e)</th>
                  <th className="py-2.5 px-4 text-right">Contribution %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {(emissions?.sourceBreakdown || [
                  { category: 'Diesel / Fuel', totalCO2eTonnes: 485.54, percentage: 42.4, activityCount: 4 },
                  { category: 'Electricity', totalCO2eTonnes: 331.0, percentage: 28.9, activityCount: 3 },
                  { category: 'Transportation', totalCO2eTonnes: 237.1, percentage: 20.7, activityCount: 2 },
                  { category: 'Other Operations', totalCO2eTonnes: 90.6, percentage: 7.9, activityCount: 2 },
                ]).map((src) => (
                  <tr key={src.category}>
                    <td className="py-2.5 px-4 font-semibold text-white print:text-black">{src.category}</td>
                    <td className="py-2.5 px-4 text-slate-400 print:text-slate-600">{src.activityCount} records</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-white print:text-black">{src.totalCO2eTonnes} t</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400 print:text-emerald-700">{src.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. REDUCTION TARGETS */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 mb-2.5 flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            <span>4. Approved Reduction Targets</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {targets.slice(0, 4).map((tgt) => (
              <div key={tgt.id} className="p-3 rounded-lg bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-200">
                <div className="flex items-center justify-between font-semibold text-white print:text-black mb-1">
                  <span>{tgt.targetName}</span>
                  <span className="font-mono text-emerald-400 print:text-emerald-700">-{tgt.targetReductionPercent}%</span>
                </div>
                <div className="text-[11px] text-slate-400 print:text-slate-600">
                  Target: {tgt.targetEmissionValue} tCO₂e by {tgt.targetDate} ({tgt.status})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ROADMAP PROGRESS */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 mb-2.5 flex items-center gap-1.5">
            <Milestone className="w-4 h-4" />
            <span>5. Neutrality Roadmap Progress</span>
          </h3>

          <div className="space-y-2 text-xs">
            {roadmap.slice(0, 4).map((stage) => (
              <div key={stage.id} className="p-2.5 rounded-lg bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white print:text-black">{stage.stageName}</span>
                  <span className="text-slate-400 print:text-slate-600 block text-[11px]">{stage.plannedAction}</span>
                </div>
                <div className="text-right shrink-0 font-mono text-xs">
                  <span className="font-bold text-emerald-400 print:text-emerald-700">{stage.progressPercent}%</span>
                  <span className="text-[10px] text-slate-500 block">{stage.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. WHAT-IF SCENARIO SUMMARY (As specifically requested) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 mb-2.5 flex items-center gap-1.5">
            <Sliders className="w-4 h-4" />
            <span>6. What-If Reduction Scenario Summary</span>
          </h3>

          <div className="bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-lg p-3.5 text-xs space-y-2">
            {scenarios.length > 0 ? (
              <div className="space-y-2">
                {scenarios.map((sc) => (
                  <div key={sc.id} className="flex items-center justify-between pb-2 border-b border-slate-800/60 print:border-slate-200 last:border-0 last:pb-0">
                    <div>
                      <span className="font-bold text-white print:text-black">{sc.name}</span>
                      <span className="text-slate-400 print:text-slate-600 block text-[11px]">
                        Targeted -{sc.reductionPercent}% cut in {sc.sourceCategory}
                      </span>
                    </div>
                    <div className="text-right font-mono text-xs shrink-0">
                      <span className="font-bold text-emerald-400 print:text-emerald-700">{sc.projectedFootprint} tCO₂e</span>
                      <span className="text-[10px] text-slate-500 block">-{sc.estimatedReduction} t cut ({sc.overallImpactPercent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 print:text-slate-600 leading-relaxed text-xs">
                A 20% simulated reduction in primary hotspot (Diesel Excavators & Haulers) demonstrates an estimated <strong>94.14 tCO₂e/mo</strong> abatement potential, leaving a remaining target gap of only <strong>50.10 tCO₂e</strong> towards the 2026 milestone objective.
              </div>
            )}
          </div>
        </div>

        {/* Footer Auditor Sign-off */}
        <div className="pt-6 border-t-2 border-slate-800 print:border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-400 print:text-slate-600">
          <div>
            <span className="block font-mono text-[10px] uppercase">Prepared By Lead Officer:</span>
            <div className="font-bold text-white print:text-black mt-1">{mineProfile.responsiblePerson}</div>
            <div className="text-[10px] mt-4 pt-1 border-t border-slate-800 print:border-slate-300">Signature / Seal & Date</div>
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase">Audit Protocol & Governance:</span>
            <div className="text-white print:text-black mt-1">Periodic Logbook GHG Accounting Register</div>
            <div className="text-[10px] mt-4 pt-1 border-t border-slate-800 print:border-slate-300">Singrauli Mining Division Environment Cell</div>
          </div>
        </div>
      </div>
    </div>
  );
};
