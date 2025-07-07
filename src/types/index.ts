export interface IUser {
  _id: string;
  email: string;
  name: string;
  password?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  preferences: UserPreferences;
  apiTokens: ApiTokens;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: ThemeName;
  language: string;
  timezone: string;
  notifications: boolean;
  waterReminder: {
    enabled: boolean;
    dailyGoal: number;
    interval: number;
  };
}

export interface ApiTokens {
  openai?: string;
  anthropic?: string;
  google?: string;
  deepseek?: string;
  qwen?: string;
  spotify?: {
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  youtube?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  youtubeMusic?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
}

export type ThemeName =
  | 'oneDark'
  | 'dracula'
  | 'monokai'
  | 'light'
  | 'cyberpunk'
  | 'solarized'
  | 'synthwave'
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple';

export interface Theme {
  name: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: Position;
  size: Size;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export type WidgetType =
  | 'tasks'
  | 'timer'
  | 'pomodoro'
  | 'todo'
  | 'notes'
  | 'music'
  | 'dataGenerator'
  | 'aiChat'
  | 'water'
  | 'settings';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ITask {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:mm
  duration: number; // minutos
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INote {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodoItem {
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface ITodoList {
  _id: string;
  userId: string;
  name: string;
  items: ITodoItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWaterIntake {
  _id: string;
  userId: string;
  amount: number;
  timestamp: Date;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  type: 'timer' | 'pomodoro';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  aiProvider: AIProvider;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export type AIProvider =
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'qwen'
  | 'deepseek'
  | 'manus'
  | 'perplexity';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  thumbnail?: string;
  url: string;
  source: 'youtube' | 'spotify' | 'youtubeMusic';
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  source: 'youtube' | 'spotify' | 'youtubeMusic';
}

export interface FakeDataConfig {
  type: 'person' | 'address' | 'company' | 'product' | 'custom';
  count: number;
  fields: string[];
  format: 'json' | 'csv' | 'xml';
}
