import mongoose from 'mongoose';

export interface ISession {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  completed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: false,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: false,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    notes: {
      type: String,
      required: false,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
SessionSchema.index({ userId: 1, startTime: -1 });
SessionSchema.index({ taskId: 1, startTime: -1 });

// Check if model already exists to prevent overwrite during hot reload
export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema); 