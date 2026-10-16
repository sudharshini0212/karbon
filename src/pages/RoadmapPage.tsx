import React, { useState } from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  CircleDot,
  Calendar,
  Edit2,
  X,
  Target,
  ArrowDown,
  ShieldCheck,
  Check,
  Save,
} from 'lucide-react';
import {
  RoadmapStage,
  StageStatus,
  UserRole,
} from '../types/karbon.ts';

interface RoadmapPageProps {
  stages: RoadmapStage[];
  userRole: UserRole;
  onCreateStage: (stage: Partial<RoadmapStage>) => Promise<void>;
  onUpdateStage: (id: string, updated: Partial<RoadmapStage>) => Promise<void>;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  stages,
  userRole,
  onUpdateStage,
}) => {
  const [editingStage, setEditingStage] = useState<RoadmapStage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusVal, setStatusVal] = useState<StageStatus>('In Progress');
  const [progressVal, setProgressVal] = useState<number>(50);
  const [targetVal, setTargetVal] = useState<string>('');
  const [actionVal, setActionVal] = useState<string>('');
  const [deadlineVal, setDeadlineVal] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  // Default 7-stage sequence as requested
  const defaultStages = [
    {
      id: 'stg-1',
      orderIndex: 1,
      stageName: '1. Establish Baseline',
      status: 'Completed' as StageStatus,
      progressPercent: 100,
      target: '1,200 tCO₂e/mo audited benchmark',
      plannedAction: 'Consolidate 12 months of utility meter bills, weighbridge fuel dispatch slips, and ANFO registers.',
      endDate: 'Dec 2024',
    },
    {
      id: 'stg-2',
      orderIndex: 2,
      stageName: '2. Measure Emissions',
      status: 'Completed' as StageStatus,
      progressPercent: 100,
      target: '100% periodic logbook coverage',
      plannedAction: 'Deploy monthly activity accounting system for diesel dispensing, fleet hours, and grid kWh meters.',
      endDate: 'Mar 2025',
    },
    {
      id: 'stg-3',
      orderIndex: 3,
      stageName: '3. Identify Hotspots',
      status: 'Completed' as StageStatus,
      progressPercent: 100,
      target: 'Pareto hierarchy of emission contributors',
      plannedAction: 'Diagnose primary emission drivers: Heavy earthmoving diesel (42.4%) and coal preparation power (28.9%).',
      endDate: 'Jun 2025',
    },
    {
      id: 'stg-4',
      orderIndex: 4,
      stageName: '4. Set Reduction Targets',
      status: 'Completed' as StageStatus,
      progressPercent: 100,
      target: '-20% by Dec 2026 (960 tCO₂e)',
      plannedAction: 'Approve interim and 2030 targets with mine general manager and corporate sustainability committee.',
      endDate: 'Sep 2025',
    },
    {
      id: 'stg-5',
      orderIndex: 5,
      stageName: '5. Implement Reduction Actions',
      status: 'In Progress' as StageStatus,
      progressPercent: 42,
      target: '8-12% direct operational diesel abatement',
      plannedAction: 'Haul road regrading (10% to 7% slope), telematics auto-idle limiters, and variable speed pump motor drives.',
      endDate: 'Dec 2026',
    },
    {
      id: 'stg-6',
      orderIndex: 6,
      stageName: '6. Monitor Progress',
      status: 'In Progress' as StageStatus,
      progressPercent: 35,
      target: 'Monthly variance audits against 960 t trajectory',
      plannedAction: 'Conduct periodic comparisons of shift fuel logs against baseline targets; publish quarterly audit reports.',
      endDate: 'Dec 2027',
    },
    {
      id: 'stg-7',
      orderIndex: 7,
      stageName: '7. Long-Term Neutrality',
      status: 'Not Started' as StageStatus,
      progressPercent: 0,
      target: 'Net-Zero operational footprint by 2045',
      plannedAction: 'Deploy 20 MW captive pit-head solar PV array, battery electric haulers, and bio-sequestration afforestation over reclaimed overburden.',
      endDate: '2045 Horizon',
    },
  ];

  // Merge database stages with the 7 standard stages
  const activeStages = defaultStages.map((def) => {
    const matched = stages.find((s) => s.orderIndex === def.orderIndex || s.stageName.includes(def.stageName));
    if (matched) {
      return {
        ...def,
        ...matched,
        id: matched.id || def.id,
      };
    }
    return def;
  });

  const overallProgress = Math.round(
    activeStages.reduce((acc, s) => acc + s.progressPercent, 0) / activeStages.length
  );

  const handleEditClick = (stage: typeof activeStages[0]) => {
    setEditingStage(stage as unknown as RoadmapStage);
    setStatusVal(stage.status);
    setProgressVal(stage.progressPercent);
    setTargetVal(stage.target);
    setActionVal(stage.plannedAction);
    setDeadlineVal(stage.endDate);
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage) return;

    try {
      await onUpdateStage(editingStage.id, {
        status: statusVal,
        progressPercent: progressVal,
        target: targetVal,
        plannedAction: actionVal,
        endDate: deadlineVal,
      });
      setToast(`Stage "${editingStage.stageName}" updated successfully.`);
      setModalOpen(false);
      setTimeout(() => setToast(null), 3500);
    } catch {
      setToast('Failed to update roadmap stage.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Milestone className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Coal Mine Carbon Neutrality Roadmap</h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Structured 7-stage pathway guiding the facility from initial baseline accounting through targeted hotspot reductions to long-term carbon neutrality.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Overall Roadmap Progress</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{overallProgress}% Complete</div>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90">
                <circle cx="24" cy="24" r="18" stroke="#334155" strokeWidth="3" fill="none" />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  stroke="#10b981"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${(overallProgress / 100) * 113} 113`}
                />
              </svg>
            </div>
          </div>
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

      {/* 2. POLISHED VERTICAL ROADMAP (7 Stages, easy to scan) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {activeStages.map((stage, idx) => {
            const isCompleted = stage.status === 'Completed';
            const isInProgress = stage.status === 'In Progress';
            const isNotStarted = stage.status === 'Not Started';

            return (
              <div key={stage.id} className="relative group">
                {/* Timeline Node Icon on vertical line */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-xs'
                      : isInProgress
                      ? 'bg-slate-900 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  ) : isInProgress ? (
                    <CircleDot className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Stage Content Card */}
                <div className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all shadow-xs space-y-3">
                  {/* Row 1: Title, Status, Edit Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {stage.stageName}
                      </h3>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : isInProgress
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {stage.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {stage.progressPercent}%
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEditClick(stage)}
                        className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Update stage"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${stage.progressPercent}%` }}
                    ></div>
                  </div>

                  {/* Row 3: Target, Action, Deadline in 3 Clean Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    {/* Target */}
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-[10px] uppercase font-mono text-amber-400 block font-semibold">
                        Target Objective
                      </span>
                      <span className="text-slate-200 mt-1 block leading-tight font-medium">
                        {stage.target}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                        Planned Action
                      </span>
                      <span className="text-slate-300 mt-1 block leading-tight">
                        {stage.plannedAction}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                        Target Deadline
                      </span>
                      <span className="text-white font-mono font-bold mt-1 block">
                        {stage.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Stage Modal */}
      {modalOpen && editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSaveModal}
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                Update {editingStage.stageName}
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as StageStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Not Started">Not Started</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Progress % ({progressVal}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progressVal}
                    onChange={(e) => setProgressVal(Number(e.target.value))}
                    className="w-full mt-2 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Target Objective</label>
                <input
                  type="text"
                  required
                  value={targetVal}
                  onChange={(e) => setTargetVal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Planned Action</label>
                <textarea
                  rows={2}
                  required
                  value={actionVal}
                  onChange={(e) => setActionVal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Deadline</label>
                <input
                  type="text"
                  required
                  value={deadlineVal}
                  onChange={(e) => setDeadlineVal(e.target.value)}
                  placeholder="e.g. Q4 2026 or Dec 2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs shadow-emerald-950"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Stage</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
