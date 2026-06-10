import crypto from 'node:crypto';

function keyForm(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptSecret(plaintext, secret) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyForm(secret), iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${tag.toString('base64')}:${enc.toString('base64')}`;
}

export function decryptSecret(payload, secret) {
  const [iv, tag, enc] = payload.split('.');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    keyForm(secret),
    Buffer.from(iv, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(enc, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
