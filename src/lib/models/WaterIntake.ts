import { IWaterIntake } from '@/types';
import mongoose, { Schema, Document, Model } from 'mongoose';

interface WaterIntakeDocument
  extends Omit<
      IWaterIntake,
      | '_id'
      | 'userId'
      | 'amount'
      | 'timestamp'
      | 'date'
      | 'createdAt'
      | 'updatedAt'
    >,
    Document {
  userId: mongoose.Schema.Types.ObjectId;
  amount: number; // em ml
  timestamp: Date;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WaterIntakeMethods {
  isOwner(userId: string): boolean;
}

type WaterIntakeModel = Model<
  WaterIntakeDocument,
  Record<string, never>,
  WaterIntakeMethods
>;

const WaterIntakeSchema = new Schema<
  WaterIntakeDocument,
  WaterIntakeModel,
  WaterIntakeMethods
>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

WaterIntakeSchema.method('isOwner', function (userId: string) {
  return this.get('userId').toString() === userId;
});

WaterIntakeSchema.virtual('id').get(function () {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

WaterIntakeSchema.set('toJSON', {
  virtuals: true,
});

WaterIntakeSchema.index({ userId: 1, date: 1 });
WaterIntakeSchema.index({ userId: 1, timestamp: -1 });

const WaterIntake: WaterIntakeModel =
  mongoose.models.WaterIntake ||
  mongoose.model<WaterIntakeDocument, WaterIntakeModel>(
    'WaterIntake',
    WaterIntakeSchema
  );

export default WaterIntake;
