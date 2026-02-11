/**
 * Factory de creation de cartes d'annonces
 * @module rendering/cardFactory
 */

import { createElement, escapeHtml } from '../utils/dom.js';

// Placeholder SVG optimise
const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e8e8e8" width="400" height="300"/%3E%3Cpath fill="%23bbb" d="M150 100h100v100H150z"/%3E%3Ccircle cx="180" cy="130" r="15" fill="%23999"/%3E%3Cpath fill="%23999" d="M160 180l30-40 40 50H160z"/%3E%3Cpath fill="%23aaa" d="M200 165l35 35h-70l35-35z"/%3E%3C/svg%3E';
const PLACEHOLDER_SMALL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"%3E%3Crect fill="%23e8e8e8" width="150" height="150"/%3E%3Cpath fill="%23bbb" d="M50 50h50v50H50z"/%3E%3C/svg%3E';

/**
 * Formate un prix pour affichage
 * @param {number} price - Prix
 * @param {string} currency - Devise
 * @returns {string} Prix formate
 */
function formatPrice(price, currency = 'EUR') {
  if (price === null || price === undefined || price === 0) return '';
  
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  } catch (e) {
    return `${price.toLocaleString('fr-FR')} ${currency}`;
  }
}

/**
 * Cree une image avec gestion du chargement
 * @param {string} src - URL de l'image
 * @param {string} alt - Texte alternatif
 * @param {string} placeholder - URL du placeholder
 * @returns {HTMLImageElement} Element image
 */
function createManagedImage(src, alt, placeholder = PLACEHOLDER_SVG) {
  const img = createElement('img', {
    alt: alt || '',
    loading: 'lazy',
    decoding: 'async'
  });
  
  img.className = 'loading';
  
  // Gestion du chargement
  img.onload = () => {
    img.className = 'loaded';
  };
  
  img.onerror = () => {
    img.className = 'error';
    img.src = placeholder;
  };
  
  // Definit la source (ou placeholder si vide)
  img.src = src && src.trim() ? src : placeholder;
  
  return img;
}

/**
 * Cree une carte d'annonce standard
 * @param {Object} ad - Donnees de l'annonce
 * @param {Function} onClick - Handler de clic
 * @returns {HTMLElement} Element carte
 */
export function createCard(ad, onClick) {
  const card = createElement('article', {
    className: 'aw-card',
    'data-ad-id': ad.id,
    role: 'listitem'
  });

  const link = createElement('a', {
    className: 'aw-ad-link',
    href: ad.linkUrl || '#',
    'aria-label': `Voir l'annonce: ${ad.title}`
  });

  // Image avec gestion du chargement
  const imageContainer = createElement('div', { className: 'aw-card-image' });
  const img = createManagedImage(ad.imageUrl, ad.title);
  imageContainer.appendChild(img);

  // Corps
  const body = createElement('div', { className: 'aw-card-body' });
  
  const title = createElement('h3', { className: 'aw-card-title' }, ad.title || 'Propriete');
  body.appendChild(title);

  if (ad.description) {
    const desc = createElement('p', { className: 'aw-card-description' }, ad.description);
    body.appendChild(desc);
  }

  // Footer
  const footer = createElement('div', { className: 'aw-card-footer' });
  
  const priceText = formatPrice(ad.price, ad.currency);
  if (priceText) {
    const price = createElement('span', { className: 'aw-card-price' }, priceText);
    footer.appendChild(price);
  }

  if (ad.location) {
    const location = createElement('span', { className: 'aw-card-location' }, ad.location);
    footer.appendChild(location);
  }

  body.appendChild(footer);
  link.appendChild(imageContainer);
  link.appendChild(body);
  card.appendChild(link);

  // Handler de clic
  link.addEventListener('click', (e) => {
    e.preventDefault();
    onClick?.(ad, e);
  });

  return card;
}

/**
 * Cree une carte en mode liste
 * @param {Object} ad - Donnees de l'annonce
 * @param {Function} onClick - Handler de clic
 * @returns {HTMLElement} Element carte liste
 */
export function createListCard(ad, onClick) {
  const card = createElement('article', {
    className: 'aw-list-card',
    'data-ad-id': ad.id,
    role: 'listitem'
  });

  const link = createElement('a', {
    className: 'aw-ad-link',
    href: ad.linkUrl || '#',
    style: { display: 'flex', width: '100%' },
    'aria-label': `Voir l'annonce: ${ad.title}`
  });

  // Image avec gestion du chargement
  const imageContainer = createElement('div', { className: 'aw-list-card-image' });
  const img = createManagedImage(ad.imageUrl, ad.title, PLACEHOLDER_SMALL);
  imageContainer.appendChild(img);

  // Contenu
  const content = createElement('div', { className: 'aw-list-card-content' });
  const title = createElement('h3', { className: 'aw-list-card-title' }, ad.title || 'Propriete');
  content.appendChild(title);

  const priceText = formatPrice(ad.price, ad.currency);
  if (priceText) {
    const price = createElement('span', { className: 'aw-list-card-price' }, priceText);
    content.appendChild(price);
  }

  link.appendChild(imageContainer);
  link.appendChild(content);
  card.appendChild(link);

  link.addEventListener('click', (e) => {
    e.preventDefault();
    onClick?.(ad, e);
  });

  return card;
}
