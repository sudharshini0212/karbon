import React, { useState } from 'react';
import {
  ClipboardPenLine,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertCircle,
  Fuel,
  Zap,
  Truck,
  FileSpreadsheet,
  Calculator,
  Save,
  X,
  Calendar,
  Layers,
} from 'lucide-react';
import { ActivityRecord, ActivityCategory, UserRole } from '../types/karbon.ts';

interface ActivityDataEntryPageProps {
  activities: ActivityRecord[];
  userRole: UserRole;
  selectedPeriod: string;
  onCreateActivity: (record: Omit<ActivityRecord, 'id'>) => Promise<void>;
  onUpdateActivity: (id: string, updated: Partial<ActivityRecord>) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
}

export const ActivityDataEntryPage: React.FC<ActivityDataEntryPageProps> = ({
  activities,
  userRole,
  selectedPeriod,
  onCreateActivity,
  onUpdateActivity,
  onDeleteActivity,
}) => {
  // Tabs: Fuel, Electricity, Transportation, Other
  const [activeTab, setActiveTab] = useState<'Fuel' | 'Electricity' | 'Transportation' | 'Other'>('Fuel');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [calculatedPreview, setCalculatedPreview] = useState<{ kg: number; tonnes: number } | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportingPeriod, setReportingPeriod] = useState(selectedPeriod === 'all' ? '2025-10' : selectedPeriod);
  const [activityType, setActivityType] = useState('Heavy Excavator Cat 6020B (Pit 4)');
  const [quantity, setQuantity] = useState<number | ''>(45000);
  const [unit, setUnit] = useState('litres');
  const [sourceDocRef, setSourceDocRef] = useState('Fuel Dispenser Slip #402');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map simplified tab to ActivityCategory
  const getCategoryFromTab = (tab: 'Fuel' | 'Electricity' | 'Transportation' | 'Other'): ActivityCategory => {
    switch (tab) {
      case 'Fuel':
        return 'Diesel / Fuel';
      case 'Electricity':
        return 'Electricity';
      case 'Transportation':
        return 'Transportation';
      case 'Other':
        return 'Other Operations';
    }
  };

  // Switch tab and load sensible defaults
  const handleTabChange = (tab: 'Fuel' | 'Electricity' | 'Transportation' | 'Other') => {
    setActiveTab(tab);
    setCalculatedPreview(null);
    if (!editingId) {
      switch (tab) {
        case 'Fuel':
          setActivityType('Heavy Excavator Cat 6020B (Pit 4)');
          setQuantity(45000);
          setUnit('litres');
          setSourceDocRef('Fuel Dispenser Log #402');
          break;
        case 'Electricity':
          setActivityType('Coal Handling Plant Crusher & Conveyors');
          setQuantity(120000);
          setUnit('kWh');
          setSourceDocRef('Substation Meter #01 Invoice');
          break;
        case 'Transportation':
          setActivityType('100T Belaz Haul Dump Trucks');
          setQuantity(28000);
          setUnit('litres');
          setSourceDocRef('Haulage Dispatch Ticket #910');
          break;
        case 'Other':
          setActivityType('Overburden ANFO Blasting Explosives');
          setQuantity(25000);
          setUnit('kg');
          setSourceDocRef('Magazine Explosives Ledger #884');
          break;
      }
    }
  };

  // Demo Emission Factors for in-form calculation preview
  const getDemoFactor = (cat: ActivityCategory): number => {
    switch (cat) {
      case 'Diesel / Fuel':
        return 2.68; // kg CO2e / litre
      case 'Electricity':
        return 0.82; // kg CO2e / kWh
      case 'Transportation':
        return 2.68; // kg CO2e / litre
      case 'Other Operations':
        return 0.17; // kg CO2e / kg ANFO
      default:
        return 1.0;
    }
  };

  const handleCalculate = () => {
    if (quantity === '' || Number(quantity) <= 0) {
      setNotification({ type: 'error', msg: 'Please enter a valid positive quantity to calculate.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    const cat = getCategoryFromTab(activeTab);
    const factor = getDemoFactor(cat);
    const kg = Number((Number(quantity) * factor).toFixed(2));
    const tonnes = Number((kg / 1000).toFixed(3));
    setCalculatedPreview({ kg, tonnes });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity === '' || Number(quantity) <= 0) {
      setNotification({ type: 'error', msg: 'Quantity must be a valid positive number.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsSubmitting(true);
    const cat = getCategoryFromTab(activeTab);

    try {
      if (editingId) {
        await onUpdateActivity(editingId, {
          category: cat,
          activityName: activityType,
          quantity: Number(quantity),
          unit,
          reportingPeriod,
          dateRecorded: date,
          sourceDocRef,
          notes,
        });
        setNotification({ type: 'success', msg: `Activity record "${activityType}" updated successfully.` });
        setEditingId(null);
      } else {
        await onCreateActivity({
          category: cat,
          activityName: activityType,
          quantity: Number(quantity),
          unit,
          reportingPeriod,
          dateRecorded: date,
          sourceDocRef,
          loggedBy: userRole === 'Administrator' ? 'Er. R. Sharma (Admin)' : 'Operational Shift Officer',
          role: userRole === 'Administrator' ? 'Administrator' : 'Field Officer',
          notes,
        });
        setNotification({ type: 'success', msg: `Activity record "${activityType}" saved to operational logbook.` });
      }

      setShowForm(false);
      setCalculatedPreview(null);
      setTimeout(() => setNotification(null), 3500);
    } catch {
      setNotification({ type: 'error', msg: 'Failed to save activity record. Please retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setCalculatedPreview(null);
  };

  const handleStartEdit = (rec: ActivityRecord) => {
    setEditingId(rec.id);
    setDate(rec.dateRecorded);
    setReportingPeriod(rec.reportingPeriod);
    setActivityType(rec.activityName);
    setQuantity(rec.quantity);
    setUnit(rec.unit);
    setSourceDocRef(rec.sourceDocRef || '');
    setNotes(rec.notes || '');

    // Set matching tab
    if (rec.category === 'Diesel / Fuel') setActiveTab('Fuel');
    else if (rec.category === 'Electricity') setActiveTab('Electricity');
    else if (rec.category === 'Transportation') setActiveTab('Transportation');
    else setActiveTab('Other');

    setShowForm(true);
  };

  // Filter activities by current tab and search query
  const targetCategory = getCategoryFromTab(activeTab);
  const filteredActivities = activities.filter((act) => {
    const matchesCategory = act.category === targetCategory;
    const matchesPeriod = selectedPeriod === 'all' || act.reportingPeriod === selectedPeriod;
    const matchesQuery =
      searchQuery === '' ||
      act.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.sourceDocRef && act.sourceDocRef.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesPeriod && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Explanation Banner as explicitly requested */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardPenLine className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Activity Data Entry</h1>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Enter periodic operational data from mine records. KARBON uses these values to calculate and monitor carbon emissions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setCalculatedPreview(null);
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs shadow-emerald-950"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showForm ? 'Close Entry Form' : 'New Logbook Entry'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 text-xs rounded-lg flex items-center justify-between shadow-md ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border border-emerald-700 text-emerald-200'
              : 'bg-rose-950/90 border border-rose-700 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* TABS: Fuel, Electricity, Transportation, Other */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-wrap gap-2">
        {(
          [
            { id: 'Fuel', label: 'Fuel / Diesel', icon: Fuel, count: activities.filter((a) => a.category === 'Diesel / Fuel').length },
            { id: 'Electricity', label: 'Electricity', icon: Zap, count: activities.filter((a) => a.category === 'Electricity').length },
            { id: 'Transportation', label: 'Transportation', icon: Truck, count: activities.filter((a) => a.category === 'Transportation').length },
            { id: 'Other', label: 'Other Operations', icon: FileSpreadsheet, count: activities.filter((a) => a.category === 'Other Operations').length },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 min-w-[140px] px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* CLEAN INLINE ENTRY FORM */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-emerald-500/40 rounded-xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h2 className="text-sm font-bold text-white">
                {editingId ? 'Edit Activity Record' : `New ${activeTab} Operational Entry`}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Category: {getCategoryFromTab(activeTab)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Field 1: Date */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Date Recorded *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Field 2: Reporting Period */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Reporting Period *
              </label>
              <input
                type="text"
                required
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                placeholder="YYYY-MM (e.g. 2025-10)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Field 3: Activity Type */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Activity Type / Equipment *
              </label>
              <input
                type="text"
                required
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                placeholder="e.g. Heavy Excavator Cat 6020B"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Field 4: Quantity */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Quantity *
              </label>
              <input
                type="number"
                step="any"
                required
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 45000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Field 5: Unit */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="litres">litres (Diesel/Fuel)</option>
                <option value="kWh">kWh (Grid Electricity)</option>
                <option value="MWh">MWh (Industrial Substation)</option>
                <option value="kg">kg (ANFO/Emulsion)</option>
                <option value="tonnes">tonnes (Ore/Overburden)</option>
                <option value="m3">m³ (Fugitive Methane)</option>
              </select>
            </div>

            {/* Source Document Reference */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Source Document Reference (Invoice/Slip/Log)
              </label>
              <input
                type="text"
                value={sourceDocRef}
                onChange={(e) => setSourceDocRef(e.target.value)}
                placeholder="e.g. Fuel Dispenser Log #402, Meter Invoice #112"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Operational Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Shift pit assignment, contractor ID, or calibration notes"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* In-form Calculation Preview Banner */}
          {calculatedPreview && (
            <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  Estimated Footprint: <strong className="font-mono text-emerald-300">{calculatedPreview.kg.toLocaleString()} kg CO₂e</strong> ({calculatedPreview.tonnes.toLocaleString()} tCO₂e)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Factor: {getDemoFactor(getCategoryFromTab(activeTab))} kg/unit</span>
            </div>
          )}

          {/* Buttons: Calculate, Save Record, Cancel */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCalculate}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Calculate</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs shadow-emerald-950 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{editingId ? 'Update Record' : 'Save Record'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <span>{activeTab} Logbook Records</span>
          <span className="text-slate-500 font-normal">({filteredActivities.length} items)</span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records or invoice #..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* TABLE OF SAVED RECORDS (AFTER SAVING, SHOW RECORD IN TABLE BELOW) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Activity / Equipment</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Source Doc Ref</th>
                <th className="py-3 px-4">Logged By</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {act.dateRecorded}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {act.reportingPeriod}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{act.activityName}</div>
                      <div className="text-[10px] text-slate-400">{act.notes || act.category}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-200 whitespace-nowrap">
                      {act.quantity.toLocaleString()} {act.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono text-[11px]">
                        {act.sourceDocRef || 'Log Entry'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {act.loggedBy}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(act)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Edit record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteActivity(act.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <ClipboardPenLine className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <div>No activity records in this category for {selectedPeriod === 'all' ? 'any period' : selectedPeriod}</div>
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      + Add first {activeTab} record
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
