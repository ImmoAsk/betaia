/**
 * API publique du widget
 * @module api/publicApi
 */

import { NAMESPACE, VERSION } from '../core/constants.js';

/**
 * Cree l'API publique exposee sur window
 * @param {Object} services - Services internes
 * @returns {Object} API publique frozen
 */
export function createPublicApi(services) {
  const { 
    refresh, 
    getStats, 
    destroy 
  } = services;

  const api = {
    /**
     * Version du widget
     */
    version: VERSION,

    /**
     * Recharge les annonces
     * @returns {Promise<void>}
     */
    refresh: async () => {
      try {
        await refresh();
      } catch (error) {
        console.error('[AnnoncesWidget] Erreur refresh:', error.message);
      }
    },

    /**
     * Recupere les statistiques locales
     * @returns {Object} Statistiques
     */
    getStats: () => {
      try {
        return getStats();
      } catch (error) {
        return { error: error.message };
      }
    },

    /**
     * Detruit le widget
     */
    destroy: () => {
      try {
        destroy();
        delete window[NAMESPACE];
      } catch (error) {
        console.error('[AnnoncesWidget] Erreur destroy:', error.message);
      }
    }
  };

  return Object.freeze(api);
}

/**
 * Expose l'API sur le namespace global
 * @param {Object} api - API a exposer
 */
export function exposePublicApi(api) {
  // Protection contre les modifications
  Object.defineProperty(window, NAMESPACE, {
    value: api,
    writable: false,
    configurable: true
  });
}

/**
 * Verifie si le widget est deja charge
 * @returns {boolean} Widget deja charge
 */
export function isWidgetLoaded() {
  return typeof window[NAMESPACE] !== 'undefined';
}
