/**
 * Cache d'annonces prefetchees
 * @module api/adsCache
 */

import { LIMITS } from '../core/constants.js';

/**
 * Cree un cache d'annonces en memoire
 * @param {number} maxSize - Taille maximum
 * @returns {Object} Cache avec methodes
 */
export function createAdsCache(maxSize = LIMITS.MAX_CACHE_ITEMS) {
  const cache = new Map();
  const ttl = 5 * 60 * 1000; // 5 minutes

  /**
   * Stocke des annonces dans le cache
   * @param {string} key - Cle de cache
   * @param {Object[]} ads - Annonces a cacher
   */
  function set(key, ads) {
    // Nettoie si limite atteinte
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    cache.set(key, {
      ads,
      timestamp: Date.now()
    });
  }

  /**
   * Recupere des annonces du cache
   * @param {string} key - Cle de cache
   * @returns {Object[]|null} Annonces ou null si expire
   */
  function get(key) {
    const entry = cache.get(key);
    
    if (!entry) return null;
    
    // Verifie expiration
    if (Date.now() - entry.timestamp > ttl) {
      cache.delete(key);
      return null;
    }
    
    return entry.ads;
  }

  /**
   * Genere une cle de cache
   * @param {string} scopeKey - Cle de scope (optionnel)
   * @param {number} limit - Limite
   * @param {string[]} excludeIds - IDs exclus
   * @returns {string} Cle generee
   */
  function generateKey(scopeKey, limit, excludeIds = []) {
    return `${scopeKey || 'default'}:${limit}:${excludeIds.sort().join(',')}`;
  }

  /**
   * Stocke une annonce individuelle
   * @param {Object} ad - Annonce a cacher
   */
  function setAd(ad) {
    if (!ad || !ad.id) return;
    
    const key = `ad:${ad.id}`;
    cache.set(key, {
      ads: [ad],
      timestamp: Date.now()
    });
  }

  /**
   * Recupere une annonce individuelle
   * @param {string} adId - ID de l'annonce
   * @returns {Object|null} Annonce ou null
   */
  function getAd(adId) {
    const key = `ad:${adId}`;
    const entry = cache.get(key);
    
    if (!entry || Date.now() - entry.timestamp > ttl) {
      cache.delete(key);
      return null;
    }
    
    return entry.ads[0];
  }

  /**
   * Vide le cache
   */
  function clear() {
    cache.clear();
  }

  /**
   * Nettoie les entrees expirees
   */
  function cleanup() {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > ttl) {
        cache.delete(key);
      }
    }
  }

  return Object.freeze({
    set,
    get,
    generateKey,
    setAd,
    getAd,
    clear,
    cleanup,
    get size() { return cache.size; }
  });
}
