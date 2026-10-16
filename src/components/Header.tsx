import React, { useState } from 'react';
import {
  Flame,
  User,
  ChevronDown,
  Menu,
  Building2,
  Calendar,
  Check,
} from 'lucide-react';
import { UserRole, MineProfile, PageTab } from '../types/karbon.ts';

interface HeaderProps {
  currentTab: PageTab;
  onNavigate: (tab: PageTab) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  mineProfile: MineProfile;
  selectedPeriod: string;
  onChangePeriod: (period: string) => void;
  onResetData?: () => void;
  onPrintReport?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  userRole,
  onChangeRole,
  mineProfile,
  selectedPeriod,
  onChangePeriod,
  onToggleMobileSidebar,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mineDropdownOpen, setMineDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'Administrator', label: 'Administrator', desc: 'Full configuration & target authoring' },
    { role: 'Field Officer', label: 'Field Officer', desc: 'Operational logbook data entry' },
    { role: 'Mine Operations Manager', label: 'Operations Manager', desc: 'Oversight & progress audits' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 h-14">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          {/* LEFT: Mobile Toggle + KARBON Logo / Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {onToggleMobileSidebar && (
              <button
                type="button"
                onClick={onToggleMobileSidebar}
                className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Toggle Navigation Menu"
                aria-label="Toggle navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-500 transition-colors">
                <Flame className="w-4 h-4 text-emerald-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-wider text-white font-mono leading-none">
                  KARBON
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block leading-tight mt-0.5">
                  Coal Mine Carbon Management
                </span>
              </div>
            </button>
          </div>

          {/* CENTER: Selected Mine */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMineDropdownOpen(!mineDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/70 transition-colors text-left cursor-pointer"
                title="Active Mine Facility"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px] lg:max-w-[280px]">
                  {mineProfile.mineName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {mineDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-40">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Selected Facility</span>
                    <span className="text-xs font-semibold text-white block mt-0.5">{mineProfile.mineName}</span>
                    <span className="text-[10px] text-slate-400 block">{mineProfile.mineId} · {mineProfile.mineType} Mine</span>
                  </div>
                  <button
                    onClick={() => {
                      setMineDropdownOpen(false);
                      onNavigate('mine-profile');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-emerald-400 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Edit Facility Profile</span>
                    <span className="text-[10px] text-slate-400">Settings →</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Reporting Period + User/Admin Menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Reporting Period Filter */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/70 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 hidden sm:inline-block" />
              <select
                aria-label="Select reporting period"
                value={selectedPeriod}
                onChange={(e) => onChangePeriod(e.target.value)}
                className="bg-transparent text-emerald-300 font-medium text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="2025-10" className="bg-slate-900 text-white">October 2025</option>
                <option value="2025-09" className="bg-slate-900 text-white">September 2025</option>
                <option value="all" className="bg-slate-900 text-white">All Records</option>
              </select>
            </div>

            {/* Administrator / User Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-xs max-w-[100px] sm:max-w-none truncate">{userRole}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-40">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Carbon Management Workspace</span>
                  </div>
                  {roles.map((r) => {
                    const isCurrent = userRole === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          onChangeRole(r.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-start justify-between transition-colors ${
                          isCurrent ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div>
                          <div>{r.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal leading-tight">{r.desc}</div>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
