import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser, UserPreferences, ApiKeys } from '@/types';

export interface UserDocument extends Omit<IUser, '_id'>, Document {}

const ApiKeysSchema = new Schema<ApiKeys>({
  openai: { type: String },
  anthropic: { type: String },
  google: { type: String },
  deepseek: { type: String },
  qwen: { type: String },
  spotify: {
    clientId: { type: String },
    clientSecret: { type: String },
  },
  youtube: { type: String },
}, { _id: false });

const UserPreferencesSchema = new Schema<UserPreferences>({
  theme: { 
    type: String, 
    enum: ['oneDark', 'dracula', 'monokai', 'light'], 
    default: 'oneDark' 
  },
  language: { type: String, default: 'pt-BR' },
  timezone: { type: String, default: 'America/Sao_Paulo' },
  notifications: { type: Boolean, default: true },
}, { _id: false });

const UserSchema = new Schema<UserDocument>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6,
  },
  preferences: { 
    type: UserPreferencesSchema, 
    default: () => ({}) 
  },
  apiKeys: { 
    type: ApiKeysSchema, 
    default: () => ({}) 
  },
}, {
  timestamps: true,
});

// Index for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

