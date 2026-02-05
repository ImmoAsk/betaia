/**
 * Expediteur d'evenements vers le serveur
 * @module tracking/eventSender
 */

import { LIMITS, TIMING } from '../core/constants.js';

/**
 * Cree un expediteur d'evenements
 * @param {string} endpoint - URL de l'API de tracking
 * @returns {Object} Sender avec methodes send, sendBeacon
 */
export function createEventSender(endpoint) {
  let retryCount = 0;

  /**
   * Envoie des evenements via fetch
   * @param {Object} payload - Donnees a envoyer
   * @returns {Promise<boolean>} Succes de l'envoi
   */
  async function send(payload) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'omit',
        keepalive: true
      });

      if (response.ok) {
        retryCount = 0;
        return true;
      }

      return await handleRetry(payload);
    } catch (error) {
      return await handleRetry(payload);
    }
  }

  /**
   * Gere les retries avec backoff exponentiel
   * @param {Object} payload - Donnees a renvoyer
   * @returns {Promise<boolean>} Succes du retry
   */
  async function handleRetry(payload) {
    if (retryCount >= LIMITS.MAX_RETRY_ATTEMPTS) {
      retryCount = 0;
      return false;
    }

    retryCount++;
    const backoffDelay = Math.pow(2, retryCount) * 1000;
    
    await new Promise(resolve => setTimeout(resolve, backoffDelay));
    return send(payload);
  }

  /**
   * Envoie des evenements via sendBeacon (pour unload)
   * @param {Object} payload - Donnees a envoyer
   * @returns {boolean} Succes de l'envoi
   */
  function sendViaBeacon(payload) {
    if (!navigator.sendBeacon) {
      return false;
    }

    const blob = new Blob(
      [JSON.stringify(payload)],
      { type: 'application/json' }
    );

    return navigator.sendBeacon(endpoint, blob);
  }

  /**
   * Envoie avec fallback automatique
   * @param {Object} payload - Donnees a envoyer
   * @param {boolean} useBeacon - Utiliser sendBeacon si possible
   * @returns {Promise<boolean>|boolean} Succes
   */
  function sendWithFallback(payload, useBeacon = false) {
    if (useBeacon && navigator.sendBeacon) {
      return sendViaBeacon(payload);
    }
    return send(payload);
  }

  return Object.freeze({
    send,
    sendViaBeacon,
    sendWithFallback
  });
}
