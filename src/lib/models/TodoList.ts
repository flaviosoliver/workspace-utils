import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITodoList, ITodoItem } from '@/types';

interface TodoItemDocument extends ITodoItem, Document {}

interface TodoListDocument
  extends Omit<ITodoList, '_id' | 'userId' | 'items'>,
    Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: TodoItemDocument[];
}

interface TodoListMethods {
  isOwner(userId: string): boolean;
  addItem(text: string): Promise<TodoListDocument>;
  removeItem(itemId: string): Promise<TodoListDocument>;
  toggleItemComplete(itemId: string): Promise<TodoListDocument>;
}

type TodoListModel = Model<
  TodoListDocument,
  Record<string, never>,
  TodoListMethods
>;

const TodoItemSchema = new Schema<TodoItemDocument>(
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

const TodoListSchema = new Schema<
  TodoListDocument,
  TodoListModel,
  TodoListMethods
>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

TodoListSchema.method('isOwner', function (userId: string) {
  return this.get('userId').toString() === userId;
});

TodoListSchema.method('addItem', async function (text: string) {
  (this as any).items.push({ text, completed: false });
  return this.save();
});

TodoListSchema.method('removeItem', async function (itemId: string) {
  this.set(
    'items',
    this.get('items').filter((item) => item._id.toString() !== itemId)
  );
  return this.save();
});

TodoListSchema.method('toggleItemComplete', async function (itemId: string) {
  const item = this.get('items').find((item) => item._id.toString() === itemId);
  if (item) {
    item.completed = !item.completed;
  }
  return this.save();
});

TodoListSchema.virtual('id').get(function () {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

TodoListSchema.set('toJSON', {
  virtuals: true,
});

TodoListSchema.index({ userId: 1 });
TodoListSchema.index({ userId: 1, createdAt: -1 });

const TodoList: TodoListModel =
  mongoose.models.TodoList ||
  mongoose.model<TodoListDocument, TodoListModel>('TodoList', TodoListSchema);

export default TodoList;
