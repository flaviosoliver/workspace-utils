import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!.padEnd(32, '0');
const IV_LENGTH = 16;

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string) {
  const [iv, encryptedText] = text.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
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
