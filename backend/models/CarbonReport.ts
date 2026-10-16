import mongoose, { Schema, type Document } from 'mongoose';

export interface ICarbonReport extends Document {
  reportTitle: string;
  reportType: 'Executive' | 'FullAudit' | 'RoadmapCompliance';
  mineId: string;
  mineName: string;
  reportingPeriod: string;
  totalFootprintTonnes: number;
  scope1Tonnes: number;
  scope2Tonnes: number;
  sourceBreakdown: Array<{
    category: string;
    totalCO2eTonnes: number;
    percentage: number;
  }>;
  executiveSummary?: string;
  preparedBy: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CarbonReportSchema: Schema = new Schema(
  {
    reportTitle: { type: String, required: true, trim: true },
    reportType: {
      type: String,
      enum: ['Executive', 'FullAudit', 'RoadmapCompliance'],
      default: 'Executive',
    },
    mineId: { type: String, required: true },
    mineName: { type: String, required: true },
    reportingPeriod: { type: String, required: true },
    totalFootprintTonnes: { type: Number, required: true },
    scope1Tonnes: { type: Number, default: 0 },
    scope2Tonnes: { type: Number, default: 0 },
    sourceBreakdown: [
      {
        category: { type: String, required: true },
        totalCO2eTonnes: { type: Number, required: true },
        percentage: { type: Number, required: true },
      },
    ],
    executiveSummary: { type: String, default: '' },
    preparedBy: { type: String, required: true, default: 'Environmental Officer' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CarbonReportModel =
  mongoose.models.CarbonReport ||
  mongoose.model<ICarbonReport>('CarbonReport', CarbonReportSchema, 'carbonreports');
