/**
 * Service de rotation des annonces
 * @module rotation/rotationService
 */

import { createBehaviorDetector } from './behaviorDetector.js';
import { createViewedHistory } from './viewedHistory.js';
import { sortAdsByPriority, calculateEngagementScore } from './scoringEngine.js';
import { TIMING } from '../core/constants.js';

/**
 * Cree le service de rotation
 * @param {Function} onRotate - Callback de rotation
 * @returns {Object} Service de rotation
 */
export function createRotationService(onRotate) {
  const history = createViewedHistory();
  let behaviorDetector = null;
  let cleanupBehavior = null;
  let currentAds = [];
  let allAds = [];
  let rotationCount = 0;

  /**
   * Initialise le service avec les annonces disponibles
   * @param {Object[]} ads - Toutes les annonces disponibles
   * @param {Object[]} initialAds - Annonces initiales a afficher
   */
  function init(ads, initialAds) {
    allAds = ads;
    currentAds = initialAds;
    
    // Marque les annonces initiales comme vues
    initialAds.forEach(ad => history.addViewed(ad.id, { impressions: 1 }));
  }

  /**
   * Configure la detection de comportement
   * @param {HTMLElement} widgetElement - Element du widget
   */
  function setupBehaviorDetection(widgetElement) {
    behaviorDetector = createBehaviorDetector({
      onIdle: handleIdle,
      onReturn: handleReturn,
      onScrollPast: handleScrollPast,
      onEngagement: handleEngagement
    });
    
    cleanupBehavior = behaviorDetector.setup(widgetElement);
  }

  /**
   * Gere l'inactivite utilisateur
   */
  function handleIdle() {
    triggerRotation('idle');
  }

  /**
   * Gere le retour de l'utilisateur
   */
  function handleReturn() {
    triggerRotation('return');
  }

  /**
   * Gere le scroll passe le widget
   */
  function handleScrollPast() {
    // Optionnel: rotation si aucune interaction
    if (!hasUserEngaged()) {
      triggerRotation('scroll_past');
    }
  }

  /**
   * Gere un engagement utilisateur
   */
  function handleEngagement() {
    // Met a jour les metriques
    currentAds.forEach(ad => {
      const metrics = history.getMetrics(ad.id) || {};
      history.updateMetrics(ad.id, {
        ...metrics,
        engagements: (metrics.engagements || 0) + 1
      });
    });
  }

  /**
   * Verifie si l'utilisateur a interagi
   * @returns {boolean} Engagement detecte
   */
  function hasUserEngaged() {
    return currentAds.some(ad => {
      const metrics = history.getMetrics(ad.id);
      return metrics && (metrics.clicked || metrics.hoverDuration > 2000);
    });
  }

  /**
   * Declenche une rotation des annonces
   * @param {string} reason - Raison de la rotation
   */
  function triggerRotation(reason) {
    const context = { viewedAds: history.getViewedIds(20) };
    const sortedAds = sortAdsByPriority(allAds, context);
    
    // Selectionne les nouvelles annonces
    const newAds = sortedAds
      .filter(ad => !currentAds.find(c => c.id === ad.id))
      .slice(0, currentAds.length);
    
    if (newAds.length === 0) return;

    // Marque comme vues
    newAds.forEach(ad => history.addViewed(ad.id, { impressions: 1 }));
    
    currentAds = newAds;
    rotationCount++;
    
    onRotate?.(newAds, reason);
  }

  /**
   * Enregistre un clic sur une annonce
   * @param {string} adId - ID de l'annonce
   */
  function recordClick(adId) {
    history.updateMetrics(adId, { clicked: true });
  }

  /**
   * Enregistre le temps de vue
   * @param {string} adId - ID de l'annonce
   * @param {number} time - Temps en ms
   */
  function recordViewTime(adId, time) {
    const metrics = history.getMetrics(adId) || {};
    history.updateMetrics(adId, {
      viewTime: (metrics.viewTime || 0) + time
    });
  }

  /**
   * Detruit le service
   */
  function destroy() {
    cleanupBehavior?.();
    history.cleanup();
  }

  return Object.freeze({
    init, setupBehaviorDetection, triggerRotation,
    recordClick, recordViewTime, destroy,
    get currentAds() { return currentAds; },
    get rotationCount() { return rotationCount; }
  });
}
