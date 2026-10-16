import mongoose, { Schema, type Document } from 'mongoose';

export interface IMine extends Document {
  mineName: string;
  mineId: string;
  location: string;
  mineType: 'Opencast' | 'Underground' | 'Mixed';
  reportingPeriod: string;
  responsiblePerson: string;
  productionCapacityMTPA: number;
  contactEmail?: string;
  operationalStatus: 'Active' | 'Under Maintenance' | 'Restricted';
  createdAt: Date;
  updatedAt: Date;
}

const MineSchema: Schema = new Schema(
  {
    mineName: { type: String, required: true, trim: true },
    mineId: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true, trim: true },
    mineType: {
      type: String,
      required: true,
      enum: ['Opencast', 'Underground', 'Mixed'],
      default: 'Opencast',
    },
    reportingPeriod: { type: String, required: true, default: 'FY 2025-2026 Q3' },
    responsiblePerson: { type: String, required: true, trim: true },
    productionCapacityMTPA: { type: Number, default: 5.5 },
    contactEmail: { type: String, default: 'env.singrauli@karbon-mines.internal' },
    operationalStatus: {
      type: String,
      enum: ['Active', 'Under Maintenance', 'Restricted'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export const MineModel = mongoose.models.Mine || mongoose.model<IMine>('Mine', MineSchema, 'mines');
