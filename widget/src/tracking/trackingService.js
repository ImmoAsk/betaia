/**
 * Service principal de tracking
 * @module tracking/trackingService
 */

import { createEventQueue } from './eventQueue.js';
import { createEventSender } from './eventSender.js';
import { createVisibilityObserver } from './visibilityObserver.js';
import { createInteractionObserver } from './interactionObserver.js';
import { collectSessionContext } from './contextCollector.js';
import { VERSION } from '../core/constants.js';

/**
 * Cree le service de tracking complet
 * @param {Object} config - Configuration du widget
 * @param {string} trackingEndpoint - URL de l'API de tracking
 * @returns {Object} Service de tracking
 */
export function createTrackingService(config, trackingEndpoint) {
  let isEnabled = !config.noTracking;
  let context = null;
  
  const sender = createEventSender(trackingEndpoint);
  const queue = createEventQueue(flushEvents);
  
  const visibilityObserver = createVisibilityObserver(
    (event) => { if (isEnabled) queue.add(event); },
    (event) => { if (isEnabled) queue.add(event); }
  );
  
  const interactionObserver = createInteractionObserver(
    (event) => { if (isEnabled) queue.add(event); }
  );

  /**
   * Initialise le service avec le contexte
   */
  function init() {
    context = collectSessionContext(config.clientId);
    setupUnloadHandler();
    setupVisibilityHandler();
  }

  /**
   * Formate et envoie les evenements
   * @param {Object[]} events - Evenements a envoyer
   * @returns {Promise<boolean>}
   */
  async function flushEvents(events) {
    if (events.length === 0 || !isEnabled) return true;
    
    const payload = {
      v: VERSION,
      ctx: context,
      events
    };
    
    return sender.send(payload);
  }

  /**
   * Configure le handler de fermeture de page
   */
  function setupUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      const pending = queue.getPendingEvents();
      if (pending.length > 0 && isEnabled) {
        sender.sendViaBeacon({
          v: VERSION,
          ctx: context,
          events: pending
        });
      }
    });
  }

  /**
   * Configure le handler de changement de visibilite
   */
  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        queue.flush();
      }
    });
  }

  /**
   * Observe une annonce pour le tracking
   * @param {HTMLElement} element - Element annonce
   * @param {string} adId - ID de l'annonce
   */
  function trackAd(element, adId) {
    element.dataset.adId = adId;
    visibilityObserver.observe(element);
    interactionObserver.attach(element, adId);
  }

  /**
   * Arrete le tracking d'une annonce
   * @param {HTMLElement} element - Element annonce
   */
  function untrackAd(element) {
    visibilityObserver.unobserve(element);
    interactionObserver.detach(element);
  }

  /**
   * Ajoute un evenement personnalise
   * @param {Object} event - Evenement a ajouter
   */
  function track(event) {
    if (isEnabled) queue.add(event);
  }

  /**
   * Active/desactive le tracking
   * @param {boolean} enabled - Etat souhaite
   */
  function setEnabled(enabled) {
    isEnabled = enabled;
    if (!enabled) queue.clear();
  }

  /**
   * Detruit le service proprement
   */
  function destroy() {
    queue.destroy();
    visibilityObserver.destroy();
    interactionObserver.destroy();
  }

  return Object.freeze({
    init, trackAd, untrackAd, track, setEnabled, destroy,
    get isEnabled() { return isEnabled; }
  });
}
