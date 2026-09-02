/**
 * Service de securite principal
 * @module security/securityService
 */

import { createFraudDetector } from './fraudDetector.js';
import { createHoneypot } from './honeypot.js';
import { sanitizeAds, sanitizeUrl } from './sanitizer.js';

/**
 * Cree le service de securite
 * @param {Function} onFraudDetected - Callback en cas de fraude
 * @returns {Object} Service de securite
 */
export function createSecurityService(onFraudDetected) {
  const fraudDetector = createFraudDetector();
  const honeypot = createHoneypot(handleHoneypotTrigger);
  let fraudScore = 0;

  /**
   * Gere le declenchement du honeypot
   * @param {Object} data - Donnees du declenchement
   */
  function handleHoneypotTrigger(data) {
    fraudScore += 100;
    onFraudDetected?.({
      type: 'honeypot',
      data,
      score: fraudScore
    });
  }

  /**
   * Valide et analyse un clic
   * @param {string} adId - ID de l'annonce
   * @param {number} displayTime - Temps depuis affichage
   * @param {Object} position - Position du clic
   * @returns {Object} Resultat de validation
   */
  function validateClick(adId, displayTime, position) {
    const analysis = fraudDetector.analyzeClick(adId, displayTime, position);
    
    if (analysis.suspicious) {
      fraudScore += analysis.score;
      onFraudDetected?.({
        type: 'click_fraud',
        adId,
        flags: analysis.flags,
        score: fraudScore
      });
    }

    return {
      valid: !analysis.suspicious,
      flags: analysis.flags
    };
  }

  /**
   * Verifie si le contexte est suspect
   * @returns {boolean} Contexte suspect
   */
  function isContextSuspicious() {
    if (fraudDetector.isAutomatedRequest()) {
      fraudScore += 50;
      return true;
    }
    
    if (honeypot.isTriggered()) {
      return true;
    }
    
    return fraudScore >= 100;
  }

  /**
   * Securise les donnees d'annonces
   * @param {Object[]} ads - Annonces a securiser
   * @returns {Object[]} Annonces securisees
   */
  function secureAds(ads) {
    return sanitizeAds(ads);
  }

  /**
   * Securise une URL
   * @param {string} url - URL a securiser
   * @returns {string|null} URL securisee
   */
  function secureUrl(url) {
    return sanitizeUrl(url);
  }

  /**
   * Recupere l'element honeypot a inserer
   * @returns {HTMLElement} Element honeypot
   */
  function getHoneypotElement() {
    return honeypot.createElement();
  }

  /**
   * Recupere le score de fraude actuel
   * @returns {number} Score de fraude
   */
  function getFraudScore() {
    return fraudScore;
  }

  /**
   * Reinitialise le service
   */
  function reset() {
    fraudDetector.reset();
    honeypot.reset();
    fraudScore = 0;
  }

  return Object.freeze({
    validateClick,
    isContextSuspicious,
    secureAds,
    secureUrl,
    getHoneypotElement,
    getFraudScore,
    reset
  });
}
