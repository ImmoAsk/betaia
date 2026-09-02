/**
 * Gestionnaire d'historique des annonces vues
 * @module rotation/viewedHistory
 */

import { getItem, setItem } from '../utils/storage.js';
import { STORAGE_KEYS, LIMITS } from '../core/constants.js';

/**
 * Cree un gestionnaire d'historique
 * @param {number} maxSize - Taille max de l'historique
 * @returns {Object} Gestionnaire d'historique
 */
export function createViewedHistory(maxSize = 50) {
  let history = loadHistory();

  /**
   * Charge l'historique depuis le storage
   * @returns {Object[]} Historique charge
   */
  function loadHistory() {
    const stored = getItem(STORAGE_KEYS.VIEWED_ADS);
    return Array.isArray(stored) ? stored : [];
  }

  /**
   * Sauvegarde l'historique dans le storage
   */
  function saveHistory() {
    setItem(STORAGE_KEYS.VIEWED_ADS, history);
  }

  /**
   * Ajoute une annonce a l'historique
   * @param {string} adId - ID de l'annonce
   * @param {Object} metrics - Metriques associees
   */
  function addViewed(adId, metrics = {}) {
    // Supprime l'entree existante si presente
    history = history.filter(item => item.id !== adId);
    
    // Ajoute au debut
    history.unshift({
      id: adId,
      timestamp: Date.now(),
      metrics
    });
    
    // Limite la taille
    if (history.length > maxSize) {
      history = history.slice(0, maxSize);
    }
    
    saveHistory();
  }

  /**
   * Verifie si une annonce a ete vue
   * @param {string} adId - ID de l'annonce
   * @returns {boolean} Annonce vue
   */
  function hasViewed(adId) {
    return history.some(item => item.id === adId);
  }

  /**
   * Recupere les IDs des annonces vues
   * @param {number} limit - Nombre max d'IDs
   * @returns {string[]} Liste d'IDs
   */
  function getViewedIds(limit = 10) {
    return history.slice(0, limit).map(item => item.id);
  }

  /**
   * Recupere les metriques d'une annonce
   * @param {string} adId - ID de l'annonce
   * @returns {Object|null} Metriques ou null
   */
  function getMetrics(adId) {
    const item = history.find(h => h.id === adId);
    return item?.metrics || null;
  }

  /**
   * Met a jour les metriques d'une annonce
   * @param {string} adId - ID de l'annonce
   * @param {Object} metrics - Nouvelles metriques
   */
  function updateMetrics(adId, metrics) {
    const item = history.find(h => h.id === adId);
    if (item) {
      item.metrics = { ...item.metrics, ...metrics };
      saveHistory();
    }
  }

  /**
   * Nettoie les entrees anciennes
   * @param {number} maxAge - Age max en ms
   */
  function cleanup(maxAge = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAge;
    history = history.filter(item => item.timestamp > cutoff);
    saveHistory();
  }

  /**
   * Vide l'historique
   */
  function clear() {
    history = [];
    saveHistory();
  }

  return Object.freeze({
    addViewed,
    hasViewed,
    getViewedIds,
    getMetrics,
    updateMetrics,
    cleanup,
    clear,
    get size() { return history.length; }
  });
}
