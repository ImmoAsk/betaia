/**
 * Rendu du layout Grid
 * @module rendering/layoutGrid
 */

import { createElement } from '../utils/dom.js';
import { createCard } from './cardFactory.js';

/**
 * Calcule le nombre de colonnes selon la largeur
 * @param {number} width - Largeur disponible
 * @param {number} adCount - Nombre d'annonces
 * @returns {number} Nombre de colonnes
 */
export function calculateColumns(width, adCount) {
  if (width < 400) return 1;
  if (width < 600) return Math.min(2, adCount);
  if (width < 900) return Math.min(3, adCount);
  return Math.min(4, adCount);
}

/**
 * Cree un conteneur grid
 * @param {number} columns - Nombre de colonnes
 * @returns {HTMLElement} Conteneur grid
 */
export function createGridContainer(columns) {
  const grid = createElement('div', {
    className: 'aw-grid',
    role: 'list',
    'aria-label': 'Liste des annonces'
  });
  
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  
  return grid;
}

/**
 * Rend les annonces en mode grid
 * @param {Object[]} ads - Annonces a afficher
 * @param {number} containerWidth - Largeur du conteneur
 * @param {Function} onAdClick - Handler de clic
 * @returns {HTMLElement} Element grid complet
 */
export function renderGridLayout(ads, containerWidth, onAdClick) {
  const columns = calculateColumns(containerWidth, ads.length);
  const grid = createGridContainer(columns);
  
  ads.forEach(ad => {
    const card = createCard(ad, onAdClick);
    grid.appendChild(card);
  });
  
  return grid;
}

/**
 * Met a jour le layout grid existant
 * @param {HTMLElement} grid - Element grid
 * @param {number} containerWidth - Nouvelle largeur
 */
export function updateGridLayout(grid, containerWidth) {
  const adCount = grid.children.length;
  const columns = calculateColumns(containerWidth, adCount);
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}
