import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWaterIntake extends Document {
  userId: Types.ObjectId;
  amount: number; // em ml
  timestamp: Date;
  date: string; // formato YYYY-MM-DD para facilitar consultas
  createdAt: Date;
  updatedAt: Date;
}

const WaterIntakeSchema = new Schema<IWaterIntake>(
  {
    userId: {
      type: Types.ObjectId,
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

// Índices para performance
WaterIntakeSchema.index({ userId: 1, date: 1 });
WaterIntakeSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.models.WaterIntake ||
  mongoose.model<IWaterIntake>('WaterIntake', WaterIntakeSchema);
