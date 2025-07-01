import mongoose, { Schema, Document } from 'mongoose';

export interface IWaterIntake extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number; // em ml
  timestamp: Date;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaterIntakeSchema = new Schema<IWaterIntake>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 2000, // máximo 2L por registro
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

WaterIntakeSchema.index({ userId: 1, date: 1 });
WaterIntakeSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.models.WaterIntake ||
  mongoose.model<IWaterIntake>('WaterIntake', WaterIntakeSchema);
