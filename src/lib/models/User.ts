import { IUser, ThemeName } from '@/types';
import bcrypt from 'bcryptjs';
import mongoose, { Schema, Document, Model } from 'mongoose';

interface UserDocument extends Omit<IUser, '_id'>, Document {
  email: string;
  name: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  preferences: {
    theme: ThemeName;
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
  };
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  updatePassword(newPassword: string): Promise<UserDocument>;
  toJSON(): Record<string, any>;
  save(): Promise<UserDocument>;
}

type UserModel = Model<UserDocument, Record<string, never>, UserMethods>;

const UserSchema = new Schema<UserDocument, UserModel, UserMethods>(
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
      ytmusic: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.method(
  'comparePassword',
  async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  }
);

UserSchema.method('updatePassword', async function (newPassword: string) {
  this.password = newPassword;
  return this.save();
});

UserSchema.method('toJSON', function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
});

// UserSchema.method('save', async function (user: UserDocument) {

// }

UserSchema.virtual('id').get(function (this: UserDocument) {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
});

const User: UserModel =
  mongoose.models.User ||
  mongoose.model<UserDocument, UserModel>('User', UserSchema);

export default User;
