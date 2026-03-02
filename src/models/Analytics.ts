import mongoose, { Schema, model, models } from 'mongoose';

export interface IAnalytics {
  sessionId: string;
  event: string;
  data: Record<string, any>;
  timestamp: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  event: {
    type: String,
    required: true,
    index: true,
  },
  data: {
    type: Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const Analytics = models.Analytics || model<IAnalytics>('Analytics', AnalyticsSchema);
