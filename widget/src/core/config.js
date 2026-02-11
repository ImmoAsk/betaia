/**
 * Gestionnaire de configuration du widget
 * @module core/config
 */

import { THEMES, LAYOUTS, LIMITS, DEFAULT_CONTAINER_ID } from './constants.js';

/**
 * Configuration par defaut du widget
 */
const defaultConfig = {
  clientId: null,
  maxAds: null,
  theme: THEMES.AUTO,
  layout: LAYOUTS.AUTO,
  noTracking: false,
  adaptColors: true,
  containerId: DEFAULT_CONTAINER_ID,
  apiUrl: null,
  debug: false,
  width: null,
  height: null,
  orientation: 'auto'
};

/**
 * Extrait la configuration depuis les attributs data du script
 * @returns {Object} Configuration extraite
 */
export function extractConfigFromScript() {
  const script = document.currentScript || 
    document.querySelector('script[data-id]');
  
  if (!script) {
    console.warn('[AnnoncesWidget] Script tag non trouve');
    return { ...defaultConfig };
  }

  const clientId = script.getAttribute('data-id');
  const maxAds = parseInt(script.getAttribute('data-max-ads'), 10);
  const theme = script.getAttribute('data-theme');
  const layout = script.getAttribute('data-layout');
  const apiUrl = script.getAttribute('data-api-url');
  const noTracking = script.hasAttribute('data-no-tracking');
  const noAdaptColors = script.hasAttribute('data-no-adapt-colors');
  const debug = script.hasAttribute('data-debug');
  const width = script.getAttribute('data-width');
  const height = script.getAttribute('data-height');
  const orientation = script.getAttribute('data-orientation');

  return {
    clientId: clientId || null,
    maxAds: validateMaxAds(maxAds),
    theme: validateTheme(theme),
    layout: validateLayout(layout),
    apiUrl: apiUrl || null,
    noTracking,
    adaptColors: !noAdaptColors,
    containerId: DEFAULT_CONTAINER_ID,
    debug,
    width: width ? parseDimension(width) : null,
    height: height ? parseDimension(height) : null,
    orientation: validateOrientation(orientation)
  };
}

/**
 * Valide le nombre maximum d'annonces
 * @param {number} value - Valeur a valider
 * @returns {number|null} Valeur validee ou null
 */
function validateMaxAds(value) {
  if (isNaN(value)) return null;
  return Math.min(Math.max(value, LIMITS.MIN_ADS), LIMITS.MAX_ADS);
}

/**
 * Valide le theme
 * @param {string} value - Valeur a valider
 * @returns {string} Theme valide
 */
function validateTheme(value) {
  const valid = Object.values(THEMES);
  return valid.includes(value) ? value : THEMES.AUTO;
}

/**
 * Valide le layout
 * @param {string} value - Valeur a valider
 * @returns {string} Layout valide
 */
function validateLayout(value) {
  const valid = Object.values(LAYOUTS);
  return valid.includes(value) ? value : LAYOUTS.AUTO;
}

/**
 * Cree une configuration complete en fusionnant les defauts
 * @param {Object} overrides - Surcharges de configuration
 * @returns {Object} Configuration complete
 */
export function createConfig(overrides = {}) {
  return Object.freeze({ ...defaultConfig, ...overrides });
}

/**
 * Parse une dimension (px, %, ou nombre)
 * @param {string} value - Valeur a parser
 * @returns {string} Dimension CSS valide
 */
function parseDimension(value) {
  if (!value) return null;
  const num = parseInt(value, 10);
  if (isNaN(num)) return value;
  // Si c'est un nombre seul, ajouter px
  if (/^\d+$/.test(value.trim())) return `${num}px`;
  return value;
}

/**
 * Valide l'orientation
 * @param {string} value - Valeur a valider
 * @returns {string} Orientation valide
 */
function validateOrientation(value) {
  const valid = ['horizontal', 'vertical', 'auto'];
  return valid.includes(value) ? value : 'auto';
}
