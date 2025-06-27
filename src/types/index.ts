// User types
export interface User {
  _id: string;
  email: string;
  username: string;
  password?: string;
  preferences: UserPreferences;
  apiKeys: ApiKeys;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: ThemeName;
  language: string;
  timezone: string;
  notifications: boolean;
}

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  deepseek?: string;
  qwen?: string;
  spotify?: {
    clientId: string;
    clientSecret: string;
  };
  youtube?: string;
}

// Theme types
export type ThemeName = 'oneDark' | 'dracula' | 'monokai' | 'light';

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

// Widget types
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
  | 'water';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Task types
export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Note types
export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Timer types
export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  type: 'timer' | 'pomodoro';
}

// AI Chat types
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

// Music types
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

// Data Generator types
export interface FakeDataConfig {
  type: 'person' | 'address' | 'company' | 'product' | 'custom';
  count: number;
  fields: string[];
  format: 'json' | 'csv' | 'xml';
}
