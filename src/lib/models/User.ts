import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  name: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  preferences: {
    theme: string;
    language: string;
    timezone: string;
    notifications: boolean;
    waterReminder: {
      enabled: boolean;
      dailyGoal: number; // em ml
      interval: number; // em minutos
    };
  };
  apiTokens: {
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
    };
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      sparse: true,
    },
    verificationTokenExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
      sparse: true,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    preferences: {
      theme: {
        type: String,
        enum: [
          'oneDark',
          'dracula',
          'monokai',
          'light',
          'cyberpunk',
          'solarized',
          'synthwave',
        ],
        default: 'oneDark',
      },
      language: {
        type: String,
        default: 'pt-BR',
      },
      timezone: {
        type: String,
        default: 'America/Sao_Paulo',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      waterReminder: {
        enabled: {
          type: Boolean,
          default: false,
        },
        dailyGoal: {
          type: Number,
          default: 2000, // 2 litros em ml
        },
        interval: {
          type: Number,
          default: 60, // 1 hora em minutos
        },
      },
    },
    apiTokens: {
      openai: {
        type: String,
        default: '',
      },
      anthropic: {
        type: String,
        default: '',
      },
      google: {
        type: String,
        default: '',
      },
      deepseek: {
        type: String,
        default: '',
      },
      qwen: {
        type: String,
        default: '',
      },
      spotify: {
        clientId: {
          type: String,
          default: '',
        },
        clientSecret: {
          type: String,
          default: '',
        },
        accessToken: {
          type: String,
          default: '',
        },
        refreshToken: {
          type: String,
          default: '',
        },
      },
      youtube: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Índices para performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
