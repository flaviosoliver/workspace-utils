import mongoose, { Schema, Document, Types } from 'mongoose';

export interface NoteDocument extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<NoteDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
