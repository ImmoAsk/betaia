/**
 * Observateur d'interactions utilisateur
 * @module tracking/interactionObserver
 */

import { throttle } from '../utils/timing.js';
import { createHoverEvent, createScrollDepthEvent, createClickEvent } from './eventFactory.js';

/**
 * Cree un observateur d'interactions sur les annonces
 * @param {Function} onEvent - Callback pour les evenements d'interaction
 * @returns {Object} Observer avec methodes attach, detach, destroy
 */
export function createInteractionObserver(onEvent) {
  const trackedElements = new WeakMap();
  const handlers = new Map();

  /**
   * Attache les listeners a un element d'annonce
   * @param {HTMLElement} element - Element annonce
   * @param {string} adId - ID de l'annonce
   */
  function attach(element, adId) {
    if (trackedElements.has(element)) return;

    const state = {
      hoverStart: null,
      maxScrollDepth: 0
    };

    // Handler de survol entree
    const handleMouseEnter = () => {
      state.hoverStart = Date.now();
    };

    // Handler de survol sortie
    const handleMouseLeave = () => {
      if (state.hoverStart) {
        const duration = Date.now() - state.hoverStart;
        if (duration > 100) {
          onEvent(createHoverEvent(adId, duration));
        }
        state.hoverStart = null;
      }
    };

    // Handler de scroll throttle
    const handleScroll = throttle(() => {
      const rect = element.getBoundingClientRect();
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calcul de la profondeur visible
      const visibleTop = Math.max(0, -rect.top);
      const depth = Math.min(1, visibleTop / elementHeight);
      
      if (depth > state.maxScrollDepth) {
        state.maxScrollDepth = depth;
        if (depth >= 0.25) {
          onEvent(createScrollDepthEvent(adId, depth));
        }
      }
    }, 200);

    // Handler de clic
    const handleClick = (event) => {
      const rect = element.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      onEvent(createClickEvent(adId, position));
    };

    // Attache les listeners
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Stocke les references pour cleanup
    const elementHandlers = {
      mouseenter: handleMouseEnter,
      mouseleave: handleMouseLeave,
      click: handleClick,
      scroll: handleScroll
    };

    trackedElements.set(element, state);
    handlers.set(element, elementHandlers);
  }

  /**
   * Detache les listeners d'un element
   * @param {HTMLElement} element - Element a detacher
   */
  function detach(element) {
    const elementHandlers = handlers.get(element);
    if (!elementHandlers) return;

    element.removeEventListener('mouseenter', elementHandlers.mouseenter);
    element.removeEventListener('mouseleave', elementHandlers.mouseleave);
    element.removeEventListener('click', elementHandlers.click);
    window.removeEventListener('scroll', elementHandlers.scroll);
    elementHandlers.scroll.cancel?.();

    handlers.delete(element);
    trackedElements.delete(element);
  }

  /**
   * Detruit l'observateur
   */
  function destroy() {
    handlers.forEach((_, element) => detach(element));
  }

  return Object.freeze({ attach, detach, destroy });
}
