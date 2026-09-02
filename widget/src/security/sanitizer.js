/**
 * Sanitizer pour prevenir les attaques XSS
 * @module security/sanitizer
 */

import { escapeHtml } from '../utils/dom.js';

function isSafeHttpHost(hostname) {
  const host = String(hostname || '').trim().toLowerCase();
  if (!host) return false;
  if (host === '&' || host === '...') return false;
  if (host.includes('&')) return false;
  if (!/[a-z0-9]/i.test(host)) return false;
  return /^[a-z0-9.-]+$/i.test(host);
}

/**
 * Sanitize une chaine pour affichage HTML
 * @param {string} input - Chaine a sanitizer
 * @returns {string} Chaine securisee
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return escapeHtml(input);
}

/**
 * Sanitize une URL
 * @param {string} url - URL a valider
 * @returns {string|null} URL valide ou null
 */
export function sanitizeUrl(url) {
  if (typeof url !== 'string') return null;
  
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  // Bloque les protocoles dangereux
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:'
  ];
  
  const lowerUrl = trimmed.toLowerCase();
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return null;
    }
  }
  
  // Valide le format URL
  try {
    const parsed = new URL(trimmed, window.location.origin);
    // Accepte uniquement http et https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    if (!isSafeHttpHost(parsed.hostname)) {
      return null;
    }
    return parsed.href;
  } catch (e) {
    return null;
  }
}

/**
 * Sanitize un objet d'annonce
 * @param {Object} ad - Objet annonce brut
 * @returns {Object} Annonce sanitizee
 */
export function sanitizeAd(ad) {
  if (!ad || typeof ad !== 'object') {
    return null;
  }

  return {
    id: sanitizeText(String(ad.id || '')),
    title: sanitizeText(String(ad.title || '')),
    description: sanitizeText(String(ad.description || '')),
    price: sanitizeNumber(ad.price),
    currency: sanitizeText(String(ad.currency || 'EUR')),
    imageUrl: sanitizeUrl(ad.imageUrl),
    linkUrl: sanitizeUrl(ad.linkUrl),
    location: sanitizeText(String(ad.location || '')),
    category: sanitizeText(String(ad.category || '')),
    propertyType: sanitizeText(String(ad.propertyType || '')),
    offer: sanitizeText(String(ad.offer || '')),
    surface: sanitizeNumber(ad.surface),
    rooms: sanitizeNumber(ad.rooms),
    bathrooms: sanitizeNumber(ad.bathrooms),
    garage: sanitizeNumber(ad.garage),
    badgeLabel: sanitizeText(String(ad.badgeLabel || ''))
  };
}

/**
 * Sanitize un nombre
 * @param {any} value - Valeur a sanitizer
 * @returns {number|null} Nombre valide ou null
 */
export function sanitizeNumber(value) {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  return num;
}

/**
 * Sanitize un tableau d'annonces
 * @param {Object[]} ads - Tableau d'annonces
 * @returns {Object[]} Annonces sanitizees
 */
export function sanitizeAds(ads) {
  if (!Array.isArray(ads)) return [];
  return ads.map(sanitizeAd).filter(Boolean);
}
