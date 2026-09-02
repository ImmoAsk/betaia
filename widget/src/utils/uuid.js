/**
 * Generateur d'identifiants uniques
 * @module utils/uuid
 */

/**
 * Genere un UUID v4
 * @returns {string} UUID unique
 */
export function generateUUID() {
  // Utilise crypto.randomUUID si disponible
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback avec crypto.getRandomValues
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    
    // Ajuste les bits pour UUID v4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32)
    ].join('-');
  }

  // Dernier fallback (moins securise)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Genere un identifiant court
 * @param {number} length - Longueur souhaitee
 * @returns {string} Identifiant court
 */
export function generateShortId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map(b => chars[b % chars.length])
      .join('');
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Genere un hash simple d'une chaine
 * @param {string} str - Chaine a hasher
 * @returns {string} Hash hexadecimal
 */
export function simpleHash(str) {
  let hash = 0;
  if (str.length === 0) return hash.toString(16);
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Conversion en 32bit integer
  }
  
  return Math.abs(hash).toString(16).padStart(8, '0');
}
