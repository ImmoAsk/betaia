/**
 * Detecteur de dimensions et espace disponible
 * @module adapters/spaceDetector
 */

import { BREAKPOINTS, ADS_PER_BREAKPOINT, LAYOUTS, CARD_SIZES } from '../core/constants.js';
import { debounce } from '../utils/timing.js';

/**
 * Mesure les dimensions d'un conteneur
 * @param {HTMLElement} container - Element conteneur
 * @returns {Object} {width, height}
 */
export function measureContainer(container) {
  if (!container) {
    return { width: 0, height: 0 };
  }
  
  const rect = container.getBoundingClientRect();
  return {
    width: Math.floor(rect.width) || container.offsetWidth || 300,
    height: Math.floor(rect.height) || container.offsetHeight || 0
  };
}

/**
 * Calcule dynamiquement le nombre d'annonces selon l'espace
 * @param {number} width - Largeur en pixels
 * @param {number} height - Hauteur en pixels
 * @param {string} orientation - horizontal/vertical/auto
 * @param {number|null} maxAds - Limite configuree
 * @returns {number} Nombre d'annonces
 */
export function calculateOptimalAdCount(width, maxAds = null, height = 0, orientation = 'auto') {
  const gap = 8;
  let count;
  
  const isVertical = orientation === 'vertical' || 
    (orientation === 'auto' && height > 0 && height > width * 1.5);
  
  if (isVertical && height > 0) {
    // En vertical : combien de mini cartes tiennent en hauteur
    const cardH = CARD_SIZES.MINI_HEIGHT + gap;
    count = Math.max(1, Math.floor(height / cardH));
  } else {
    // En horizontal : combien de mini cartes tiennent en largeur
    const cardW = CARD_SIZES.MINI_WIDTH + gap;
    count = Math.max(1, Math.floor(width / cardW));
  }
  
  // Plafonner a un maximum raisonnable
  count = Math.min(count, 6);
  
  if (maxAds !== null && maxAds > 0) {
    count = Math.min(count, maxAds);
  }
  
  return count;
}

/**
 * Determine le layout optimal selon les dimensions
 * @param {number} width - Largeur en pixels
 * @param {number} height - Hauteur en pixels
 * @param {string} configLayout - Layout configure
 * @param {string} orientation - Orientation configuree
 * @returns {string} Layout optimal
 */
export function calculateOptimalLayout(width, height, configLayout, orientation = 'auto') {
  if (configLayout && configLayout !== LAYOUTS.AUTO) {
    return configLayout;
  }
  
  const isVertical = orientation === 'vertical' || 
    (orientation === 'auto' && height > 0 && height > width * 1.5);
  
  if (isVertical) {
    return LAYOUTS.LIST;
  }
  
  if (width < BREAKPOINTS.XS) {
    return LAYOUTS.LIST;
  }
  
  if (width < BREAKPOINTS.SM) {
    return LAYOUTS.LIST;
  }
  
  return LAYOUTS.GRID;
}

/**
 * Cree un observateur de redimensionnement
 * @param {HTMLElement} element - Element a observer
 * @param {Function} callback - Callback (width, height) => void
 * @returns {Function} Fonction de cleanup
 */
export function createResizeObserver(element, callback) {
  const debouncedCallback = debounce((entries) => {
    const entry = entries[0];
    if (entry) {
      const { width, height } = entry.contentRect;
      callback(Math.floor(width), Math.floor(height));
    }
  }, 150);

  const observer = new ResizeObserver(debouncedCallback);
  observer.observe(element);

  return () => {
    debouncedCallback.cancel();
    observer.disconnect();
  };
}
