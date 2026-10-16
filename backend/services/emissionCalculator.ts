import { DEFAULT_EMISSION_FACTORS } from '../config/emissionFactors.ts';
import type { EmissionFactorConfig } from '../config/emissionFactors.ts';

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

export interface EmissionCalculationSummary {
  reportingPeriod: string;
  totalCO2eKg: number;
  totalCO2eTonnes: number;
  sourceBreakdown: {
    category: string;
    totalCO2eTonnes: number;
    percentage: number;
    activityCount: number;
  }[];
  hotspot: {
    highestSource: string;
    highestCO2eTonnes: number;
    percentageOfTotal: number;
    potentialFocusArea: string;
    recommendedActions: string[];
  };
  scopeBreakdown: {
    scope1Tonnes: number;
    scope2Tonnes: number;
    scope3Tonnes: number;
  };
  items: CalculatedEmissionItem[];
}

export function matchFactorForActivity(
  category: string,
  activityName: string,
  customFactors?: Record<string, EmissionFactorConfig>
): EmissionFactorConfig {
  const factors = customFactors || DEFAULT_EMISSION_FACTORS;

  const lowerName = activityName.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerCat.includes('diesel') || lowerCat.includes('fuel')) {
    return factors.diesel || DEFAULT_EMISSION_FACTORS.diesel;
  }
  if (lowerCat.includes('electric') || lowerName.includes('kwh') || lowerName.includes('power')) {
    return factors.electricity || DEFAULT_EMISSION_FACTORS.electricity;
  }
  if (lowerCat.includes('transport') || lowerName.includes('haul') || lowerName.includes('truck')) {
    return factors.transportation || DEFAULT_EMISSION_FACTORS.transportation;
  }
  if (lowerName.includes('explosive') || lowerName.includes('anfo') || lowerName.includes('blast')) {
    return factors.explosives || DEFAULT_EMISSION_FACTORS.explosives;
  }
  if (lowerName.includes('methane') || lowerName.includes('fugitive') || lowerName.includes('gas')) {
    return factors.methane || DEFAULT_EMISSION_FACTORS.methane;
  }
  if (lowerName.includes('pump') || lowerName.includes('water')) {
    return factors.water_pumping || DEFAULT_EMISSION_FACTORS.water_pumping;
  }

  // Fallback default
  return {
    id: 'general_other',
    category: category,
    activityName: activityName,
    unit: 'units',
    factorValue: 1.5,
    factorUnit: 'kg CO₂e / unit',
    scope: 'Scope 1',
    sourceReference: 'Demo Indicative Factor',
    isVerified: false,
    notes: 'Demo emission factor — replace with verified factor before deployment.',
  };
}

export function calculateEmissionsForActivities(
  activities: Array<{
    id?: string;
    category: string;
    activityName: string;
    quantity: number;
    unit: string;
    reportingPeriod: string;
    dateRecorded?: string;
    notes?: string;
  }>,
  periodFilter?: string,
  customFactors?: Record<string, EmissionFactorConfig>
): EmissionCalculationSummary {
  const filtered = periodFilter
    ? activities.filter((a) => a.reportingPeriod === periodFilter)
    : activities;

  let totalCO2eKg = 0;
  let scope1Kg = 0;
  let scope2Kg = 0;
  let scope3Kg = 0;

  const categoryMap: Record<
    string,
    { totalKg: number; count: number }
  > = {
    'Diesel / Fuel': { totalKg: 0, count: 0 },
    'Electricity': { totalKg: 0, count: 0 },
    'Transportation': { totalKg: 0, count: 0 },
    'Other Operations': { totalKg: 0, count: 0 },
  };

  const calculatedItems: CalculatedEmissionItem[] = filtered.map((act) => {
    const factorConfig = matchFactorForActivity(act.category, act.activityName, customFactors);
    // Formula: Activity Data × Emission Factor = CO2e (kg)
    const co2eKg = act.quantity * factorConfig.factorValue;
    const co2eTonnes = co2eKg / 1000;

    totalCO2eKg += co2eKg;

    if (factorConfig.scope === 'Scope 1') scope1Kg += co2eKg;
    else if (factorConfig.scope === 'Scope 2') scope2Kg += co2eKg;
    else scope3Kg += co2eKg;

    const catKey = categoryMap[act.category] ? act.category : 'Other Operations';
    categoryMap[catKey].totalKg += co2eKg;
    categoryMap[catKey].count += 1;

    return {
      id: `calc-${act.id || Math.random().toString(36).substr(2, 9)}`,
      activityId: act.id,
      sourceCategory: act.category,
      activityName: act.activityName,
      activityQuantity: act.quantity,
      activityUnit: act.unit,
      emissionFactor: factorConfig.factorValue,
      factorUnit: factorConfig.factorUnit,
      scope: factorConfig.scope,
      isDemoFactor: !factorConfig.isVerified,
      calculatedCO2eKg: Number(co2eKg.toFixed(2)),
      calculatedCO2eTonnes: Number(co2eTonnes.toFixed(2)),
      reportingPeriod: act.reportingPeriod,
      date: act.dateRecorded || new Date().toISOString().split('T')[0],
      notes: act.notes,
    };
  });

  const totalCO2eTonnes = Number((totalCO2eKg / 1000).toFixed(2));

  const sourceBreakdown = Object.entries(categoryMap).map(([category, data]) => {
    const tonnes = Number((data.totalKg / 1000).toFixed(2));
    const percentage = totalCO2eKg > 0 ? Number(((data.totalKg / totalCO2eKg) * 100).toFixed(1)) : 0;
    return {
      category,
      totalCO2eTonnes: tonnes,
      percentage,
      activityCount: data.count,
    };
  });

  // Identify highest source (hotspot)
  let highestSource = 'Diesel / Fuel';
  let highestKg = 0;
  for (const [cat, data] of Object.entries(categoryMap)) {
    if (data.totalKg > highestKg) {
      highestKg = data.totalKg;
      highestSource = cat;
    }
  }

  const highestTonnes = Number((highestKg / 1000).toFixed(2));
  const highestPct = totalCO2eKg > 0 ? Number(((highestKg / totalCO2eKg) * 100).toFixed(1)) : 0;

  // Potential Focus Areas based on the highest hotspot
  let potentialFocusArea = 'Fuel efficiency and reduction of diesel consumption';
  let recommendedActions = [
    'Idle-time reduction and telematics auditing across heavy hydraulic shovels',
    'Haul road grade optimization to reduce truck engine strain',
    'Scheduled maintenance of fuel injectors and air induction systems',
  ];

  if (highestSource === 'Electricity') {
    potentialFocusArea = 'Renewable power substitution and motor efficiency upgrades';
    recommendedActions = [
      'Captive pit-head solar PV farm installation over reclaimed overburden dumps',
      'Variable Frequency Drives (VFDs) on mine ventilation shafts and slurry pumps',
      'Power factor correction capacitor banks at main receiving substations',
    ];
  } else if (highestSource === 'Transportation') {
    potentialFocusArea = 'Haulage route optimization, fleet payload matching & trolley-assist feasibility';
    recommendedActions = [
      'Computerized dispatch systems to eliminate haul truck queuing and deadheading',
      'Optimizing overburden dump access ramps to minimize gradient lift and travel distance',
      'Evaluation of trolley-assist electric overhead lines for uphill loaded haulage',
    ];
  } else if (highestSource === 'Other Operations') {
    potentialFocusArea = 'Methane drainage & blasting precision optimization';
    recommendedActions = [
      'Pre-mining borehole degasification and enclosed flaring',
      'Electronic detonator timing to optimize fragmentation and reduce secondary rock breaking',
      'Automated sump level controls on pit dewatering pumps',
    ];
  }

  return {
    reportingPeriod: periodFilter || 'All Periods Combined',
    totalCO2eKg: Number(totalCO2eKg.toFixed(2)),
    totalCO2eTonnes,
    sourceBreakdown,
    hotspot: {
      highestSource,
      highestCO2eTonnes: highestTonnes,
      percentageOfTotal: highestPct,
      potentialFocusArea,
      recommendedActions,
    },
    scopeBreakdown: {
      scope1Tonnes: Number((scope1Kg / 1000).toFixed(2)),
      scope2Tonnes: Number((scope2Kg / 1000).toFixed(2)),
      scope3Tonnes: Number((scope3Kg / 1000).toFixed(2)),
    },
    items: calculatedItems,
  };
}
