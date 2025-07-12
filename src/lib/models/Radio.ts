import mongoose, { Schema, Document, Model } from 'mongoose';
import { IRadio } from '@/types';

export interface RadioDocument extends Omit<IRadio, '_id'>, Document {
  uri: string;
  live: boolean;
  time: string;
  name: string;
  tags: string[];
}

type RadioModel = Model<RadioDocument, Record<string, never>>;

const RadioSchema = new Schema<RadioDocument, RadioModel>(
  {
    uri: {
      type: String,
      required: true,
    },
    live: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Radio =
  (mongoose.models.Radio as RadioModel) ||
  mongoose.model<RadioDocument, RadioModel>('Radio', RadioSchema);

export default Radio;
