/**
 * KARBON Coal Mine Carbon Management Platform
 * Default Demo Emission Factors
 * 
 * IMPORTANT DISCLAIMER:
 * Demo emission factor — replace with verified factor before deployment.
 * Factors should be calibrated against local regulatory guidelines (e.g. IPCC, GHG Protocol, CEA/EPA).
 */

export interface EmissionFactorConfig {
  id: string;
  category: string;
  activityName: string;
  unit: string;
  factorValue: number; // in kg CO2e per unit
  factorUnit: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  sourceReference: string;
  isVerified: boolean;
  notes: string;
}

export const DEFAULT_EMISSION_FACTORS: Record<string, EmissionFactorConfig> = {
  diesel: {
    id: 'diesel',
    category: 'Fuel / Diesel',
    activityName: 'Excavators, Dozers & Stationary Generators Diesel',
    unit: 'litres',
    factorValue: 2.687, // kg CO2e per litre
    factorUnit: 'kg CO₂e / L',
    scope: 'Scope 1',
    sourceReference: 'Demo IPCC Stationary/Mobile Combustion Tier 1 (Indicative)',
    isVerified: false,
    notes: 'Demo emission factor — replace with verified factor before deployment.',
  },
  electricity: {
    id: 'electricity',
    category: 'Electricity',
    activityName: 'Grid Power for Coal Handling Plant, Draglines & Ventilation',
    unit: 'kWh',
    factorValue: 0.820, // kg CO2e per kWh
    factorUnit: 'kg CO₂e / kWh',
    scope: 'Scope 2',
    sourceReference: 'Demo Regional Grid Average (Indicative Coal-Heavy Grid)',
    isVerified: false,
    notes: 'Demo emission factor — replace with verified factor before deployment.',
  },
  transportation: {
    id: 'transportation',
    category: 'Transportation',
    activityName: 'Off-Highway Dump Trucks & Rail Haulage Fleet',
    unit: 'litres',
    factorValue: 2.712, // kg CO2e per litre
    factorUnit: 'kg CO₂e / L',
    scope: 'Scope 1',
    sourceReference: 'Demo Heavy Off-Road Transport Emission Factor (Indicative)',
    isVerified: false,
    notes: 'Demo emission factor — replace with verified factor before deployment.',
  },
  explosives: {
    id: 'explosives',
    category: 'Other Operations',
    activityName: 'ANFO / Emulsion Blasting Explosives',
    unit: 'kg',
    factorValue: 0.175, // kg CO2e per kg ANFO
    factorUnit: 'kg CO₂e / kg',
    scope: 'Scope 1',
    sourceReference: 'Demo Detonation Stoichiometric Emission Factor (Indicative)',
    isVerified: false,
    notes: 'Demo emission factor — replace with verified factor before deployment.',
  },
  methane: {
    id: 'methane',
    category: 'Other Operations',
    activityName: 'Fugitive Coal Seam Methane (Drainage / Ventilation Air)',
    unit: 'kg',
    factorValue: 28.0, // GWP-100 for methane
    factorUnit: 'kg CO₂e / kg CH₄',
    scope: 'Scope 1',
    sourceReference: 'Demo IPCC AR5 GWP-100 Indicative',
    isVerified: false,
    notes: 'Demo emission factor — replace with verified factor before deployment.',
  },
  water_pumping: {
    id: 'water_pumping',
    category: 'Other Operations',
    activityName: 'Pit Dewatering & Treatment Pumps',
    unit: 'kWh',
    factorValue: 0.820,
    factorUnit: 'kg CO₂e / kWh',
    scope: 'Scope 2',
    sourceReference: 'Demo Auxiliary Power Factor (Indicative)',
    isVerified: false,
    notes: 'Demo emission factor — replace with verified factor before deployment.',
  },
};
