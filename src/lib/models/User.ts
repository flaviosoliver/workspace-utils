import bcrypt from 'bcryptjs';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updatePassword = async function (newPassword: string) {
  this.password = newPassword;
  return this.save();
};

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
