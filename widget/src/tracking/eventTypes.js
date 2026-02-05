/**
 * Types d'evenements de tracking
 * @module tracking/eventTypes
 */

/**
 * Enumeration des types d'evenements
 */
export const EventTypes = {
  // Evenements d'affichage
  IMPRESSION: 'impression',
  VIEW_DURATION: 'view_duration',
  
  // Evenements d'interaction
  CLICK: 'click',
  HOVER: 'hover',
  SCROLL_DEPTH: 'scroll_depth',
  
  // Evenements de comportement
  ENGAGEMENT_SCORE: 'engagement_score',
  BOUNCE: 'bounce',
  ROTATION: 'rotation',
  
  // Evenements systeme
  WIDGET_LOAD: 'widget_load',
  WIDGET_ERROR: 'widget_error',
  API_ERROR: 'api_error'
};

/**
 * Niveaux de priorite des evenements
 */
export const EventPriority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
};

/**
 * Map des priorites par type d'evenement
 */
export const EventPriorityMap = {
  [EventTypes.IMPRESSION]: EventPriority.MEDIUM,
  [EventTypes.VIEW_DURATION]: EventPriority.LOW,
  [EventTypes.CLICK]: EventPriority.CRITICAL,
  [EventTypes.HOVER]: EventPriority.LOW,
  [EventTypes.SCROLL_DEPTH]: EventPriority.LOW,
  [EventTypes.ENGAGEMENT_SCORE]: EventPriority.MEDIUM,
  [EventTypes.BOUNCE]: EventPriority.MEDIUM,
  [EventTypes.ROTATION]: EventPriority.LOW,
  [EventTypes.WIDGET_LOAD]: EventPriority.HIGH,
  [EventTypes.WIDGET_ERROR]: EventPriority.HIGH,
  [EventTypes.API_ERROR]: EventPriority.HIGH
};

/**
 * Verifie si un evenement est critique
 * @param {string} eventType - Type d'evenement
 * @returns {boolean} True si critique
 */
export function isCriticalEvent(eventType) {
  return EventPriorityMap[eventType] === EventPriority.CRITICAL;
}

/**
 * Verifie si un evenement est haute priorite
 * @param {string} eventType - Type d'evenement
 * @returns {boolean} True si haute priorite ou plus
 */
export function isHighPriorityEvent(eventType) {
  const priority = EventPriorityMap[eventType];
  return priority >= EventPriority.HIGH;
}
