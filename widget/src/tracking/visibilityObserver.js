/**
 * Observateur de visibilite des annonces
 * @module tracking/visibilityObserver
 */

import { TIMING } from '../core/constants.js';
import { createImpressionEvent, createViewDurationEvent } from './eventFactory.js';

/**
 * Cree un observateur de visibilite pour les annonces
 * @param {Function} onImpression - Callback pour impression validee
 * @param {Function} onViewEnd - Callback pour fin de vue
 * @returns {Object} Observer avec methodes observe, unobserve, destroy
 */
export function createVisibilityObserver(onImpression, onViewEnd) {
  // Map des annonces observees avec leurs timers
  const observedAds = new Map();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const adId = entry.target.dataset.adId;
      if (!adId) return;
      
      const adData = observedAds.get(adId) || createAdData();
      
      if (entry.isIntersecting && entry.intersectionRatio >= TIMING.VISIBILITY_THRESHOLD) {
        handleVisible(adId, adData, entry.intersectionRatio);
      } else {
        handleHidden(adId, adData);
      }
      
      observedAds.set(adId, adData);
    });
  }, {
    threshold: [0, 0.25, 0.5, 0.75, 1.0]
  });

  /**
   * Cree les donnees initiales pour une annonce
   * @returns {Object} Donnees de tracking
   */
  function createAdData() {
    return {
      visibleSince: null,
      impressionSent: false,
      impressionTimer: null,
      totalViewTime: 0
    };
  }

  /**
   * Gere l'apparition d'une annonce
   */
  function handleVisible(adId, adData, ratio) {
    if (adData.visibleSince === null) {
      adData.visibleSince = Date.now();
    }
    
    // Lance le timer pour valider l'impression
    if (!adData.impressionSent && !adData.impressionTimer) {
      adData.impressionTimer = setTimeout(() => {
        if (!adData.impressionSent) {
          adData.impressionSent = true;
          onImpression(createImpressionEvent(adId, ratio));
        }
      }, TIMING.IMPRESSION_THRESHOLD);
    }
  }

  /**
   * Gere la disparition d'une annonce
   */
  function handleHidden(adId, adData) {
    // Annule le timer d'impression si pas encore valide
    if (adData.impressionTimer) {
      clearTimeout(adData.impressionTimer);
      adData.impressionTimer = null;
    }
    
    // Calcule le temps de vue
    if (adData.visibleSince !== null) {
      const viewTime = Date.now() - adData.visibleSince;
      adData.totalViewTime += viewTime;
      adData.visibleSince = null;
      
      if (viewTime > 500) {
        onViewEnd(createViewDurationEvent(adId, viewTime));
      }
    }
  }

  return Object.freeze({
    observe: (element) => observer.observe(element),
    unobserve: (element) => observer.unobserve(element),
    getViewTime: (adId) => observedAds.get(adId)?.totalViewTime || 0,
    destroy: () => {
      observedAds.forEach(data => {
        if (data.impressionTimer) clearTimeout(data.impressionTimer);
      });
      observedAds.clear();
      observer.disconnect();
    }
  });
}
