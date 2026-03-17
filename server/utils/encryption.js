const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
if (!process.env.ENCRYPTION_KEY) {
  console.warn('WARNING: ENCRYPTION_KEY environment variable is missing. Using a default secure key for development only.');
}
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-secure-key-12345', 'salt', 32);

// Legacy key - because dotenv was previously loaded late, older data may have used this specific fallback
const legacyKey = crypto.scryptSync('secret-key', 'salt', 32);

const iv = crypto.randomBytes(16);

// Encryption function
const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (err) {
    console.error('Encryption Error:', err.message);
    throw err;
  }
};

// Decryption function
const decrypt = (text) => {
  if (!text) return text;
  try {
    const parts = text.split(':');
    if (parts.length < 2) return text;

    const ivPart = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    
    // Attempt decryption with current key
    try {
      const decipher = crypto.createDecipheriv(algorithm, key, ivPart);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (primaryError) {
      // Fallback to legacy key for old data
      const legacyDecipher = crypto.createDecipheriv(algorithm, legacyKey, ivPart);
      let legacyDecrypted = legacyDecipher.update(encryptedText, 'hex', 'utf8');
      legacyDecrypted += legacyDecipher.final('utf8');
      return legacyDecrypted;
    }
  } catch (error) {
    // Silently return original text if it still fails (could just be normal text from early DB entries, or corrupted)
    return text;
  }
};

module.exports = { encrypt, decrypt };
