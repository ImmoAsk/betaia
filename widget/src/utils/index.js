/**
 * Index des exports du module utils
 * @module utils
 */

export { escapeHtml, createElement, requestFrame, cancelFrame } from './dom.js';
export { debounce, throttle, delay, withTimeout } from './timing.js';
export { getItem, setItem, removeItem, cacheAd, getCachedAd } from './storage.js';
export { generateUUID, generateShortId, simpleHash } from './uuid.js';
