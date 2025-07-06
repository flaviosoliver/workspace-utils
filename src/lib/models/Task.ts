import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITask } from '@/types';

export interface TaskDocument extends Omit<ITask, '_id' | 'userId'>, Document {
  userId: mongoose.Schema.Types.ObjectId;
}

interface TaskMethods {
  isOwner(userId: string): boolean;
  toggleComplete(): Promise<TaskDocument>;
}

type TaskModel = Model<TaskDocument, Record<string, never>, TaskMethods>;

const TaskSchema = new Schema<TaskDocument, TaskModel, TaskMethods>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
    date: {
      type: String, // formato YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // formato HH:mm
      required: true,
    },
    duration: {
      type: Number, // minutos
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.method('isOwner', function (userId: string) {
  return this.get('userId').toString() === userId;
});

TaskSchema.method('toggleComplete', async function () {
  this.set('completed', !this.get('completed'));
  return this.save();
});

TaskSchema.virtual('id').get(function () {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

TaskSchema.set('toJSON', {
  virtuals: true,
});

TaskSchema.index({ userId: 1, date: 1, time: 1 });
TaskSchema.index({ userId: 1, completed: 1 });
TaskSchema.index({ userId: 1, priority: 1 });

const Task: TaskModel =
  mongoose.models.Task ||
  mongoose.model<TaskDocument, TaskModel>('Task', TaskSchema);

export default Task;
