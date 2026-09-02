/**
 * Detecteur de fraude aux clics
 * @module security/fraudDetector
 */

import { TIMING, LIMITS } from '../core/constants.js';

/**
 * Cree un detecteur de fraude
 * @returns {Object} Detecteur avec methodes d'analyse
 */
export function createFraudDetector() {
  const clickHistory = [];
  const suspiciousPatterns = [];
  
  /**
   * Enregistre et analyse un clic
   * @param {string} adId - ID de l'annonce
   * @param {number} displayTime - Temps depuis affichage (ms)
   * @param {Object} position - Position du clic
   * @returns {Object} Resultat d'analyse
   */
  function analyzeClick(adId, displayTime, position) {
    const now = Date.now();
    const result = {
      suspicious: false,
      flags: [],
      score: 0
    };

    // Verification du temps depuis affichage
    if (displayTime < TIMING.CLICK_FRAUD_THRESHOLD) {
      result.flags.push('too_fast');
      result.score += 30;
    }

    // Verification du rate de clics
    const recentClicks = clickHistory.filter(c => now - c.time < 60000);
    if (recentClicks.length >= LIMITS.MAX_CLICKS_PER_MINUTE) {
      result.flags.push('rate_exceeded');
      result.score += 40;
    }

    // Detection de patterns repetitifs
    if (detectRepetitivePattern(position)) {
      result.flags.push('repetitive_pattern');
      result.score += 50;
    }

    // Enregistre le clic
    clickHistory.push({ adId, time: now, position });
    
    // Nettoie l'historique ancien
    cleanupHistory();

    result.suspicious = result.score >= 50;
    return result;
  }

  /**
   * Detecte un pattern de clics repetitif
   * @param {Object} position - Position du clic
   * @returns {boolean} Pattern detecte
   */
  function detectRepetitivePattern(position) {
    const lastClicks = clickHistory.slice(-5);
    if (lastClicks.length < 3) return false;

    // Verifie si les positions sont trop similaires
    const similarCount = lastClicks.filter(c => {
      const dx = Math.abs(c.position.x - position.x);
      const dy = Math.abs(c.position.y - position.y);
      return dx < 10 && dy < 10;
    }).length;

    return similarCount >= 3;
  }

  /**
   * Nettoie l'historique des clics anciens
   */
  function cleanupHistory() {
    const cutoff = Date.now() - 300000; // 5 minutes
    while (clickHistory.length > 0 && clickHistory[0].time < cutoff) {
      clickHistory.shift();
    }
  }

  /**
   * Verifie si une requete semble automatisee
   * @returns {boolean} Requete suspecte
   */
  function isAutomatedRequest() {
    // Verifie les signaux d'automatisation
    const webdriver = navigator.webdriver;
    const phantom = window.callPhantom || window._phantom;
    const selenium = window.document.__selenium_unwrapped;
    
    return !!(webdriver || phantom || selenium);
  }

  /**
   * Reinitialise le detecteur
   */
  function reset() {
    clickHistory.length = 0;
    suspiciousPatterns.length = 0;
  }

  return Object.freeze({
    analyzeClick,
    isAutomatedRequest,
    reset
  });
}
