import mongoose, { Schema, Document } from 'mongoose';
import { Note as INote } from '@/types';

export interface NoteDocument extends Omit<INote, '_id'>, Document {}

const NoteSchema = new Schema<NoteDocument>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: { 
    type: String,
    required: true,
    maxlength: 10000,
  },
  tags: [{ 
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 50,
  }],
}, {
  timestamps: true,
});

// Indexes for better performance
NoteSchema.index({ userId: 1 });
NoteSchema.index({ userId: 1, tags: 1 });
NoteSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Note || mongoose.model<NoteDocument>('Note', NoteSchema);

