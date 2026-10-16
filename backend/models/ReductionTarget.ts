import mongoose, { Schema, type Document } from 'mongoose';

export interface IReductionTarget extends Document {
  targetName: string;
  baselineEmissions: number; // in tCO2e
  baselinePeriod: string;
  targetReductionPercent: number; // e.g. 20%
  targetEmissionValue: number; // in tCO2e (e.g. 800 tCO2e)
  currentEmissionValue?: number; // current progress tCO2e
  startDate: string;
  targetDate: string;
  reductionAction: string;
  focusCategory: 'Diesel / Fuel' | 'Electricity' | 'Transportation' | 'Other Operations' | 'Cross-Cutting';
  status: 'Active' | 'Completed' | 'Pending';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReductionTargetSchema: Schema = new Schema(
  {
    targetName: { type: String, required: true, trim: true },
    baselineEmissions: { type: Number, required: true },
    baselinePeriod: { type: String, default: '2024 Base Year' },
    targetReductionPercent: { type: Number, required: true },
    targetEmissionValue: { type: Number, required: true },
    currentEmissionValue: { type: Number, default: 0 },
    startDate: { type: String, required: true },
    targetDate: { type: String, required: true },
    reductionAction: { type: String, required: true },
    focusCategory: {
      type: String,
      enum: ['Diesel / Fuel', 'Electricity', 'Transportation', 'Other Operations', 'Cross-Cutting'],
      default: 'Diesel / Fuel',
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Pending'],
      default: 'Active',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ReductionTargetModel =
  mongoose.models.ReductionTarget ||
  mongoose.model<IReductionTarget>('ReductionTarget', ReductionTargetSchema, 'reductiontargets');
