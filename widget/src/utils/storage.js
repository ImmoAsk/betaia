/**
 * Utilitaires de stockage (SessionStorage avec fallback)
 * @module utils/storage
 */

import { LIMITS, STORAGE_KEYS } from '../core/constants.js';

/**
 * Verifie si le storage est disponible
 * @param {string} type - 'localStorage' ou 'sessionStorage'
 * @returns {boolean} Disponibilite
 */
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Cache memoire en fallback
const memoryCache = new Map();
const hasSessionStorage = isStorageAvailable('sessionStorage');

/**
 * Recupere une valeur du storage
 * @param {string} key - Cle de stockage
 * @returns {any} Valeur parsee ou null
 */
export function getItem(key) {
  try {
    if (hasSessionStorage) {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return memoryCache.get(key) || null;
  } catch (e) {
    return memoryCache.get(key) || null;
  }
}

/**
 * Stocke une valeur
 * @param {string} key - Cle de stockage
 * @param {any} value - Valeur a stocker
 */
export function setItem(key, value) {
  try {
    const serialized = JSON.stringify(value);
    if (hasSessionStorage) {
      sessionStorage.setItem(key, serialized);
    }
    memoryCache.set(key, value);
  } catch (e) {
    memoryCache.set(key, value);
  }
}

/**
 * Supprime une valeur
 * @param {string} key - Cle de stockage
 */
export function removeItem(key) {
  try {
    if (hasSessionStorage) {
      sessionStorage.removeItem(key);
    }
    memoryCache.delete(key);
  } catch (e) {
    memoryCache.delete(key);
  }
}

/**
 * Gere le cache des annonces avec limite de taille
 * @param {string} adId - ID de l'annonce
 * @param {Object} data - Donnees a cacher
 */
export function cacheAd(adId, data) {
  const cache = getItem(STORAGE_KEYS.CACHE) || {};
  const keys = Object.keys(cache);
  
  // Supprime les plus anciennes si limite atteinte
  if (keys.length >= LIMITS.MAX_CACHE_ITEMS) {
    const oldestKey = keys[0];
    delete cache[oldestKey];
  }
  
  cache[adId] = { data, timestamp: Date.now() };
  setItem(STORAGE_KEYS.CACHE, cache);
}

/**
 * Recupere une annonce du cache
 * @param {string} adId - ID de l'annonce
 * @returns {Object|null} Donnees cachees ou null
 */
export function getCachedAd(adId) {
  const cache = getItem(STORAGE_KEYS.CACHE) || {};
  return cache[adId]?.data || null;
}
