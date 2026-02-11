/**
 * Gestionnaire de rendu principal
 * Design compact type publicite
 * @module rendering/renderer
 */

import { LAYOUTS } from '../core/constants.js';
import { generateBaseStyles, generateGridStyles, generateListStyles, generateAdaptiveStyles } from './styles.js';
import { generateCardStyles, generateListCardStyles } from './cardStyles.js';
import { generateSkeletonStyles, createSkeletonCardHTML } from './skeletonStyles.js';
import { renderGridLayout, updateGridLayout, calculateColumns } from './layoutGrid.js';
import { renderListLayout } from './layoutList.js';
import { createGridSlider, generateGridSliderStyles } from './gridSlider.js';
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
  let activeSlider = null;

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
      generateSkeletonStyles(),
      generateGridSliderStyles()
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
    const brand = createElement('span', { className: 'aw-header-brand' }, 'ImmoAsk');
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
    destroySlider();
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
    destroySlider();
    contentContainer.innerHTML = '';
    const error = createElement('div', { 
      className: 'aw-error',
      role: 'alert'
    }, message);
    contentContainer.appendChild(error);
  }

  /**
   * Rend les annonces avec grille-slider
   * @param {Object[]} ads - Toutes les annonces (pool complet)
   * @param {Object} gridConfig - Configuration de grille {rows, cols}
   * @param {Function} onAdClick - Handler de clic
   * @param {Object} sliderOptions - Options du slider
   */
  function renderWithGrid(ads, gridConfig, onAdClick, sliderOptions = {}) {
    destroySlider();
    contentContainer.innerHTML = '';
    contentContainer.appendChild(createHeader());

    if (ads.length === 0) {
      showError('Aucune annonce disponible');
      return;
    }

    const slider = createGridSlider({
      allAds: ads,
      rows: gridConfig.rows,
      cols: gridConfig.cols,
      onAdClick,
      interval: sliderOptions.interval || 5000,
      autoSlide: sliderOptions.autoSlide !== false
    });

    contentContainer.appendChild(slider.element);
    activeSlider = slider;

    if (sliderOptions.autoSlide !== false) {
      slider.startAutoPlay();
    }
  }

  /**
   * Rend les annonces (mode classique)
   * @param {Object[]} ads - Annonces a afficher
   * @param {string} layout - Layout a utiliser
   * @param {number} containerWidth - Largeur du conteneur
   * @param {Function} onAdClick - Handler de clic
   */
  function render(ads, layout, containerWidth, onAdClick) {
    destroySlider();
    contentContainer.innerHTML = '';
    currentLayout = layout;

    if (ads.length === 0) {
      showError('Aucune annonce disponible');
      return;
    }

    contentContainer.appendChild(createHeader());

    let content;
    switch (layout) {
      case LAYOUTS.LIST:
        content = renderListLayout(ads, onAdClick);
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
   * Detruit le slider actif
   */
  function destroySlider() {
    if (activeSlider) {
      activeSlider.destroy();
      activeSlider = null;
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
    renderWithGrid,
    updateResponsive,
    updateTheme,
    destroySlider,
    get container() { return contentContainer; },
    get slider() { return activeSlider; }
  });
}
