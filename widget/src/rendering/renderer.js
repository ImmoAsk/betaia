/**
 * Gestionnaire de rendu principal
 * Design compact type publicite
 * @module rendering/renderer
 */

import { LAYOUTS } from '../core/constants.js';
import { generateBaseStyles, generateGridStyles, generateListStyles, generateAdaptiveStyles } from './styles.js';
import { generateCardStyles, generateListCardStyles } from './cardStyles.js';
import { generateCarouselStyles } from './carouselStyles.js';
import { generateSkeletonStyles, createSkeletonCardHTML } from './skeletonStyles.js';
import { renderGridLayout, updateGridLayout, calculateColumns } from './layoutGrid.js';
import { renderListLayout } from './layoutList.js';
import { renderCarouselLayout } from './layoutCarousel.js';
import { createElement } from '../utils/dom.js';

/**
 * Cree le renderer principal
 * @param {ShadowRoot} shadowRoot - Shadow root du widget
 * @param {string} theme - Theme actif
 * @param {Object} siteColors - Couleurs du site hote (optionnel)
 * @returns {Object} Renderer avec methodes
 */
export function createRenderer(shadowRoot, theme, siteColors = null) {
  let currentLayout = null;
  let contentContainer = null;

  /**
   * Initialise les styles dans le shadow DOM
   */
  function initStyles() {
    const style = createElement('style');
    const styles = [
      generateBaseStyles(theme),
      generateCardStyles(),
      generateListCardStyles(),
      generateGridStyles(4),
      generateListStyles(),
      generateCarouselStyles(),
      generateSkeletonStyles()
    ];
    
    if (siteColors) {
      styles.push(generateAdaptiveStyles(siteColors));
    }
    
    style.textContent = styles.join('\n');
    shadowRoot.appendChild(style);
    
    contentContainer = createElement('div', { className: 'aw-container' });
    
    if (siteColors) {
      shadowRoot.host.classList.add('aw-adaptive');
    }
    
    shadowRoot.appendChild(contentContainer);
  }

  /**
   * Cree l'en-tete discret du widget
   */
  function createHeader() {
    const header = createElement('div', { className: 'aw-header' });
    const label = createElement('span', { className: 'aw-header-label' }, 'Annonces');
    const brand = createElement('span', { className: 'aw-header-brand' }, 'betaia');
    header.appendChild(label);
    header.appendChild(brand);
    return header;
  }

  /**
   * Affiche l'etat de chargement
   * @param {number} count - Nombre de skeletons
   * @param {string} layout - Layout a utiliser
   */
  function showLoading(count, layout) {
    contentContainer.innerHTML = '';
    contentContainer.appendChild(createHeader());
    
    const wrapper = createElement('div', { 
      className: layout === LAYOUTS.LIST ? 'aw-list' : 'aw-grid' 
    });
    
    const safeCount = Math.min(count, 4);
    for (let i = 0; i < safeCount; i++) {
      const skeleton = createElement('div');
      skeleton.innerHTML = createSkeletonCardHTML();
      wrapper.appendChild(skeleton.firstChild);
    }
    
    contentContainer.appendChild(wrapper);
  }

  /**
   * Affiche un message d'erreur
   * @param {string} message - Message d'erreur
   */
  function showError(message) {
    contentContainer.innerHTML = '';
    const error = createElement('div', { 
      className: 'aw-error',
      role: 'alert'
    }, message);
    contentContainer.appendChild(error);
  }

  /**
   * Rend les annonces
   * @param {Object[]} ads - Annonces a afficher
   * @param {string} layout - Layout a utiliser
   * @param {number} containerWidth - Largeur du conteneur
   * @param {Function} onAdClick - Handler de clic
   */
  function render(ads, layout, containerWidth, onAdClick) {
    contentContainer.innerHTML = '';
    currentLayout = layout;

    if (ads.length === 0) {
      showError('Aucune annonce disponible');
      return;
    }

    // En-tete discret
    contentContainer.appendChild(createHeader());

    let content;
    switch (layout) {
      case LAYOUTS.LIST:
        content = renderListLayout(ads, onAdClick);
        break;
      case LAYOUTS.CAROUSEL:
        content = renderCarouselLayout(ads, onAdClick);
        break;
      case LAYOUTS.GRID:
      case LAYOUTS.CARD:
      default:
        content = renderGridLayout(ads, containerWidth, onAdClick);
        break;
    }

    contentContainer.appendChild(content);
  }

  /**
   * Met a jour le layout responsive
   * @param {number} containerWidth - Nouvelle largeur
   */
  function updateResponsive(containerWidth) {
    if (currentLayout === LAYOUTS.GRID) {
      const grid = contentContainer.querySelector('.aw-grid');
      if (grid) updateGridLayout(grid, containerWidth);
    }
  }

  /**
   * Met a jour le theme
   * @param {string} newTheme - Nouveau theme
   */
  function updateTheme(newTheme) {
    const style = shadowRoot.querySelector('style');
    if (style) {
      style.textContent = style.textContent.replace(
        /(:host\s*\{[^}]*)/,
        generateBaseStyles(newTheme).match(/(:host\s*\{[^}]*)/)[1]
      );
    }
  }

  return Object.freeze({
    initStyles,
    showLoading,
    showError,
    render,
    updateResponsive,
    updateTheme,
    get container() { return contentContainer; }
  });
}
