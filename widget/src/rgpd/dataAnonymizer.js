/**
 * Anonymiseur de donnees RGPD
 * @module rgpd/dataAnonymizer
 */

import { simpleHash } from '../utils/uuid.js';

/**
 * Anonymise une adresse IP
 * @param {string} ip - Adresse IP
 * @returns {string} IP anonymisee
 */
export function anonymizeIp(ip) {
  if (!ip || typeof ip !== 'string') return '';
  
  // IPv4: masque le dernier octet
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }
  }
  
  // IPv6: masque les 80 derniers bits
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return parts.slice(0, 4).join(':') + '::';
    }
  }
  
  return '';
}

/**
 * Anonymise un user agent
 * @param {string} ua - User Agent
 * @returns {string} UA anonymise
 */
export function anonymizeUserAgent(ua) {
  if (!ua || typeof ua !== 'string') return '';
  
  // Garde uniquement les infos generales
  const browser = extractBrowserName(ua);
  const os = extractOSName(ua);
  
  return `${browser}/${os}`;
}

/**
 * Extrait le nom du navigateur
 * @param {string} ua - User Agent
 * @returns {string} Nom du navigateur
 */
function extractBrowserName(ua) {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

/**
 * Extrait le nom de l'OS
 * @param {string} ua - User Agent
 * @returns {string} Nom de l'OS
 */
function extractOSName(ua) {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone')) return 'iOS';
  return 'Other';
}

/**
 * Hash une donnee sensible
 * @param {string} data - Donnee a hasher
 * @returns {string} Hash de la donnee
 */
export function hashSensitiveData(data) {
  if (!data || typeof data !== 'string') return '';
  return simpleHash(data);
}

/**
 * Anonymise une URL en supprimant les parametres sensibles
 * @param {string} url - URL a anonymiser
 * @returns {string} URL anonymisee
 */
export function anonymizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Parametres sensibles a supprimer
    const sensitiveParams = [
      'token', 'key', 'auth', 'password', 'email',
      'user', 'username', 'session', 'api_key', 'secret'
    ];
    
    sensitiveParams.forEach(param => {
      parsed.searchParams.delete(param);
    });
    
    return parsed.pathname + (parsed.search || '');
  } catch (e) {
    return '';
  }
}

/**
 * Anonymise un objet de contexte
 * @param {Object} context - Contexte a anonymiser
 * @returns {Object} Contexte anonymise
 */
export function anonymizeContext(context) {
  return {
    ...context,
    fp: context.fp ? hashSensitiveData(context.fp) : null,
    url: context.url ? anonymizeUrl(context.url) : null,
    ref: context.ref ? anonymizeUrl(context.ref) : null
  };
}
