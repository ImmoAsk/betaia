/**
 * Client API pour recuperer les annonces betaia
 * @module api/adsClient
 */

import { withTimeout } from '../utils/timing.js';

/**
 * Cree un client API pour les annonces
 * @param {string} baseUrl - URL de base detectee du script
 * @returns {Object} Client avec methodes
 */
export function createAdsClient(baseUrl) {
  const defaultTimeout = 15000;
  const maxRetries = 3;
  const retryDelay = 1000;
  
  // Utilise le proxy sur le meme domaine que le widget
  const proxyUrl = `${baseUrl}/api/ads`;

  /**
   * Pause pour retry
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Recupere les annonces via le proxy API avec retry
   * @param {number} limit - Nombre max d'annonces
   * @returns {Promise<Object[]>} Liste des annonces
   */
  async function fetchAds(limit = 6) {
    const url = `${proxyUrl}?limit=${limit}&usage=1&status=1`;
    
    console.log('[AnnoncesWidget] URL Proxy:', url);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await withTimeout(
          () => fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'omit'
          }),
          defaultTimeout
        );

        console.log('[AnnoncesWidget] Response status:', response.status);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const json = await response.json();
        console.log('[AnnoncesWidget] Annonces recues:', json.ads?.length || 0);
        
        // Valide les donnees : filtre sans image et doublons d'images
        const raw = Array.isArray(json.ads) ? json.ads : [];
        const seenImages = new Set();
        return raw.filter(ad => {
          if (!ad || !ad.id) return false;
          if (!ad.imageUrl || !ad.imageUrl.trim()) return false;
          if (seenImages.has(ad.imageUrl)) return false;
          seenImages.add(ad.imageUrl);
          return true;
        });
        
      } catch (error) {
        console.warn(`[AnnoncesWidget] Tentative ${attempt}/${maxRetries} echouee:`, error.message);
        
        if (attempt < maxRetries) {
          await sleep(retryDelay * attempt);
        } else {
          console.error('[AnnoncesWidget] Toutes les tentatives echouees');
          throw error;
        }
      }
    }
    
    return [];
  }

  /**
   * Prefetch les annonces suivantes
   */
  async function prefetchAds(limit = 6) {
    try {
      return await fetchAds(limit);
    } catch (error) {
      console.warn('[AnnoncesWidget] Prefetch echoue:', error.message);
      return [];
    }
  }

  return Object.freeze({
    fetchAds,
    prefetchAds
  });
}
