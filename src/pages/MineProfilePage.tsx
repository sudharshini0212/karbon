import React from 'react';
import {
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Shield,
  Layers,
  Pickaxe,
} from 'lucide-react';
import { MineProfile, MineType } from '../types/karbon.ts';
import { DemoDataBadge } from '../components/DemoDataBadge.tsx';

interface MineProfilePageProps {
  profile: MineProfile;
  onUpdateProfile: (updated: MineProfile) => Promise<void>;
}

export const MineProfilePage: React.FC<MineProfilePageProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = React.useState<MineProfile>({ ...profile });
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      await onUpdateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Mine Operational Profile</h2>
            <DemoDataBadge label="Demo Configuration" />
          </div>
          <p className="text-xs text-slate-400">
            Define organizational boundaries, facility identifiers, and environmental accounting responsibilities.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
            ID: {formData.mineId}
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
            {formData.operationalStatus}
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Mine profile updated and synchronized with backend API successfully.</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-500/50 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mine Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Mine Facility Name</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.mineName}
              onChange={(e) => setFormData({ ...formData, mineName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="e.g. Singrauli Colliery Block-IV"
            />
            <span className="text-[11px] text-slate-400">Official registered title of the mining lease.</span>
          </div>

          {/* Mine ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Mine Identifier (ID)</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.mineId}
              onChange={(e) => setFormData({ ...formData, mineId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="e.g. M-IND-MP-042"
            />
            <span className="text-[11px] text-slate-400">Regulatory lease or DGMS / internal asset code.</span>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Location / Coal Basin</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="e.g. Singrauli Basin, Madhya Pradesh, India"
            />
          </div>

          {/* Mine Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Pickaxe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mine Extraction Type</span>
              <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.mineType}
              onChange={(e) => setFormData({ ...formData, mineType: e.target.value as MineType })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="Opencast">Opencast (Open-Pit / Strip Mining)</option>
              <option value="Underground">Underground (Bord & Pillar / Longwall)</option>
              <option value="Mixed">Mixed Method Mining</option>
            </select>
            <span className="text-[11px] text-slate-400">Determines fugitive methane and haulage assumptions.</span>
          </div>

          {/* Reporting Period */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Active Reporting Period</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.reportingPeriod}
              onChange={(e) => setFormData({ ...formData, reportingPeriod: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="e.g. October 2025 (Monthly)"
            />
          </div>

          {/* Responsible Person */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Responsible Environmental Officer / Manager</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.responsiblePerson}
              onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="e.g. Er. Rajeshwar Sharma (Chief Environmental Officer)"
            />
          </div>

          {/* Production Capacity */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Annual Production Capacity (MTPA - Million Tonnes / Annum)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.productionCapacityMTPA}
              onChange={(e) => setFormData({ ...formData, productionCapacityMTPA: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Operational Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Operational Status</label>
            <select
              value={formData.operationalStatus}
              onChange={(e) => setFormData({ ...formData, operationalStatus: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="Active">Active (Full Commercial Operations)</option>
              <option value="Under Maintenance">Under Maintenance / Overhaul</option>
              <option value="Restricted">Restricted Output / Seasonal Monsoon Protocol</option>
            </select>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Changes will update all generated carbon reports and audit ledgers.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
