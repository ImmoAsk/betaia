/**
 * Factory pour creer des evenements de tracking
 * @module tracking/eventFactory
 */

import { EventTypes } from './eventTypes.js';
import { generateShortId } from '../utils/uuid.js';

/**
 * Cree un evenement de base
 * @param {string} type - Type d'evenement
 * @param {Object} data - Donnees de l'evenement
 * @returns {Object} Evenement formate
 */
function createBaseEvent(type, data = {}) {
  return {
    id: generateShortId(12),
    type,
    ts: Date.now(),
    ...data
  };
}

/**
 * Cree un evenement d'impression
 * @param {string} adId - ID de l'annonce
 * @param {number} visibilityRatio - Ratio de visibilite (0-1)
 * @returns {Object} Evenement d'impression
 */
export function createImpressionEvent(adId, visibilityRatio) {
  return createBaseEvent(EventTypes.IMPRESSION, {
    aid: adId,
    vr: Math.round(visibilityRatio * 100) / 100
  });
}

/**
 * Cree un evenement de duree de vue
 * @param {string} adId - ID de l'annonce
 * @param {number} duration - Duree en ms
 * @returns {Object} Evenement de duree
 */
export function createViewDurationEvent(adId, duration) {
  return createBaseEvent(EventTypes.VIEW_DURATION, {
    aid: adId,
    dur: Math.round(duration)
  });
}

/**
 * Cree un evenement de clic
 * @param {string} adId - ID de l'annonce
 * @param {Object} position - Position {x, y}
 * @returns {Object} Evenement de clic
 */
export function createClickEvent(adId, position) {
  return createBaseEvent(EventTypes.CLICK, {
    aid: adId,
    pos: { x: Math.round(position.x), y: Math.round(position.y) }
  });
}

/**
 * Cree un evenement de survol
 * @param {string} adId - ID de l'annonce
 * @param {number} duration - Duree du survol en ms
 * @returns {Object} Evenement de survol
 */
export function createHoverEvent(adId, duration) {
  return createBaseEvent(EventTypes.HOVER, {
    aid: adId,
    dur: Math.round(duration)
  });
}

/**
 * Cree un evenement de profondeur de scroll
 * @param {string} adId - ID de l'annonce
 * @param {number} depth - Profondeur (0-1)
 * @returns {Object} Evenement de scroll
 */
export function createScrollDepthEvent(adId, depth) {
  return createBaseEvent(EventTypes.SCROLL_DEPTH, {
    aid: adId,
    depth: Math.round(depth * 100) / 100
  });
}

/**
 * Cree un evenement de score d'engagement
 * @param {string} adId - ID de l'annonce
 * @param {number} score - Score calcule
 * @returns {Object} Evenement d'engagement
 */
export function createEngagementScoreEvent(adId, score) {
  return createBaseEvent(EventTypes.ENGAGEMENT_SCORE, {
    aid: adId,
    score: Math.round(score * 100) / 100
  });
}

/**
 * Cree un evenement de rotation
 * @param {string} fromAdId - ID annonce precedente
 * @param {string} toAdId - ID nouvelle annonce
 * @param {string} reason - Raison de la rotation
 * @returns {Object} Evenement de rotation
 */
export function createRotationEvent(fromAdId, toAdId, reason) {
  return createBaseEvent(EventTypes.ROTATION, {
    from: fromAdId,
    to: toAdId,
    reason
  });
}
