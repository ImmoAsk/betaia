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
  const defaultTimeout = 10000;
  
  // Utilise le proxy sur le meme domaine que le widget
  const proxyUrl = `${baseUrl}/api/ads`;

  /**
   * Recupere les annonces via le proxy API
   * @param {string} clientId - ID du client
   * @param {number} limit - Nombre max d'annonces
   * @returns {Promise<Object[]>} Liste des annonces
   */
  async function fetchAds(clientId, limit = 6) {
    const url = `${proxyUrl}?limit=${limit}&usage=1&status=1`;
    
    console.log('[AnnoncesWidget] URL Proxy:', url);

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
      
      return json.ads || [];
    } catch (error) {
      console.error('[AnnoncesWidget] Erreur API:', error);
      throw error;
    }
  }

  /**
   * Prefetch les annonces suivantes
   */
  async function prefetchAds(clientId, excludeIds = [], limit = 6) {
    return fetchAds(clientId, limit);
  }

  return Object.freeze({
    fetchAds,
    prefetchAds
  });
}
