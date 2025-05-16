import mongoose from 'mongoose';

export interface ISettings {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new mongoose.Schema<ISettings>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    pomodoroLength: {
      type: Number,
      required: true,
      default: 25,
      min: 1,
      max: 120,
    },
    shortBreakLength: {
      type: Number,
      required: true,
      default: 5,
      min: 1,
      max: 30,
    },
    longBreakLength: {
      type: Number,
      required: true,
      default: 15,
      min: 1,
      max: 60,
    },
    longBreakInterval: {
      type: Number,
      required: true,
      default: 4,
      min: 1,
      max: 10,
    },
    autoStartBreaks: {
      type: Boolean,
      required: true,
      default: false,
    },
    autoStartPomodoros: {
      type: Boolean,
      required: true,
      default: false,
    },
    soundEnabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    soundVolume: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
      max: 100,
    },
    darkMode: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if model already exists to prevent overwrite during hot reload
export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema); 