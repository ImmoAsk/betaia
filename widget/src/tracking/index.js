/**
 * Index des exports du module tracking
 * @module tracking
 */

export { EventTypes, EventPriority, EventPriorityMap, isCriticalEvent, isHighPriorityEvent } from './eventTypes.js';
export * from './eventFactory.js';
export { createEventQueue } from './eventQueue.js';
export { createEventSender } from './eventSender.js';
export { getSessionId, generateFingerprint, collectSessionContext } from './contextCollector.js';
export { createVisibilityObserver } from './visibilityObserver.js';
export { createInteractionObserver } from './interactionObserver.js';
export { createTrackingService } from './trackingService.js';
