/**
 * Rendu du layout Liste
 * @module rendering/layoutList
 */

import { createElement } from '../utils/dom.js';
import { createListCard } from './cardFactory.js';

/**
 * Cree un conteneur liste
 * @returns {HTMLElement} Conteneur liste
 */
export function createListContainer() {
  return createElement('div', {
    className: 'aw-list',
    role: 'list',
    'aria-label': 'Liste des annonces'
  });
}

/**
 * Rend les annonces en mode liste
 * @param {Object[]} ads - Annonces a afficher
 * @param {Function} onAdClick - Handler de clic
 * @returns {HTMLElement} Element liste complet
 */
export function renderListLayout(ads, onAdClick) {
  const list = createListContainer();
  
  ads.forEach(ad => {
    const card = createListCard(ad, onAdClick);
    list.appendChild(card);
  });
  
  return list;
}

/**
 * Ajoute une annonce a la liste
 * @param {HTMLElement} list - Element liste
 * @param {Object} ad - Annonce a ajouter
 * @param {Function} onAdClick - Handler de clic
 * @param {string} position - Position ('start' ou 'end')
 */
export function appendToList(list, ad, onAdClick, position = 'end') {
  const card = createListCard(ad, onAdClick);
  
  if (position === 'start' && list.firstChild) {
    list.insertBefore(card, list.firstChild);
  } else {
    list.appendChild(card);
  }
}

/**
 * Supprime une annonce de la liste
 * @param {HTMLElement} list - Element liste
 * @param {string} adId - ID de l'annonce a supprimer
 */
export function removeFromList(list, adId) {
  const card = list.querySelector(`[data-ad-id="${adId}"]`);
  if (card) {
    card.remove();
  }
}
