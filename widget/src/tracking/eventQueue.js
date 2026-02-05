/**
 * Queue d'evenements avec gestion asynchrone
 * @module tracking/eventQueue
 */

import { LIMITS, TIMING } from '../core/constants.js';
import { isCriticalEvent, isHighPriorityEvent } from './eventTypes.js';

/**
 * Cree une queue d'evenements
 * @param {Function} flushCallback - Callback (events) => Promise
 * @returns {Object} Queue avec methodes add, flush, destroy
 */
export function createEventQueue(flushCallback) {
  const queue = [];
  let flushTimer = null;
  let isDestroyed = false;

  /**
   * Planifie un flush automatique
   */
  function scheduleFlush() {
    if (flushTimer || isDestroyed) return;
    
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flush();
    }, TIMING.BATCH_INTERVAL);
  }

  /**
   * Ajoute un evenement a la queue
   * @param {Object} event - Evenement a ajouter
   */
  function add(event) {
    if (isDestroyed) return;
    
    queue.push(event);
    
    // Envoi immediat pour evenements critiques
    if (isCriticalEvent(event.type)) {
      flush();
      return;
    }
    
    // Envoi si limite atteinte
    if (queue.length >= LIMITS.MAX_QUEUE_SIZE) {
      flush();
      return;
    }
    
    scheduleFlush();
  }

  /**
   * Envoie tous les evenements en attente
   * @returns {Promise<boolean>} Succes de l'envoi
   */
  async function flush() {
    if (queue.length === 0 || isDestroyed) return true;
    
    // Copie et vide la queue
    const events = queue.splice(0, queue.length);
    
    try {
      await flushCallback(events);
      return true;
    } catch (error) {
      // Remet les evenements haute priorite dans la queue
      const highPriority = events.filter(e => isHighPriorityEvent(e.type));
      queue.unshift(...highPriority);
      return false;
    }
  }

  /**
   * Recupere les evenements en attente (pour sendBeacon)
   * @returns {Object[]} Evenements en attente
   */
  function getPendingEvents() {
    return [...queue];
  }

  /**
   * Vide la queue sans envoi
   */
  function clear() {
    queue.length = 0;
  }

  /**
   * Detruit la queue proprement
   */
  function destroy() {
    isDestroyed = true;
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    flush(); // Dernier envoi
    clear();
  }

  return Object.freeze({
    add,
    flush,
    getPendingEvents,
    clear,
    destroy,
    get size() { return queue.length; }
  });
}
