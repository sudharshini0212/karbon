import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  X,
  TrendingDown,
  ArrowRight,
  Save,
  Check,
} from 'lucide-react';
import {
  ReductionTarget,
  TargetStatus,
  ActivityCategory,
  UserRole,
} from '../types/karbon.ts';

interface ReductionTargetsPageProps {
  targets: ReductionTarget[];
  userRole: UserRole;
  onCreateTarget: (target: Omit<ReductionTarget, 'id'>) => Promise<void>;
  onUpdateTarget: (id: string, updated: Partial<ReductionTarget>) => Promise<void>;
  onDeleteTarget: (id: string) => Promise<void>;
}

export const ReductionTargetsPage: React.FC<ReductionTargetsPageProps> = ({
  targets,
  userRole,
  onCreateTarget,
  onUpdateTarget,
  onDeleteTarget,
}) => {
  // Tabs: Active Targets, Completed Targets, Upcoming Targets
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Pending'>('Active');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<ReductionTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [targetName, setTargetName] = useState('');
  const [baselineEmissions, setBaselineEmissions] = useState<number | ''>(1200);
  const [targetReductionPercent, setTargetReductionPercent] = useState<number | ''>(20);
  const [targetEmissionValue, setTargetEmissionValue] = useState<number | ''>(960);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [reductionAction, setReductionAction] = useState('');
  const [focusCategory, setFocusCategory] = useState<ActivityCategory | 'Cross-Cutting'>('Diesel / Fuel');
  const [status, setStatus] = useState<TargetStatus>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate target value
  const handleBaselineChange = (val: number | '') => {
    setBaselineEmissions(val);
    if (val !== '' && targetReductionPercent !== '') {
      const targetVal = Number((Number(val) * (1 - Number(targetReductionPercent) / 100)).toFixed(1));
      setTargetEmissionValue(targetVal);
    }
  };

  const handlePercentChange = (val: number | '') => {
    setTargetReductionPercent(val);
    if (baselineEmissions !== '' && val !== '') {
      const targetVal = Number((Number(baselineEmissions) * (1 - Number(val) / 100)).toFixed(1));
      setTargetEmissionValue(targetVal);
    }
  };

  const handleOpenAdd = () => {
    setEditingTarget(null);
    setTargetName('Electrification of In-Pit Water Pumping Fleet');
    setBaselineEmissions(1200);
    setTargetReductionPercent(20);
    setTargetEmissionValue(960);
    setStartDate('2025-01-01');
    setTargetDate('2026-12-31');
    setReductionAction('Replace diesel pump gensets with grid substation electric motors & VFDs');
    setFocusCategory('Diesel / Fuel');
    setStatus('Active');
    setModalOpen(true);
  };

  const handleOpenEdit = (t: ReductionTarget) => {
    setEditingTarget(t);
    setTargetName(t.targetName);
    setBaselineEmissions(t.baselineEmissions);
    setTargetReductionPercent(t.targetReductionPercent);
    setTargetEmissionValue(t.targetEmissionValue);
    setStartDate(t.startDate);
    setTargetDate(t.targetDate);
    setReductionAction(t.reductionAction);
    setFocusCategory(t.focusCategory);
    setStatus(t.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim()) {
      setToast('Target name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTarget) {
        await onUpdateTarget(editingTarget.id, {
          targetName,
          baselineEmissions: Number(baselineEmissions),
          targetReductionPercent: Number(targetReductionPercent),
          targetEmissionValue: Number(targetEmissionValue),
          startDate,
          targetDate,
          reductionAction,
          focusCategory,
          status,
        });
        setToast(`Target "${targetName}" updated successfully.`);
      } else {
        await onCreateTarget({
          targetName,
          baselineEmissions: Number(baselineEmissions),
          baselinePeriod: '2024 Reference',
          targetReductionPercent: Number(targetReductionPercent),
          targetEmissionValue: Number(targetEmissionValue),
          currentEmissionValue: 1023.6,
          reductionAchieved: 176.4,
          remainingReduction: 63.6,
          completionPercent: 73,
          startDate,
          targetDate,
          reductionAction,
          focusCategory,
          status,
        });
        setToast(`Reduction target "${targetName}" authored and published.`);
      }
      setModalOpen(false);
      setTimeout(() => setToast(null), 3500);
    } catch {
      setToast('Failed to save reduction target.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter by Active, Completed, or Upcoming (Pending)
  const filteredTargets = targets.filter((t) => t.status === activeTab);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Decarbonization Reduction Targets</h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Define, track, and audit interim emission reduction objectives across opencast haulage, diesel excavators, and electricity substations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs shadow-emerald-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Author New Target</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs rounded-lg flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:text-white">✕</button>
        </div>
      )}

      {/* 2. TABS: Active Targets, Completed Targets, Upcoming Targets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex gap-2">
        {(
          [
            { id: 'Active', label: 'Active Targets', count: targets.filter((t) => t.status === 'Active').length },
            { id: 'Completed', label: 'Completed Targets', count: targets.filter((t) => t.status === 'Completed').length },
            { id: 'Pending', label: 'Upcoming Targets', count: targets.filter((t) => t.status === 'Pending').length },
          ] as const
        ).map((tab) => {
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isCurrent
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isCurrent ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. TARGET CARDS GRID */}
      <div className="space-y-4">
        {filteredTargets.length > 0 ? (
          filteredTargets.map((tgt) => {
            const currentVal = tgt.currentEmissionValue ?? 1023.6;
            const reductionRequired = Number((tgt.baselineEmissions - tgt.targetEmissionValue).toFixed(1));
            const progressPct = tgt.completionPercent ?? Math.round(
              Math.min(100, Math.max(0, ((tgt.baselineEmissions - currentVal) / reductionRequired) * 100))
            );

            return (
              <div
                key={tgt.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* Header: Title + Category + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <h3 className="text-sm font-bold text-white">{tgt.targetName}</h3>
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      Focus: <strong className="text-slate-300">{tgt.focusCategory}</strong> · Action: {tgt.reductionAction}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      -{tgt.targetReductionPercent}% Reduction
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(tgt)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit target"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTarget(tgt.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 6 Key Properties in Balanced Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  {/* 1. Baseline */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">1. Baseline</span>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {tgt.baselineEmissions.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">t</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">2024 Base</span>
                  </div>

                  {/* 2. Target Goal */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-amber-400 block">2. Target Goal</span>
                    <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
                      {tgt.targetEmissionValue.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">t</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Objective</span>
                  </div>

                  {/* 3. Current Value */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-400 block">3. Current Value</span>
                    <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">
                      {currentVal.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">t</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Oct 2025</span>
                  </div>

                  {/* 4. Reduction Required */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">4. Reduction Req.</span>
                    <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                      -{reductionRequired.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">t</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">-{tgt.targetReductionPercent}%</span>
                  </div>

                  {/* 5. Deadline */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">5. Deadline</span>
                    <div className="text-xs font-semibold text-white mt-1 truncate">
                      {tgt.targetDate}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Target Date</span>
                  </div>

                  {/* 6. Progress Percentage */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">6. Completion</span>
                    <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                      {progressPct}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{tgt.status}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Milestone Progress towards {tgt.targetEmissionValue} tCO₂e</span>
                    <span className="font-mono font-bold text-white text-xs">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
            <Target className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <div>No {activeTab} reduction targets found.</div>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              + Author a new target
            </button>
          </div>
        )}
      </div>

      {/* Target Authoring Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                {editingTarget ? 'Edit Reduction Target' : 'Author Decarbonization Target'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Target Name *</label>
                <input
                  type="text"
                  required
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="e.g. 20% Diesel Efficiency & Fleet Upgrade"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Baseline (tCO₂e) *</label>
                  <input
                    type="number"
                    required
                    value={baselineEmissions}
                    onChange={(e) => handleBaselineChange(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Reduction % *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={targetReductionPercent}
                    onChange={(e) => handlePercentChange(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Goal (tCO₂e) *</label>
                  <input
                    type="number"
                    required
                    value={targetEmissionValue}
                    onChange={(e) => setTargetEmissionValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Focus Category *</label>
                  <select
                    value={focusCategory}
                    onChange={(e) => setFocusCategory(e.target.value as ActivityCategory | 'Cross-Cutting')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Diesel / Fuel">Diesel / Fuel</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other Operations">Other Operations</option>
                    <option value="Cross-Cutting">Cross-Cutting (All Sources)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Target Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TargetStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Upcoming (Pending)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Planned Reduction Action</label>
                <textarea
                  rows={2}
                  value={reductionAction}
                  onChange={(e) => setReductionAction(e.target.value)}
                  placeholder="Specific engineering steps, e.g. Telematics idle shut-off, solar PV installation"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs shadow-emerald-950"
              >
                {editingTarget ? 'Update Target' : 'Save Target'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
