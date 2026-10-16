import mongoose, { Schema, type Document } from 'mongoose';

export type StageStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Under Review';

export interface IRoadmapStage extends Document {
  stageKey: string;
  orderIndex: number;
  stageName: string;
  description: string;
  target: string;
  plannedAction: string;
  startDate: string;
  endDate: string;
  status: StageStatus;
  progressPercent: number; // 0 - 100
  keyDeliverable?: string;
  responsibleLead?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapStageSchema: Schema = new Schema(
  {
    stageKey: { type: String, required: true },
    orderIndex: { type: Number, required: true, default: 1 },
    stageName: { type: String, required: true },
    description: { type: String, required: true },
    target: { type: String, required: true },
    plannedAction: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Under Review'],
      default: 'In Progress',
    },
    progressPercent: { type: Number, min: 0, max: 100, default: 0 },
    keyDeliverable: { type: String, default: '' },
    responsibleLead: { type: String, default: 'Environmental Engineering Team' },
  },
  { timestamps: true }
);

export const RoadmapStageModel =
  mongoose.models.RoadmapStage ||
  mongoose.model<IRoadmapStage>('RoadmapStage', RoadmapStageSchema, 'roadmapstages');
