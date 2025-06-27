import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITodoItem extends Document {
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface ITodoList extends Document {
  userId: Types.ObjectId;
  name: string;
  items: ITodoItem[];
  createdAt: Date;
  updatedAt: Date;
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
      type: Types.ObjectId,
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

// Índices para performance
TodoListSchema.index({ userId: 1 });
TodoListSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.TodoList ||
  mongoose.model<ITodoList>('TodoList', TodoListSchema);
