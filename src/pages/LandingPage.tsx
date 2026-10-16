import React from 'react';
import {
  Flame,
  ArrowRight,
  Shield,
  FileCheck,
  TrendingDown,
  Milestone,
  CheckCircle2,
  HardHat,
  Gauge,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { PageTab, UserRole } from '../types/karbon.ts';

interface LandingPageProps {
  onNavigate: (tab: PageTab) => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectRole,
}) => {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>('Administrator');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogin = (role: UserRole, targetTab: PageTab = 'dashboard') => {
    setIsLoggingIn(true);
    onSelectRole(role);
    setTimeout(() => {
      onNavigate(targetTab);
    }, 200);
  };

  const steps = [
    { title: 'Operational Data', desc: 'Periodic fuel, electricity & fleet consumption records from logbooks', num: '01' },
    { title: 'Carbon Calculation', desc: 'Activity Data × Emission Factor = CO₂e emissions model', num: '02' },
    { title: 'Emission Analysis', desc: 'Source-wise contribution and monthly trends breakdown', num: '03' },
    { title: 'Hotspot Identification', desc: 'Pinpoint heavy excavators, dump trucks & high-emission drivers', num: '04' },
    { title: 'Reduction Targets', desc: 'Science-based interim milestones calibrated to mine life', num: '05' },
    { title: 'Reduction Actions', desc: 'Haul road regrading, captive solar, idle shutoff protocols', num: '06' },
    { title: 'Neutrality Roadmap', desc: 'Structured timeline leading to net-zero coal operations', num: '07' },
    { title: 'Progress Monitoring', desc: 'Periodic variance tracking against baseline trajectory', num: '08' },
  ];

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-radial-[at_top_center] from-slate-900 via-slate-950 to-slate-950 py-16 sm:py-24">
        {/* Subtle industrial grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Environmental Tech Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>COAL MINE CARBON MANAGEMENT PLATFORM</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400 font-mono text-[11px]">VERSION 1.0</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-3">
              <span className="font-mono text-emerald-400">KARBON</span>
            </h1>

            <div className="text-lg sm:text-2xl font-medium text-emerald-300 tracking-wider mb-6 font-mono">
              Measure • Reduce • Neutralize
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
              Calculate, analyse and manage carbon emissions from coal-mine operations while planning a structured path towards carbon neutrality.
            </p>

            {/* Core Differentiator Callout */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-4 sm:p-5 mb-10 text-left shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-800">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs uppercase font-semibold text-emerald-400 tracking-wider mb-1">
                    System Differentiator
                  </div>
                  <p className="text-sm font-semibold text-slate-100 italic leading-snug">
                    &ldquo;KARBON goes beyond measuring carbon emissions by converting emission data into a structured reduction and carbon-neutrality roadmap.&rdquo;
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Built for periodic manual record entry from weighbridges, fuel dispensers, and utility meters — no physical IoT sensors or hardware required.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action / Role Select Area */}
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-left">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Select Sign-In Profile
              </div>

              <div className="space-y-2 mb-5">
                {[
                  {
                    role: 'Administrator' as UserRole,
                    label: 'Environmental Administrator',
                    desc: 'Full configuration, emission factors & targets',
                    icon: Shield,
                  },
                  {
                    role: 'Field Officer' as UserRole,
                    label: 'Field Operational Officer',
                    desc: 'Logbook entry, fuel slips & meter readings',
                    icon: HardHat,
                  },
                  {
                    role: 'Mine Operations Manager' as UserRole,
                    label: 'Mine Operations Manager',
                    desc: 'Executive summaries, progress tracking & audits',
                    icon: Gauge,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[11px] text-slate-400 truncate">{item.desc}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleLogin(selectedRole, 'dashboard')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  <span>{isLoggingIn ? 'Entering...' : 'Login'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin(selectedRole, 'activity-entry')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Demo Coal Mine Model</span>
                <span className="text-emerald-400 font-mono">Singrauli Colliery IV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Stage Carbon Management Flow Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            Structured Decarbonization Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            From Operational Record to Carbon Neutrality
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A software-first management model calibrated to open-cast and underground coal mine operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 relative group hover:border-slate-700 transition-colors"
            >
              <div className="font-mono text-xs font-bold text-emerald-400 mb-2">
                STAGE {st.num}
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{st.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industrial Operational Integrity Notice */}
      <section className="py-10 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Zero Sensor Dependency Architecture</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
            KARBON eliminates unverified IoT streaming in harsh mining environments. All activity inputs come directly from verified operational records, fuel bowser dispensers, electrical utility billing meters, explosives magazines, and coal production tally sheets.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
            <span>✓ Scope 1 Direct Emissions</span>
            <span>✓ Scope 2 Electricity Grid Emissions</span>
            <span>✓ Activity × Factor Calculation Model</span>
            <span>✓ Verified Audit-Ready Reports</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold text-slate-200">KARBON</span>
            <span>• Coal Mine Carbon Management Platform</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Measure • Reduce • Neutralize
          </div>
        </div>
      </footer>
    </div>
  );
};
