/**
 * Index des exports du module core
 * @module core
 */

export { VERSION, NAMESPACE, BREAKPOINTS, LAYOUTS, THEMES, TIMING, LIMITS, COOKIES, STORAGE_KEYS } from './constants.js';
export { extractConfigFromScript, createConfig } from './config.js';
export { createStore, getStore } from './state.js';
