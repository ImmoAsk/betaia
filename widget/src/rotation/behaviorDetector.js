/**
 * Detecteur de comportement utilisateur
 * @module rotation/behaviorDetector
 */

import { throttle } from '../utils/timing.js';

/**
 * Cree un detecteur de comportement
 * @param {Object} callbacks - Callbacks de notification
 * @returns {Object} Detecteur avec methodes
 */
export function createBehaviorDetector(callbacks) {
  const { onIdle, onReturn, onScrollPast, onEngagement } = callbacks;
  
  let lastActivity = Date.now();
  let isIdle = false;
  let wasHidden = false;
  let scrollPosition = 0;
  let idleTimer = null;
  let idleThreshold = 30000; // 30 secondes

  /**
   * Enregistre une activite utilisateur
   */
  function recordActivity() {
    lastActivity = Date.now();
    
    if (isIdle) {
      isIdle = false;
      onEngagement?.();
    }
    
    resetIdleTimer();
  }

  /**
   * Reinitialise le timer d'inactivite
   */
  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    
    idleTimer = setTimeout(() => {
      isIdle = true;
      onIdle?.();
    }, idleThreshold);
  }

  /**
   * Gere le changement de visibilite de la page
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      wasHidden = true;
    } else if (wasHidden) {
      wasHidden = false;
      onReturn?.();
    }
  }

  /**
   * Gere le scroll de la page
   * @param {HTMLElement} widgetElement - Element du widget
   */
  const handleScroll = throttle((widgetElement) => {
    if (!widgetElement) return;
    
    const rect = widgetElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Detecte si l'utilisateur a scrolle passe le widget
    if (rect.bottom < 0 && scrollPosition >= 0) {
      onScrollPast?.();
    }
    
    scrollPosition = rect.top;
    recordActivity();
  }, 200);

  /**
   * Configure les listeners
   * @param {HTMLElement} widgetElement - Element du widget
   * @returns {Function} Fonction de cleanup
   */
  function setup(widgetElement) {
    // Listeners d'activite
    const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, recordActivity, { passive: true });
    });

    // Listener de visibilite
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listener de scroll
    const scrollHandler = () => handleScroll(widgetElement);
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Demarre le timer
    resetIdleTimer();

    // Retourne la fonction de cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, recordActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', scrollHandler);
      handleScroll.cancel?.();
      if (idleTimer) clearTimeout(idleTimer);
    };
  }

  /**
   * Configure le seuil d'inactivite
   * @param {number} threshold - Seuil en ms
   */
  function setIdleThreshold(threshold) {
    idleThreshold = threshold;
    resetIdleTimer();
  }

  return Object.freeze({
    setup,
    recordActivity,
    setIdleThreshold,
    get isIdle() { return isIdle; },
    get lastActivity() { return lastActivity; }
  });
}
