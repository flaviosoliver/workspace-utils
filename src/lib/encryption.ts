import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

export function encryptData(data: string): string {
  try {
    // Usando Base64 SHA256 conforme especificado
    const hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Base64);
    return hash;
  } catch (error) {
    console.error('Erro ao encriptar dados:', error);
    throw new Error('Falha na encriptação');
  }
}

export function encryptToken(token: string): string {
  try {
    // Encriptação AES para tokens (reversível)
    const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Erro ao encriptar token:', error);
    throw new Error('Falha na encriptação do token');
  }
}

export function decryptToken(encryptedToken: string): string {
  try {
    // Descriptografia AES para tokens
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Erro ao descriptografar token:', error);
    throw new Error('Falha na descriptografia do token');
  }
}

export function generateSecureToken(): string {
  // Gera um token seguro para verificação de e-mail
  return CryptoJS.lib.WordArray.random(32).toString();
}

export function hashPassword(password: string): string {
  // Hash da senha usando SHA256 + Base64
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
}
