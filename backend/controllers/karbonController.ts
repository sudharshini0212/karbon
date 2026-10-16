import type { Request, Response } from 'express';
import { DEFAULT_EMISSION_FACTORS } from '../config/emissionFactors.ts';
import type { EmissionFactorConfig } from '../config/emissionFactors.ts';
import { calculateEmissionsForActivities } from '../services/emissionCalculator.ts';
import { getIsMongoConnected } from '../config/db.ts';
import { MineModel } from '../models/Mine.ts';
import { ActivityRecordModel } from '../models/ActivityRecord.ts';
import { ReductionTargetModel } from '../models/ReductionTarget.ts';
import { RoadmapStageModel } from '../models/RoadmapStage.ts';
import { CarbonReportModel } from '../models/CarbonReport.ts';
import { EmissionRecordModel } from '../models/EmissionRecord.ts';
import {
  INITIAL_MINE_PROFILE,
  INITIAL_ACTIVITY_RECORDS,
  INITIAL_TARGETS,
  INITIAL_ROADMAP_STAGES,
} from '../data/seedData.ts';

// Configurable emission factors (in-memory config or configurable via API)
let emissionFactors: Record<string, EmissionFactorConfig> = { ...DEFAULT_EMISSION_FACTORS };

// Helper to enforce MongoDB requirement across all endpoints
function checkMongoAvailable(res: Response): boolean {
  if (!getIsMongoConnected()) {
    res.status(503).json({
      success: false,
      error: 'MongoDB Atlas is currently unavailable. Verify MONGODB_URI and ensure the cluster IP Access List includes this host (or 0.0.0.0/0).',
      database: 'karbonDB',
      connected: false,
    });
    return false;
  }
  return true;
}

// Format Mongo document to include clean 'id' string alongside _id
function formatDoc<T extends Record<string, any>>(doc: T): T & { id: string } {
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  if (obj._id && !obj.id) {
    obj.id = obj._id.toString();
  }
  return obj;
}

// ==========================================
// MINE PROFILE CONTROLLER
// ==========================================
export const getMineProfile = async (_req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    let mine = await MineModel.findOne().lean();

    // If database has no facility record yet, return initial profile metadata without writing fake docs
    if (!mine) {
      return res.json({
        success: true,
        data: INITIAL_MINE_PROFILE,
        source: 'default-profile',
        database: 'karbonDB',
        collection: 'mines',
      });
    }

    return res.json({
      success: true,
      data: formatDoc(mine),
      source: 'mongodb-atlas',
      database: 'karbonDB',
      collection: 'mines',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateMineProfile = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const updateData = req.body;
    const mineId = updateData.mineId || 'M-IND-MP-042';

    const updated = await MineModel.findOneAndUpdate(
      { mineId },
      { ...updateData, mineId },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return res.json({
      success: true,
      message: 'Mine profile updated and saved to MongoDB Atlas',
      data: formatDoc(updated),
      collection: 'mines',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// ==========================================
// ACTIVITY RECORDS CONTROLLER (CRUD on 'activityrecords')
// ==========================================
export const getActivities = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const { period, category } = req.query;
    const filter: Record<string, any> = {};

    if (period && period !== 'all') {
      filter.reportingPeriod = period;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    let records = await ActivityRecordModel.find(filter)
      .sort({ dateRecorded: -1, createdAt: -1 })
      .lean();

    const formatted = records.map(formatDoc);

    return res.json({
      success: true,
      totalCount: formatted.length,
      data: formatted,
      database: 'karbonDB',
      collection: 'activityrecords',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const {
      category,
      activityName,
      quantity,
      unit,
      reportingPeriod,
      dateRecorded,
      sourceDocRef,
      loggedBy,
      role,
      notes,
    } = req.body;

    if (!category || !activityName || quantity === undefined || !unit || !reportingPeriod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: category, activityName, quantity, unit, and reportingPeriod are mandatory.',
      });
    }

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be a positive number.',
      });
    }

    // Save directly to MongoDB Atlas collection 'activityrecords'
    const newDoc = await ActivityRecordModel.create({
      category,
      activityName,
      quantity: numQuantity,
      unit,
      reportingPeriod,
      dateRecorded: dateRecorded || new Date().toISOString().split('T')[0],
      sourceDocRef: sourceDocRef || 'Operational Logbook Entry',
      loggedBy: loggedBy || 'Mine Operator',
      role: role || 'Field Officer',
      notes: notes || '',
    });

    const formatted = formatDoc(newDoc);

    // Also persist corresponding computed emission record in 'emissionrecords'
    const factorConfig =
      category === 'Diesel / Fuel'
        ? emissionFactors['diesel']
        : category === 'Electricity'
        ? emissionFactors['electricity']
        : category === 'Transportation'
        ? emissionFactors['transportation']
        : emissionFactors['blasting'];

    const factorVal = factorConfig ? factorConfig.factorValue : 1.0;
    const factorUnit = factorConfig ? factorConfig.factorUnit : 'kg CO2e / unit';
    const calculatedKg = Number((numQuantity * factorVal).toFixed(2));
    const calculatedTonnes = Number((calculatedKg / 1000).toFixed(3));

    await EmissionRecordModel.create({
      activityId: formatted.id,
      sourceCategory: category,
      activityName,
      activityQuantity: numQuantity,
      activityUnit: unit,
      emissionFactor: factorVal,
      factorUnit,
      calculatedCO2eKg: calculatedKg,
      calculatedCO2eTonnes: calculatedTonnes,
      reportingPeriod,
      date: formatted.dateRecorded,
    }).catch((err) => console.warn('[KARBON DB] EmissionRecord write warning:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Operational activity record saved to MongoDB Atlas',
      data: formatted,
      database: 'karbonDB',
      collection: 'activityrecords',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.quantity !== undefined) {
      updateData.quantity = Number(updateData.quantity);
    }

    const updated = await ActivityRecordModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Activity record not found in MongoDB' });
    }

    return res.json({
      success: true,
      message: 'Activity record updated in MongoDB Atlas',
      data: formatDoc(updated),
      collection: 'activityrecords',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const { id } = req.params;
    const deleted = await ActivityRecordModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Activity record not found in MongoDB' });
    }

    // Also clean up related emission record if exists
    await EmissionRecordModel.deleteMany({ activityId: id }).catch(() => {});

    return res.json({
      success: true,
      message: 'Activity record deleted from MongoDB Atlas',
      deletedId: id,
      collection: 'activityrecords',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// ==========================================
// EMISSIONS CALCULATION CONTROLLER (Derived from actual 'activityrecords')
// ==========================================
export const getEmissions = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const period = (req.query.period as string) || '2025-10';

    // Fetch real saved activities from MongoDB
    const allActivities = await ActivityRecordModel.find().lean();
    const formatted = allActivities.map(formatDoc);

    const calculation = calculateEmissionsForActivities(formatted, period, emissionFactors);

    // Calculate previous period for comparison
    const prevPeriod = period === '2025-10' ? '2025-09' : undefined;
    const prevCalculation = prevPeriod
      ? calculateEmissionsForActivities(formatted, prevPeriod, emissionFactors)
      : null;

    let deltaPercent = 0;
    let deltaTonnes = 0;
    if (prevCalculation && prevCalculation.totalCO2eTonnes > 0) {
      deltaTonnes = Number((calculation.totalCO2eTonnes - prevCalculation.totalCO2eTonnes).toFixed(2));
      deltaPercent = Number(((deltaTonnes / prevCalculation.totalCO2eTonnes) * 100).toFixed(1));
    }

    return res.json({
      success: true,
      data: {
        ...calculation,
        previousPeriod: prevPeriod,
        previousPeriodTonnes: prevCalculation?.totalCO2eTonnes || 0,
        deltaTonnes,
        deltaPercent,
        database: 'karbonDB',
        collection: 'activityrecords',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const calculateCustomEmissions = async (req: Request, res: Response) => {
  try {
    const { activities, customFactors, period } = req.body;
    let itemsToCalculate = activities;

    if (!itemsToCalculate && getIsMongoConnected()) {
      const dbActivities = await ActivityRecordModel.find().lean();
      itemsToCalculate = dbActivities.map(formatDoc);
    }

    const factorsToUse = customFactors ? { ...emissionFactors, ...customFactors } : emissionFactors;
    const result = calculateEmissionsForActivities(itemsToCalculate || [], period, factorsToUse);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// ==========================================
// REDUCTION TARGETS CONTROLLER ('reductiontargets')
// ==========================================
export const getTargets = async (_req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    let targets = await ReductionTargetModel.find().sort({ createdAt: -1 }).lean();

    const allActivities = await ActivityRecordModel.find().lean();
    const latestOctCalc = calculateEmissionsForActivities(allActivities.map(formatDoc), '2025-10', emissionFactors);

    const enriched = targets.map((t) => {
      const formatted = formatDoc(t);
      const cat = latestOctCalc.sourceBreakdown.find((b) => b.category === formatted.focusCategory);
      const currentEmissions = cat ? cat.totalCO2eTonnes : formatted.currentEmissionValue || 0;
      const reductionAchieved = Number((formatted.baselineEmissions - currentEmissions).toFixed(1));
      const targetRequiredReduction = Number((formatted.baselineEmissions - formatted.targetEmissionValue).toFixed(1));
      const completionPercent =
        targetRequiredReduction > 0
          ? Math.min(100, Math.max(0, Number(((reductionAchieved / targetRequiredReduction) * 100).toFixed(1))))
          : 0;

      return {
        ...formatted,
        currentEmissionValue: currentEmissions,
        reductionAchieved,
        remainingReduction: Number(Math.max(0, currentEmissions - formatted.targetEmissionValue).toFixed(1)),
        completionPercent,
      };
    });

    return res.json({
      success: true,
      totalCount: enriched.length,
      data: enriched,
      collection: 'reductiontargets',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const createTarget = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const {
      targetName,
      baselineEmissions,
      baselinePeriod,
      targetReductionPercent,
      targetEmissionValue,
      startDate,
      targetDate,
      reductionAction,
      focusCategory,
      status,
      notes,
    } = req.body;

    const created = await ReductionTargetModel.create({
      targetName,
      baselineEmissions: Number(baselineEmissions),
      baselinePeriod: baselinePeriod || '2024 Base Year',
      targetReductionPercent: Number(targetReductionPercent),
      targetEmissionValue: Number(targetEmissionValue),
      currentEmissionValue: Number(baselineEmissions),
      startDate,
      targetDate,
      reductionAction,
      focusCategory: focusCategory || 'Cross-Cutting',
      status: status || 'Active',
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Reduction target created in MongoDB Atlas',
      data: formatDoc(created),
      collection: 'reductiontargets',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateTarget = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const { id } = req.params;
    const updated = await ReductionTargetModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Target not found in MongoDB' });
    }

    return res.json({
      success: true,
      message: 'Reduction target updated in MongoDB Atlas',
      data: formatDoc(updated),
      collection: 'reductiontargets',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const deleteTarget = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const { id } = req.params;
    const deleted = await ReductionTargetModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Target not found in MongoDB' });
    }

    return res.json({
      success: true,
      message: 'Reduction target deleted from MongoDB Atlas',
      deletedId: id,
      collection: 'reductiontargets',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// ==========================================
// ROADMAP STAGES CONTROLLER ('roadmapstages')
// ==========================================
export const getRoadmap = async (_req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    let stages = await RoadmapStageModel.find().sort({ orderIndex: 1 }).lean();

    return res.json({
      success: true,
      totalCount: stages.length,
      data: stages.map(formatDoc),
      collection: 'roadmapstages',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const createRoadmapStage = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const created = await RoadmapStageModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Roadmap stage created in MongoDB Atlas',
      data: formatDoc(created),
      collection: 'roadmapstages',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateRoadmapStage = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const { id } = req.params;
    const updated = await RoadmapStageModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Roadmap stage not found in MongoDB' });
    }

    return res.json({
      success: true,
      message: 'Roadmap stage updated in MongoDB Atlas',
      data: formatDoc(updated),
      collection: 'roadmapstages',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// ==========================================
// CARBON REPORTS CONTROLLER ('carbonreports')
// ==========================================
export const getReports = async (_req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const reports = await CarbonReportModel.find().sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      totalCount: reports.length,
      data: reports.map(formatDoc),
      collection: 'carbonreports',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const createReport = async (req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const created = await CarbonReportModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Carbon report saved to MongoDB Atlas',
      data: formatDoc(created),
      collection: 'carbonreports',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// ==========================================
// PERIODIC PROGRESS & FACTORS CONTROLLER
// ==========================================
export const getProgress = async (_req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    const activities = await ActivityRecordModel.find().lean();
    const formatted = activities.map(formatDoc);
    const octCalc = calculateEmissionsForActivities(formatted, '2025-10', emissionFactors);

    const baselineEmissions = 1200;
    const currentEmissions = octCalc.totalCO2eTonnes;
    const targetEmissions = 960;
    const reductionAchieved = Number(Math.max(0, baselineEmissions - currentEmissions).toFixed(1));
    const remainingReduction = Number(Math.max(0, currentEmissions - targetEmissions).toFixed(1));
    const totalRequired = baselineEmissions - targetEmissions;
    const targetCompletionPercentage = totalRequired > 0
      ? Math.min(100, Math.max(0, Number(((reductionAchieved / totalRequired) * 100).toFixed(1))))
      : 0;

    const stages = await RoadmapStageModel.find().lean();
    const overallRoadmapProgress = stages.length > 0
      ? Math.round(stages.reduce((acc, s) => acc + (s.progressPercent || 0), 0) / stages.length)
      : 35;

    return res.json({
      success: true,
      data: {
        baselineEmissions,
        currentEmissions,
        targetEmissions,
        reductionAchieved,
        remainingReduction,
        targetCompletionPercentage,
        overallRoadmapProgress,
        terminologyNote: 'Periodic operational carbon monitoring calculated from logged invoice data.',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getFactors = async (_req: Request, res: Response) => {
  return res.json({ success: true, data: emissionFactors });
};

export const updateFactor = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    if (!emissionFactors[key]) {
      return res.status(404).json({ success: false, error: 'Emission factor key not found' });
    }
    emissionFactors[key] = { ...emissionFactors[key], ...req.body };
    return res.json({ success: true, message: 'Factor updated', data: emissionFactors[key] });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const resetDemoData = async (_req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  try {
    await ActivityRecordModel.deleteMany({});
    await ActivityRecordModel.insertMany(INITIAL_ACTIVITY_RECORDS);

    await MineModel.deleteMany({});
    await MineModel.create(INITIAL_MINE_PROFILE);

    await ReductionTargetModel.deleteMany({});
    await ReductionTargetModel.insertMany(INITIAL_TARGETS);

    await RoadmapStageModel.deleteMany({});
    await RoadmapStageModel.insertMany(INITIAL_ROADMAP_STAGES);

    return res.json({
      success: true,
      message: 'MongoDB Atlas collections reseeded with initial baseline records',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// ==========================================
// TEST CRUD CONTROLLER (Validates live insert, read-back, update, delete in Atlas)
// ==========================================
export const testMongoCRUD = async (_req: Request, res: Response) => {
  if (!checkMongoAvailable(res)) return;

  const startTime = Date.now();
  try {
    // 1. Insert a real test document in 'activityrecords'
    const testDoc = await ActivityRecordModel.create({
      category: 'Diesel / Fuel',
      activityName: 'KARBON Live Atlas Verification Probe',
      quantity: 500,
      unit: 'litres',
      reportingPeriod: '2025-10',
      dateRecorded: new Date().toISOString().split('T')[0],
      sourceDocRef: 'Atlas Live Verification Suite',
      loggedBy: 'System Diagnostic Runner',
      role: 'Administrator',
      notes: 'Diagnostic document inserted to verify live write and read-back in MongoDB Atlas.',
    });

    const docId = testDoc._id.toString();

    // 2. Read back from MongoDB Atlas
    const readDoc = await ActivityRecordModel.findById(docId).lean();
    if (!readDoc) {
      throw new Error(`Read-back failed: Document ${docId} was not found in Atlas activityrecords collection`);
    }

    // 3. Verify fields
    const verified =
      readDoc.activityName === 'KARBON Live Atlas Verification Probe' &&
      readDoc.quantity === 500;

    // 4. Update the document
    await ActivityRecordModel.findByIdAndUpdate(docId, {
      notes: 'Updated successfully during live Atlas roundtrip test.',
    });

    // 5. Clean up probe document
    await ActivityRecordModel.findByIdAndDelete(docId);

    const roundtripMs = Date.now() - startTime;

    return res.json({
      success: true,
      verified,
      message: 'MongoDB Atlas insert and read-back test passed successfully!',
      database: 'karbonDB',
      collection: 'activityrecords',
      verifiedDocumentId: docId,
      roundtripMs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      verified: false,
      error: (error as Error).message,
      database: 'karbonDB',
      collection: 'activityrecords',
    });
  }
};

