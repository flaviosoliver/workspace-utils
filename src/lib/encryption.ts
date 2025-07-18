import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? process.env.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)
  : crypto.randomBytes(32).toString('hex').slice(0, 32);
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

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
