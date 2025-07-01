import mongoose, { Schema, Document, Types } from 'mongoose';
import { Note } from '@/types';

export interface NoteDocument extends Omit<Note, '_id' | 'userId'>, Document {
  userId: Types.ObjectId;
}

const NoteSchema = new Schema<NoteDocument>(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
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

export default mongoose.models.Note ||
  mongoose.model<NoteDocument>('Note', NoteSchema);
