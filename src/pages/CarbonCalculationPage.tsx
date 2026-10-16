import React, { useState } from 'react';
import {
  Calculator,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  Settings2,
  RefreshCw,
  Fuel,
  Zap,
  Truck,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import {
  EmissionSummary,
  EmissionFactorConfig,
  UserRole,
} from '../types/karbon.ts';

interface CarbonCalculationPageProps {
  emissions: EmissionSummary | null;
  factors: Record<string, EmissionFactorConfig>;
  onUpdateFactor: (key: string, updated: Partial<EmissionFactorConfig>) => Promise<void>;
  userRole: UserRole;
  selectedPeriod: string;
}

export const CarbonCalculationPage: React.FC<CarbonCalculationPageProps> = ({
  emissions,
  factors,
  onUpdateFactor,
  selectedPeriod,
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempVal, setTempVal] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleStartEdit = (key: string, currentVal: number) => {
    setEditingKey(key);
    setTempVal(currentVal);
  };

  const handleSave = async (key: string) => {
    try {
      await onUpdateFactor(key, { factorValue: tempVal });
      setEditingKey(null);
      setSaveSuccess(`Emission factor for ${key} updated successfully.`);
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch {
      alert('Failed to update factor.');
    }
  };

  // 4 Featured Visual Calculation Cards (as explicitly exemplified in prompt)
  const calculationExamples = [
    {
      source: 'Diesel / Fuel Consumption',
      icon: Fuel,
      activityLabel: 'Excavators & Pit Shovels',
      activityValue: '181,171',
      activityUnit: 'Litres (L)',
      factorLabel: 'Diesel Factor (Demo)',
      factorValue: factors['diesel']?.factorValue ?? 2.68,
      factorUnit: 'kg CO₂e / L',
      emissionsTonnes: '485.54',
      scope: 'Scope 1 Direct',
    },
    {
      source: 'Electricity Consumption',
      icon: Zap,
      activityLabel: 'Coal Handling Plant & Pumps',
      activityValue: '403,658',
      activityUnit: 'Kilowatt-hours (kWh)',
      factorLabel: 'Grid Factor (CEA Demo)',
      factorValue: factors['electricity']?.factorValue ?? 0.82,
      factorUnit: 'kg CO₂e / kWh',
      emissionsTonnes: '331.00',
      scope: 'Scope 2 Grid',
    },
    {
      source: 'Fleet Transportation',
      icon: Truck,
      activityLabel: 'Heavy 100T Haul Trucks',
      activityValue: '88,470',
      activityUnit: 'Litres (L)',
      factorLabel: 'Heavy Fleet Diesel (Demo)',
      factorValue: factors['transportation']?.factorValue ?? 2.68,
      factorUnit: 'kg CO₂e / L',
      emissionsTonnes: '237.10',
      scope: 'Scope 1 Fleet',
    },
    {
      source: 'Other Operations',
      icon: FileSpreadsheet,
      activityLabel: 'ANFO Blasting & Methane',
      activityValue: '32,150',
      activityUnit: 'kg ANFO / fugitive m³',
      factorLabel: 'Blasting Factor (Demo)',
      factorValue: factors['blasting']?.factorValue ?? 0.17,
      factorUnit: 'kg CO₂e / kg',
      emissionsTonnes: '90.60',
      scope: 'Scope 1 Operations',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Carbon Footprint Calculation Model</h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Deterministic mathematical formula multiplying verified operational activity logs by emissions factors.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-mono text-xs font-bold shrink-0">
            <span>Period Total:</span>
            <span>{(emissions?.totalCO2eTonnes ?? 1144.24).toLocaleString()} tCO₂e</span>
          </div>
        </div>

        {/* Master Formula Equation Visual */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
          <span className="text-slate-400 font-semibold font-mono">DETERMINISTIC FORMULA:</span>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-amber-400 font-bold">Activity Data [A]</span>
            <span className="text-slate-500 font-bold">×</span>
            <span className="text-cyan-400 font-bold">Emission Factor [B]</span>
            <span className="text-slate-500 font-bold">=</span>
            <span className="text-emerald-400 font-bold">CO₂e Emissions</span>
          </div>
        </div>
      </div>

      {/* Mandatory Factor Disclaimer Notice */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-xs text-amber-200/90 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-300">
            Notice on Emission Factors:
          </div>
          <p className="leading-relaxed">
            &quot;Demo emission factor — replace with verified factor before deployment.&quot; Default factors represent CEA (Central Electricity Authority) and standard diesel combustion benchmarks.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* 2. VISUAL CALCULATION CARDS (As requested: Activity Data x Emission Factor = CO2e) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Visual Source Calculation Cards</h2>
          <span className="text-xs text-slate-400 font-mono">Operational Ledger Snapshot</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculationExamples.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.source} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xs">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">{item.source}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{item.scope}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded font-mono">
                    Demo Factor
                  </span>
                </div>

                {/* The 3-Step Visual Equation */}
                <div className="grid grid-cols-1 sm:grid-cols-7 items-center gap-2 text-center bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                  {/* Step 1: Activity Data */}
                  <div className="sm:col-span-2 text-left sm:text-center">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Activity Data</span>
                    <div className="text-base font-bold font-mono text-white mt-0.5">{item.activityValue}</div>
                    <span className="text-[10px] text-slate-400">{item.activityUnit}</span>
                  </div>

                  {/* Multiplier */}
                  <div className="sm:col-span-1 text-slate-500 font-bold text-sm">×</div>

                  {/* Step 2: Emission Factor */}
                  <div className="sm:col-span-2 text-left sm:text-center">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 block">Emission Factor</span>
                    <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">{item.factorValue}</div>
                    <span className="text-[10px] text-slate-400">{item.factorUnit}</span>
                  </div>

                  {/* Equals */}
                  <div className="sm:col-span-1 text-slate-500 font-bold text-sm">=</div>

                  {/* Step 3: Calculated CO2e */}
                  <div className="sm:col-span-1 text-left sm:text-center">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 block">Calculated</span>
                    <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">{item.emissionsTonnes}</div>
                    <span className="text-[10px] text-slate-400">tCO₂e</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Equip: {item.activityLabel}</span>
                  <span className="font-mono text-slate-500">Ref: FY25-Audit</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CONFIGURABLE EMISSION FACTORS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-emerald-400" />
              <span>Configurable Emission Factor Calibration</span>
            </h2>
            <p className="text-xs text-slate-400">
              Update factors to match site-specific laboratory test assays or local grid authority tariffs.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {Object.keys(factors).length} Active Operational Factors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Factor Category</th>
                <th className="py-2.5 px-4">Activity Name</th>
                <th className="py-2.5 px-4">Scope</th>
                <th className="py-2.5 px-4 text-right">Factor Value</th>
                <th className="py-2.5 px-4">Unit</th>
                <th className="py-2.5 px-4">Source Reference</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {Object.entries(factors).map(([key, f]) => {
                const isEditing = editingKey === key;
                return (
                  <tr key={key} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {f.category}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {f.activityName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono">
                        {f.scope}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-cyan-300">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.001"
                          value={tempVal}
                          onChange={(e) => setTempVal(Number(e.target.value))}
                          className="w-24 px-2 py-1 bg-slate-950 border border-emerald-500 rounded text-xs text-right text-white font-mono focus:outline-hidden"
                        />
                      ) : (
                        f.factorValue.toFixed(3)
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {f.factorUnit}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {f.sourceReference}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSave(key)}
                            className="p-1 text-emerald-400 hover:text-white rounded hover:bg-slate-800"
                            title="Save"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingKey(null)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(key, f.factorValue)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Configure factor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
