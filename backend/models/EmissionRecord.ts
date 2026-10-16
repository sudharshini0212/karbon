import mongoose, { Schema, type Document } from 'mongoose';

export interface IEmissionRecord extends Document {
  activityId?: string;
  sourceCategory: string;
  activityName: string;
  activityQuantity: number;
  activityUnit: string;
  emissionFactor: number; // kg CO2e per unit
  factorUnit: string;
  isDemoFactor: boolean;
  calculatedCO2eKg: number;
  calculatedCO2eTonnes: number;
  reportingPeriod: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmissionRecordSchema: Schema = new Schema(
  {
    activityId: { type: String },
    sourceCategory: { type: String, required: true },
    activityName: { type: String, required: true },
    activityQuantity: { type: Number, required: true },
    activityUnit: { type: String, required: true },
    emissionFactor: { type: Number, required: true },
    factorUnit: { type: String, required: true },
    isDemoFactor: { type: Boolean, default: false },
    calculatedCO2eKg: { type: Number, required: true },
    calculatedCO2eTonnes: { type: Number, required: true },
    reportingPeriod: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const EmissionRecordModel =
  mongoose.models.EmissionRecord ||
  mongoose.model<IEmissionRecord>('EmissionRecord', EmissionRecordSchema, 'emissionrecords');
