/**
 * Gestionnaire de configuration du widget
 * @module core/config
 */

import { THEMES, LAYOUTS, LIMITS, DEFAULT_CONTAINER_ID, GRID_DEFAULTS } from './constants.js';

// Valeur injectee au build depuis widget/.env (fallback null si absente)
const DEFAULT_MAX_ADS_FROM_BUILD =
  (typeof __AW_DEFAULT_MAX_ADS__ !== 'undefined') ? __AW_DEFAULT_MAX_ADS__ : null;
const DEFAULT_SLIDE_INTERVAL_FROM_BUILD =
  (typeof __AW_DEFAULT_SLIDE_INTERVAL_MS__ !== 'undefined') ? __AW_DEFAULT_SLIDE_INTERVAL_MS__ : null;
const DEFAULT_WIDGET_API_BASE_URL =
  (typeof __AW_WIDGET_API_BASE_URL__ !== 'undefined' && String(__AW_WIDGET_API_BASE_URL__).trim())
    ? String(__AW_WIDGET_API_BASE_URL__).trim()
    : null;

/**
 * Configuration par defaut du widget
 */
const defaultConfig = {
  maxAds: validateMaxAds(DEFAULT_MAX_ADS_FROM_BUILD),
  theme: THEMES.AUTO,
  layout: LAYOUTS.AUTO,
  adaptColors: true,
  containerId: DEFAULT_CONTAINER_ID,
  apiUrl: DEFAULT_WIDGET_API_BASE_URL,
  debug: false,
  width: null,
  height: null,
  orientation: 'auto',
  grid: null,
  autoSlide: true,
  slideInterval: validateSlideInterval(DEFAULT_SLIDE_INTERVAL_FROM_BUILD)
};

/**
 * Extrait la configuration depuis les attributs data du script
 * @returns {Object} Configuration extraite
 */
export function extractConfigFromScript() {
  const script = document.currentScript || 
    document.querySelector('script[data-api-url]') ||
    document.querySelector('script[src*="widget.js"]');
  
  if (!script) {
    console.warn('[AnnoncesWidget] Script tag non trouve');
    return { ...defaultConfig };
  }

  const maxAdsAttr = script.getAttribute('data-max-ads');
  const maxAds = maxAdsAttr === null ? null : parseInt(maxAdsAttr, 10);
  const theme = script.getAttribute('data-theme');
  const layout = script.getAttribute('data-layout');
  const apiUrl = script.getAttribute('data-api-url');
  const noAdaptColors = script.hasAttribute('data-no-adapt-colors');
  const debug = script.hasAttribute('data-debug');
  const width = script.getAttribute('data-width');
  const height = script.getAttribute('data-height');
  const orientation = script.getAttribute('data-orientation');
  const grid = script.getAttribute('data-grid');
  const autoSlide = !script.hasAttribute('data-no-auto-slide');
  const slideInterval = parseInt(script.getAttribute('data-slide-interval'), 10);

  return {
    maxAds: maxAdsAttr === null ? defaultConfig.maxAds : validateMaxAds(maxAds),
    theme: validateTheme(theme),
    layout: validateLayout(layout),
    apiUrl: apiUrl || null,
    adaptColors: !noAdaptColors,
    containerId: DEFAULT_CONTAINER_ID,
    debug,
    width: width ? parseDimension(width) : null,
    height: height ? parseDimension(height) : null,
    orientation: validateOrientation(orientation),
    grid: parseGrid(grid),
    autoSlide,
    slideInterval: isNaN(slideInterval) ? defaultConfig.slideInterval : validateSlideInterval(slideInterval)
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

function validateSlideInterval(value) {
  if (isNaN(value)) return GRID_DEFAULTS.ROTATION_INTERVAL;
  return Math.min(Math.max(parseInt(value, 10), 1000), 120000);
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

/**
 * Parse la configuration de grille (format: "rows,cols")
 * @param {string} value - ex: "1,3" ou "3,1" ou "1,1"
 * @returns {Object|null} {rows, cols} ou null
 */
function parseGrid(value) {
  if (!value) return null;
  const parts = value.split(',').map(v => parseInt(v.trim(), 10));
  if (parts.length !== 2 || parts.some(isNaN)) return null;
  const rows = Math.max(GRID_DEFAULTS.MIN_ROWS, Math.min(parts[0], GRID_DEFAULTS.MAX_ROWS));
  const cols = Math.max(GRID_DEFAULTS.MIN_COLS, Math.min(parts[1], GRID_DEFAULTS.MAX_COLS));
  return { rows, cols };
}
