import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './mongodb';
import User from './models/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      typeof (decoded as any).userId === 'string'
    ) {
      return { userId: (decoded as any).userId };
    }

    return null;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

export async function verifyTokenToRegister(token: string) {
  await connectDB();

  const user = await User.findOne({ verificationToken: token }).exec();

  if (!user) {
    throw new Error('Invalid token');
  }

  if (user.isVerified) {
    return { user, alreadyVerified: true };
  }

  if (
    user.verificationTokenExpires &&
    user.verificationTokenExpires <= new Date()
  ) {
    throw new Error('Expired token');
  }

  return { user, alreadyVerified: false };
}

export function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function signJwt(payload: object) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET not set');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyJwt(token: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET not set');
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}
