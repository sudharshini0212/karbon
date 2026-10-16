import mongoose, { Schema, type Document } from 'mongoose';

export type ActivityCategory = 'Diesel / Fuel' | 'Electricity' | 'Transportation' | 'Other Operations';

export interface IActivityRecord extends Document {
  category: ActivityCategory;
  activityName: string;
  quantity: number;
  unit: string;
  reportingPeriod: string; // e.g. "2025-10" or "Q3 2025"
  dateRecorded: string;
  sourceDocRef?: string;
  loggedBy: string;
  role: 'Administrator' | 'Field Officer';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityRecordSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Diesel / Fuel', 'Electricity', 'Transportation', 'Other Operations'],
    },
    activityName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    reportingPeriod: { type: String, required: true, trim: true },
    dateRecorded: { type: String, required: true },
    sourceDocRef: { type: String, default: 'Operational Logbook Entry' },
    loggedBy: { type: String, required: true, default: 'Mine Shift Supervisor' },
    role: {
      type: String,
      enum: ['Administrator', 'Field Officer'],
      default: 'Field Officer',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ActivityRecordModel =
  mongoose.models.ActivityRecord ||
  mongoose.model<IActivityRecord>('ActivityRecord', ActivityRecordSchema, 'activityrecords');
