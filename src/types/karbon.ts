export type UserRole = 'Administrator' | 'Field Officer' | 'Mine Operations Manager';

export type ActivityCategory = 'Diesel / Fuel' | 'Electricity' | 'Transportation' | 'Other Operations';

export type MineType = 'Opencast' | 'Underground' | 'Mixed';

export type TargetStatus = 'Active' | 'Completed' | 'Pending';

export type StageStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Under Review';

export type PageTab =
  | 'landing'
  | 'dashboard'
  | 'mine-profile'
  | 'activity-entry'
  | 'calculation'
  | 'analysis'
  | 'targets'
  | 'simulator'
  | 'roadmap'
  | 'progress'
  | 'reports';

export interface MineProfile {
  mineName: string;
  mineId: string;
  location: string;
  mineType: MineType;
  reportingPeriod: string;
  responsiblePerson: string;
  productionCapacityMTPA: number;
  contactEmail?: string;
  operationalStatus: 'Active' | 'Under Maintenance' | 'Restricted';
}

export interface ActivityRecord {
  id: string;
  category: ActivityCategory;
  activityName: string;
  quantity: number;
  unit: string;
  reportingPeriod: string;
  dateRecorded: string;
  sourceDocRef?: string;
  loggedBy: string;
  role: 'Administrator' | 'Field Officer';
  notes?: string;
}

export interface CalculatedEmissionItem {
  id: string;
  activityId?: string;
  sourceCategory: string;
  activityName: string;
  activityQuantity: number;
  activityUnit: string;
  emissionFactor: number;
  factorUnit: string;
  scope: string;
  isDemoFactor: boolean;
  calculatedCO2eKg: number;
  calculatedCO2eTonnes: number;
  reportingPeriod: string;
  date: string;
  notes?: string;
}

export interface SourceBreakdownItem {
  category: string;
  totalCO2eTonnes: number;
  percentage: number;
  activityCount: number;
}

export interface EmissionHotspot {
  highestSource: string;
  highestCO2eTonnes: number;
  percentageOfTotal: number;
  potentialFocusArea: string;
  recommendedActions: string[];
}

export interface EmissionSummary {
  reportingPeriod: string;
  totalCO2eKg: number;
  totalCO2eTonnes: number;
  previousPeriod?: string;
  previousPeriodTonnes?: number;
  deltaTonnes?: number;
  deltaPercent?: number;
  sourceBreakdown: SourceBreakdownItem[];
  hotspot: EmissionHotspot;
  scopeBreakdown: {
    scope1Tonnes: number;
    scope2Tonnes: number;
    scope3Tonnes: number;
  };
  items: CalculatedEmissionItem[];
  isDemoData: boolean;
  factorDisclaimer: string;
}

export interface ReductionTarget {
  id: string;
  targetName: string;
  baselineEmissions: number;
  baselinePeriod: string;
  targetReductionPercent: number;
  targetEmissionValue: number;
  currentEmissionValue?: number;
  reductionAchieved?: number;
  remainingReduction?: number;
  completionPercent?: number;
  startDate: string;
  targetDate: string;
  reductionAction: string;
  focusCategory: ActivityCategory | 'Cross-Cutting';
  status: TargetStatus;
  notes?: string;
}

export interface RoadmapStage {
  id: string;
  stageKey: string;
  orderIndex: number;
  stageName: string;
  description: string;
  target: string;
  plannedAction: string;
  startDate: string;
  endDate: string;
  status: StageStatus;
  progressPercent: number;
  keyDeliverable?: string;
  responsibleLead?: string;
}

export interface MonthlyEmissionHistory {
  month: string;
  label: string;
  diesel: number;
  electricity: number;
  transportation: number;
  other: number;
  total: number;
  target: number;
}

export interface ProgressData {
  baselineEmissions: number;
  currentEmissions: number;
  targetEmissions: number;
  reductionAchieved: number;
  remainingReduction: number;
  targetCompletionPercentage: number;
  overallRoadmapProgress: number;
  historicalMonthly: MonthlyEmissionHistory[];
  isDemoData: boolean;
  terminologyNote: string;
}

export interface EmissionFactorConfig {
  id: string;
  category: string;
  activityName: string;
  unit: string;
  factorValue: number;
  factorUnit: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  sourceReference: string;
  isVerified: boolean;
  notes: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  sourceCategory: ActivityCategory | 'All Sources';
  reductionPercent: number;
  currentFootprint: number;
  projectedFootprint: number;
  estimatedReduction: number;
  targetGap: number;
  overallImpactPercent: number;
  targetId?: string;
  createdAt: string;
}
