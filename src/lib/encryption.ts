import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 44) {
  throw new Error(
    'ENCRYPTION_KEY invalid. Must be 44 characters long (32 bytes in Base64)'
  );
}

const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

export function encrypt(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  if (!text) return '';
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('base64');
  const hash = crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('base64');
  const crypt = salt + hash;
  return crypt;
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
