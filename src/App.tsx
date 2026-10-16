/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PageTab,
  UserRole,
  MineProfile,
  ActivityRecord,
  EmissionSummary,
  ReductionTarget,
  RoadmapStage,
  ProgressData,
  EmissionFactorConfig,
  SimulationScenario,
} from './types/karbon.ts';
import {
  getMineProfile,
  updateMineProfile,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getEmissions,
  getTargets,
  createTarget,
  updateTarget,
  deleteTarget,
  getRoadmap,
  createRoadmapStage,
  updateRoadmapStage,
  getProgress,
  getFactors,
  updateFactor,
  resetDemoData,
} from './services/api.ts';

import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { MineProfilePage } from './pages/MineProfilePage.tsx';
import { ActivityDataEntryPage } from './pages/ActivityDataEntryPage.tsx';
import { CarbonCalculationPage } from './pages/CarbonCalculationPage.tsx';
import { EmissionAnalysisPage } from './pages/EmissionAnalysisPage.tsx';
import { ReductionTargetsPage } from './pages/ReductionTargetsPage.tsx';
import { RoadmapPage } from './pages/RoadmapPage.tsx';
import { ProgressTrackingPage } from './pages/ProgressTrackingPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage.tsx';
import { INITIAL_MINE_PROFILE, DEFAULT_EMISSION_FACTORS } from './data/fallbackData.ts';
import { Database, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Administrator');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-10');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Application Data States
  const [mineProfile, setMineProfile] = useState<MineProfile>(INITIAL_MINE_PROFILE);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [emissions, setEmissions] = useState<EmissionSummary | null>(null);
  const [targets, setTargets] = useState<ReductionTarget[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapStage[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [factors, setFactors] = useState<Record<string, EmissionFactorConfig>>(DEFAULT_EMISSION_FACTORS);

  // Database Connection Health State
  const [dbState, setDbState] = useState<{
    connected: boolean;
    database: string;
    lastError: string | null;
  }>({
    connected: false,
    database: 'karbonDB',
    lastError: null,
  });

  // What-If Scenarios (up to 3 saved scenarios)
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([
    {
      id: 'sim-1',
      name: '20% Diesel Efficiency & Haul Optimization',
      sourceCategory: 'Diesel / Fuel',
      reductionPercent: 20,
      currentFootprint: 1144.24,
      projectedFootprint: 1047.13,
      estimatedReduction: 97.11,
      targetGap: 87.13,
      overallImpactPercent: 8.5,
      createdAt: 'Oct 02, 2025',
    },
    {
      id: 'sim-2',
      name: '15% Preparation Plant VFD & Solar Switch',
      sourceCategory: 'Electricity',
      reductionPercent: 15,
      currentFootprint: 1144.24,
      projectedFootprint: 1094.59,
      estimatedReduction: 49.65,
      targetGap: 134.59,
      overallImpactPercent: 4.3,
      createdAt: 'Oct 03, 2025',
    },
  ]);

  const handleSaveScenario = (scenario: SimulationScenario) => {
    setScenarios((prev) => [scenario, ...prev.filter((s) => s.id !== scenario.id)].slice(0, 3));
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isRetryingDb, setIsRetryingDb] = useState<boolean>(false);

  // Check real health and MongoDB Atlas connection status
  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const json = await res.json();
        const connected = !!json.mongodb?.connected;
        setDbState({
          connected,
          database: json.database || 'karbonDB',
          lastError: json.mongodb?.lastError || null,
        });
        if (!connected) {
          setNetworkError(json.mongodb?.lastError || 'MongoDB Atlas is currently disconnected. Verify IP access list.');
        } else {
          setNetworkError(null);
        }
      }
    } catch {
      // ignore transient network check errors
    }
  };

  // Fetch all initial data from REST API
  const refreshAllData = async (periodOverride?: string) => {
    const period = periodOverride !== undefined ? periodOverride : selectedPeriod;
    try {
      await checkHealth();

      const [
        mineRes,
        actRes,
        emisRes,
        targetRes,
        roadRes,
        progRes,
        factRes,
      ] = await Promise.all([
        getMineProfile().catch(() => INITIAL_MINE_PROFILE),
        getActivities(period === 'all' ? undefined : period).catch(() => []),
        getEmissions(period === 'all' ? '2025-10' : period).catch(() => null),
        getTargets().catch(() => []),
        getRoadmap().catch(() => []),
        getProgress().catch(() => null),
        getFactors().catch(() => DEFAULT_EMISSION_FACTORS),
      ]);

      if (mineRes) setMineProfile(mineRes);
      setActivities(actRes);
      setEmissions(emisRes);
      setTargets(targetRes);
      setRoadmap(roadRes);
      setProgress(progRes);
      setFactors(factRes);
    } catch (err) {
      console.warn('[KARBON] Data synchronization fallback triggered:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [selectedPeriod]);

  // Periodic health check
  useEffect(() => {
    const timer = setInterval(() => {
      checkHealth();
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const handleManualDbRetry = async () => {
    setIsRetryingDb(true);
    try {
      await checkHealth();
      await refreshAllData();
    } finally {
      setIsRetryingDb(false);
    }
  };

  // Handlers for CRUD operations (Enforce real error feedback)
  const handleUpdateProfile = async (updated: MineProfile) => {
    try {
      setNetworkError(null);
      const res = await updateMineProfile(updated);
      setMineProfile(res);
    } catch (err: any) {
      setNetworkError(`Data was NOT saved: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleCreateActivity = async (record: Omit<ActivityRecord, 'id'>) => {
    try {
      setNetworkError(null);
      await createActivity(record);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Activity record was NOT saved: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleUpdateActivity = async (id: string, updated: Partial<ActivityRecord>) => {
    try {
      setNetworkError(null);
      await updateActivity(id, updated);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Activity update was NOT saved: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      setNetworkError(null);
      await deleteActivity(id);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Activity deletion failed: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleCreateTarget = async (newTarget: Omit<ReductionTarget, 'id'>) => {
    try {
      setNetworkError(null);
      await createTarget(newTarget);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Reduction target was NOT saved: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleUpdateTarget = async (id: string, updated: Partial<ReductionTarget>) => {
    try {
      setNetworkError(null);
      await updateTarget(id, updated);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Target update was NOT saved: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleDeleteTarget = async (id: string) => {
    try {
      setNetworkError(null);
      await deleteTarget(id);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Target deletion failed: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleCreateRoadmapStage = async (stage: Partial<RoadmapStage>) => {
    try {
      setNetworkError(null);
      await createRoadmapStage(stage);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Roadmap stage was NOT saved: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleUpdateRoadmapStage = async (id: string, updated: Partial<RoadmapStage>) => {
    try {
      setNetworkError(null);
      await updateRoadmapStage(id, updated);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Roadmap update was NOT saved: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleUpdateFactor = async (key: string, updated: Partial<EmissionFactorConfig>) => {
    try {
      setNetworkError(null);
      await updateFactor(key, updated);
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Emission factor update was NOT saved: ${err.message || 'MongoDB Atlas is unavailable'}.`);
      throw err;
    }
  };

  const handleResetData = async () => {
    try {
      setNetworkError(null);
      await resetDemoData();
      await refreshAllData();
    } catch (err: any) {
      setNetworkError(`Database reset failed: ${err.message || 'MongoDB Atlas is unavailable'}.`);
    }
  };

  // Render individual page content
  const renderPageContent = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage
            onNavigate={setCurrentTab}
            onSelectRole={setUserRole}
          />
        );

      case 'dashboard':
        return (
          <DashboardPage
            emissions={emissions}
            progress={progress}
            targets={targets}
            roadmap={roadmap}
            mineProfile={mineProfile}
            userRole={userRole}
            selectedPeriod={selectedPeriod}
            onNavigate={setCurrentTab}
          />
        );

      case 'mine-profile':
        return (
          <MineProfilePage
            profile={mineProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );

      case 'activity-entry':
        return (
          <ActivityDataEntryPage
            activities={activities}
            userRole={userRole}
            selectedPeriod={selectedPeriod}
            onCreateActivity={handleCreateActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        );

      case 'calculation':
        return (
          <CarbonCalculationPage
            emissions={emissions}
            factors={factors}
            onUpdateFactor={handleUpdateFactor}
            userRole={userRole}
            selectedPeriod={selectedPeriod}
          />
        );

      case 'analysis':
        return (
          <EmissionAnalysisPage
            emissions={emissions}
            progress={progress}
            selectedPeriod={selectedPeriod}
            onNavigate={setCurrentTab}
          />
        );

      case 'targets':
        return (
          <ReductionTargetsPage
            targets={targets}
            userRole={userRole}
            onCreateTarget={handleCreateTarget}
            onUpdateTarget={handleUpdateTarget}
            onDeleteTarget={handleDeleteTarget}
          />
        );

      case 'simulator':
        return (
          <WhatIfSimulatorPage
            emissions={emissions}
            targets={targets}
            scenarios={scenarios}
            onSaveScenario={handleSaveScenario}
            onDeleteScenario={handleDeleteScenario}
            onNavigate={setCurrentTab}
          />
        );

      case 'roadmap':
        return (
          <RoadmapPage
            stages={roadmap}
            userRole={userRole}
            onCreateStage={handleCreateRoadmapStage}
            onUpdateStage={handleUpdateRoadmapStage}
          />
        );

      case 'progress':
        return (
          <ProgressTrackingPage
            progress={progress}
            emissions={emissions}
            onNavigate={setCurrentTab}
          />
        );

      case 'reports':
        return (
          <ReportsPage
            mineProfile={mineProfile}
            emissions={emissions}
            targets={targets}
            roadmap={roadmap}
            scenarios={scenarios}
            userRole={userRole}
            selectedPeriod={selectedPeriod}
          />
        );

      default:
        return (
          <DashboardPage
            emissions={emissions}
            progress={progress}
            targets={targets}
            roadmap={roadmap}
            mineProfile={mineProfile}
            userRole={userRole}
            selectedPeriod={selectedPeriod}
            onNavigate={setCurrentTab}
          />
        );
    }
  };

  // If viewing the Landing page standalone
  if (currentTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
        <LandingPage
          onNavigate={setCurrentTab}
          onSelectRole={setUserRole}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col overflow-x-hidden">
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        userRole={userRole}
        onChangeRole={setUserRole}
        mineProfile={mineProfile}
        selectedPeriod={selectedPeriod}
        onChangePeriod={setSelectedPeriod}
        onResetData={handleResetData}
        onPrintReport={() => window.print()}
        onToggleMobileSidebar={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative z-50 w-72 bg-slate-900 border-r border-slate-800 h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono font-bold text-white text-sm">KARBON Navigation</span>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <Sidebar
              currentTab={currentTab}
              onNavigate={setCurrentTab}
              userRole={userRole}
              onCloseMobile={() => setIsMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main SaaS Layout: Left Docked Fixed Sidebar + Main Scrollable Area */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar: Fixed comfortable size (w-72), docked to the left, full height, no blank bottom scroll */}
        <div className="hidden md:block shrink-0 w-72 sticky top-14 h-[calc(100vh-3.5rem)] z-20">
          <Sidebar
            currentTab={currentTab}
            onNavigate={setCurrentTab}
            userRole={userRole}
          />
        </div>

        {/* Content View with min-w-0 to prevent horizontal blowout */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full min-w-0">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* MongoDB Atlas Persistence Banner (Displays connection status or whitelist instruction) */}
            {networkError && (
              <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-4 text-amber-200 text-sm flex items-start justify-between gap-3 shadow-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300">MongoDB Atlas Status:</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-amber-900/60 border border-amber-700/50 text-amber-200">
                        {dbState.database} (Disconnected)
                      </span>
                    </div>
                    <p className="text-amber-200/90 text-xs leading-relaxed">
                      {networkError}
                    </p>
                    <div className="text-[11px] text-amber-300/80 pt-1 font-mono">
                      To permanently view collections in Atlas: Go to MongoDB Atlas → Network Access → Add IP Address → Click &quot;Allow Access from Anywhere&quot; (0.0.0.0/0).
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleManualDbRetry}
                    disabled={isRetryingDb}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRetryingDb ? 'animate-spin' : ''}`} />
                    <span>Retry</span>
                  </button>
                  <button
                    onClick={() => setNetworkError(null)}
                    className="text-amber-400/80 hover:text-white text-xs px-2 py-1 rounded hover:bg-amber-900/40 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Render Active View Tab */}
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
