import mongoose, { Schema, Document } from 'mongoose';
import { TodoList, TodoItem } from '@/types';

export interface ITodoItem extends TodoItem, Document {}
export interface ITodoList
  extends Omit<TodoList, '_id' | 'userId' | 'items'>,
    Document {
  userId: mongoose.Types.ObjectId;
  items: ITodoItem[];
}

const TodoItemSchema = new Schema<ITodoItem>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TodoListSchema = new Schema<ITodoList>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [TodoItemSchema],
  },
  {
    timestamps: true,
  }
);

TodoListSchema.index({ userId: 1 });
TodoListSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.TodoList ||
  mongoose.model<ITodoList>('TodoList', TodoListSchema);
