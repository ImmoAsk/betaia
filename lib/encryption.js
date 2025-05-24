import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY_ENV = process.env.TOKEN_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY_ENV) {
  throw new Error(
    "TOKEN_ENCRYPTION_KEY is not set in environment variables. This is required for encryption/decryption."
  );
}

if (Buffer.from(ENCRYPTION_KEY_ENV, "utf8").length !== 32) {
  throw new Error("TOKEN_ENCRYPTION_KEY must be exactly 32 bytes long.");
}

const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_ENV, "utf8");

// IV should be random for each encryption for CBC mode
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text) {
  if (text === null || typeof text === "undefined") {
    // Allowing null to be passed through, could also throw error if null is not an expected value
    console.warn("Encryption called with null or undefined text.");
    return null;
  }
  if (typeof text !== "string") {
    console.warn(
      `Encryption input was not a string (type: ${typeof text}). Coercing to string.`
    );
    text = String(text); // Or throw new Error('Encryption input must be a string.');
  }

  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (error) {
    console.error(
      "Encryption failed unexpectedly:",
      error.message,
      error.stack
    );
    throw new Error("Failed to encrypt data.");
  }
}

export function decrypt(text) {
  if (text === null || typeof text === "undefined") {
    console.warn("Decryption called with null or undefined text.");
    return null;
  }
  if (typeof text !== "string") {
    // This is more critical, as non-string is likely an error or corrupted data.
    console.error("Decryption failed: input text is not a string.");
    throw new Error("Invalid input for decryption: not a string.");
  }

  try {
    const textParts = text.split(":");
    if (textParts.length !== 2) {
      console.error(
        "Decryption failed: Invalid encrypted format. Expected 'iv:encrypted_text'. Received:",
        text
      );
      throw new Error("Invalid encrypted data format.");
    }
    const ivHex = textParts.shift();
    const encryptedTextHex = textParts.join(":");

    if (!/^[0-9a-fA-F]+$/.test(ivHex) || ivHex.length !== IV_LENGTH * 2) {
      console.error("Decryption failed: Invalid IV format or length.");
      throw new Error("Invalid IV in encrypted data.");
    }
    if (!/^[0-9a-fA-F]+$/.test(encryptedTextHex)) {
      console.error(
        "Decryption failed: Encrypted text contains non-hex characters."
      );
      throw new Error("Invalid encrypted text format.");
    }

    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedTextHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    // Log the original error for server-side diagnostics
    console.error(
      "Decryption failed unexpectedly:",
      error.message,
      error.stack
    );
    // Throw a more generic error to the caller to avoid leaking sensitive details
    throw new Error(
      "Failed to decrypt data. Data may be corrupted or key may be incorrect."
    );
  }
}
