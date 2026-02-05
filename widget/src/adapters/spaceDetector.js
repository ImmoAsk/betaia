/**
 * Detecteur de dimensions et espace disponible
 * @module adapters/spaceDetector
 */

import { BREAKPOINTS, ADS_PER_BREAKPOINT, LAYOUTS } from '../core/constants.js';
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
    width: Math.floor(rect.width),
    height: Math.floor(rect.height)
  };
}

/**
 * Determine le nombre optimal d'annonces selon la largeur
 * @param {number} width - Largeur en pixels
 * @param {number|null} maxAds - Limite configuree
 * @returns {number} Nombre d'annonces
 */
export function calculateOptimalAdCount(width, maxAds = null) {
  let count;
  
  if (width < BREAKPOINTS.XS) {
    count = ADS_PER_BREAKPOINT.XS;
  } else if (width < BREAKPOINTS.SM) {
    count = ADS_PER_BREAKPOINT.SM;
  } else if (width < BREAKPOINTS.MD) {
    count = ADS_PER_BREAKPOINT.MD;
  } else {
    count = ADS_PER_BREAKPOINT.LG;
  }
  
  // Applique la limite configuree si presente
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
 * @returns {string} Layout optimal
 */
export function calculateOptimalLayout(width, height, configLayout) {
  // Si un layout specifique est configure, l'utiliser
  if (configLayout && configLayout !== LAYOUTS.AUTO) {
    return configLayout;
  }
  
  // Layout automatique selon les dimensions
  if (width < BREAKPOINTS.XS) {
    return LAYOUTS.LIST;
  }
  
  if (width < BREAKPOINTS.SM) {
    return LAYOUTS.CARD;
  }
  
  if (width < BREAKPOINTS.MD) {
    return height > 400 ? LAYOUTS.GRID : LAYOUTS.CAROUSEL;
  }
  
  // Grande largeur
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
