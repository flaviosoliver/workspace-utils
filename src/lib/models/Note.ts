import mongoose, { Schema, Document, Model } from 'mongoose';
import { INote } from '@/types';

export interface NoteDocument extends Omit<INote, '_id' | 'userId'>, Document {
  userId: mongoose.Schema.Types.ObjectId;
}

interface NoteMethods {
  isOwner(userId: string): boolean;
}

type NoteModel = Model<NoteDocument, Record<string, never>, NoteMethods>;

const NoteSchema = new Schema<NoteDocument, NoteModel, NoteMethods>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

NoteSchema.method('isOwner', function (userId: string) {
  return this.get('userId').toString() === userId;
});

NoteSchema.virtual('id').get(function () {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

NoteSchema.set('toJSON', {
  virtuals: true,
});

const Note: NoteModel =
  mongoose.models.Note ||
  mongoose.model<NoteDocument, NoteModel>('Note', NoteSchema);

export default Note;
