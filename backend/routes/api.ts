import { Router } from 'express';
import {
  getMineProfile,
  updateMineProfile,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getEmissions,
  calculateCustomEmissions,
  getTargets,
  createTarget,
  updateTarget,
  deleteTarget,
  getRoadmap,
  createRoadmapStage,
  updateRoadmapStage,
  getReports,
  createReport,
  getProgress,
  getFactors,
  updateFactor,
  resetDemoData,
  testMongoCRUD,
} from '../controllers/karbonController.ts';

export const apiRouter = Router();

// Mine Profile
apiRouter.get('/mine', getMineProfile);
apiRouter.post('/mine', updateMineProfile);
apiRouter.get('/mine-profile', getMineProfile);
apiRouter.post('/mine-profile', updateMineProfile);

// Operational Activity Records (CRUD)
apiRouter.get('/activities', getActivities);
apiRouter.post('/activities', createActivity);
apiRouter.put('/activities/:id', updateActivity);
apiRouter.delete('/activities/:id', deleteActivity);

// Carbon Footprint & Calculations
apiRouter.get('/emissions', getEmissions);
apiRouter.post('/emissions/calculate', calculateCustomEmissions);

// Reduction Targets
apiRouter.get('/targets', getTargets);
apiRouter.post('/targets', createTarget);
apiRouter.put('/targets/:id', updateTarget);
apiRouter.delete('/targets/:id', deleteTarget);

// Carbon Neutrality Roadmap
apiRouter.get('/roadmap', getRoadmap);
apiRouter.post('/roadmap', createRoadmapStage);
apiRouter.put('/roadmap/:id', updateRoadmapStage);

// Carbon Reports ('carbonreports' collection)
apiRouter.get('/reports', getReports);
apiRouter.post('/reports', createReport);

// Periodic Progress Tracking
apiRouter.get('/progress', getProgress);

// Emission Factors Configuration
apiRouter.get('/factors', getFactors);
apiRouter.put('/factors/:key', updateFactor);

// Reset demo state utility
apiRouter.post('/reset-demo', resetDemoData);

// MongoDB Atlas CRUD Verification probe endpoint
apiRouter.get('/db/test-crud', testMongoCRUD);
apiRouter.post('/db/test-crud', testMongoCRUD);
