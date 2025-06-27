import mongoose, { Schema, Document, Types } from 'mongoose';
import { Task as ITask } from '@/types';

export interface TaskDocument extends Omit<ITask, '_id'>, Document {}

const TaskSchema = new Schema<TaskDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
TaskSchema.index({ userId: 1, completed: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });

export default mongoose.models.Task ||
  mongoose.model<TaskDocument>('Task', TaskSchema);
