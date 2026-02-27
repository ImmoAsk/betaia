/**
 * Factory de creation de cartes d'annonces
 * @module rendering/cardFactory
 */

import { createElement, escapeHtml } from '../utils/dom.js';

// Placeholder SVG optimise
const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e8e8e8" width="400" height="300"/%3E%3Cpath fill="%23bbb" d="M150 100h100v100H150z"/%3E%3Ccircle cx="180" cy="130" r="15" fill="%23999"/%3E%3Cpath fill="%23999" d="M160 180l30-40 40 50H160z"/%3E%3Cpath fill="%23aaa" d="M200 165l35 35h-70l35-35z"/%3E%3C/svg%3E';
const PLACEHOLDER_SMALL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"%3E%3Crect fill="%23e8e8e8" width="150" height="150"/%3E%3Cpath fill="%23bbb" d="M50 50h50v50H50z"/%3E%3C/svg%3E';

const ICONS = {
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>',
  location: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>',
  price: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7h-1V6a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM3 16V6h14v1H6a2 2 0 0 0-2 2v7H3zm17 3H6V9h14v10z"/><path d="M13 11h-2a2 2 0 0 0 0 4h2a1 1 0 1 1 0 2H9v2h2v1h2v-1h1a3 3 0 1 0 0-6h-2a1 1 0 1 1 0-2h4V9h-3V8h-2v1z"/></svg>',
  bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11V7a2 2 0 0 1 2-2h5a3 3 0 0 1 3 3v3h3a3 3 0 0 1 3 3v4h2v2h-2v1h-2v-1H5v1H3v-1H1v-2h2v-7zm2 0h6V8a1 1 0 0 0-1-1H5v4zm8 2H5v5h14v-4a1 1 0 0 0-1-1h-5z"/></svg>',
  bath: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7V5a3 3 0 0 1 6 0h-2a1 1 0 1 0-2 0v2h7a2 2 0 0 1 2 2v4H4V9a2 2 0 0 1 2-2h1zm-1 8h12a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4zm-2-1h16v-1H4v1z"/></svg>',
  car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6.5 6h11l2.6 6.2A2 2 0 0 1 22 14v4h-1a3 3 0 0 0-6 0H9a3 3 0 0 0-6 0H2v-4c0-.7.4-1.4 1-1.8L6.5 6zM7.8 8 5.7 12h12.6l-1.7-4H7.8z"/></svg>'
};

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

function setIcon(el, svg) {
  el.innerHTML = svg;
}

function createIcon(svg, className = 'aw-icon') {
  const icon = createElement('span', { className });
  setIcon(icon, svg);
  return icon;
}

function createAmenity(iconSvg, value) {
  const item = createElement('span', { className: 'aw-card-amenity' });
  const safeValue = Number.isFinite(Number(value)) ? String(value) : '0';
  const valueEl = createElement('span', { className: 'aw-card-amenity-value' }, safeValue);
  const iconEl = createIcon(iconSvg, 'aw-card-amenity-icon');
  item.appendChild(valueEl);
  item.appendChild(iconEl);
  return item;
}

/**
 * Cree une carte d'annonce standard
 * @param {Object} ad - Donnees de l'annonce
 * @param {Function} onClick - Handler de clic
 * @returns {HTMLElement} Element carte
 */
export function createCard(ad, onClick, options = {}) {
  const { horizontal = false } = options;
  const card = createElement('article', {
    className: `aw-card ${horizontal ? 'aw-card--horizontal' : ''}`.trim(),
    'data-ad-id': ad.id,
    role: 'listitem'
  });

  const link = createElement('a', {
    className: 'aw-ad-link',
    href: ad.linkUrl || '#',
    'aria-label': `Voir l'annonce: ${ad.title}`
  });

  // Image (meme esprit que PropertyCard / CardImage)
  const imageContainer = createElement('div', { className: 'aw-card-image' });
  const img = createManagedImage(ad.imageUrl, ad.title);
  imageContainer.appendChild(img);

  if (ad.badgeLabel) {
    const badgeWrap = createElement('div', { className: 'aw-card-badges' });
    const badge = createElement('span', { className: 'aw-card-badge' }, ad.badgeLabel);
    badgeWrap.appendChild(badge);
    imageContainer.appendChild(badgeWrap);
  }

  // Corps type PropertyCard
  const body = createElement('div', { className: 'aw-card-body' });

  if (ad.category) {
    const category = createElement('div', { className: 'aw-card-category' }, ad.category);
    body.appendChild(category);
  }

  const title = createElement('h3', { className: 'aw-card-title' }, ad.title || 'Propriete');
  body.appendChild(title);

  if (ad.location) {
    const locationRow = createElement('div', { className: 'aw-card-meta-row aw-card-meta-row--location' });
    const icon = createIcon(ICONS.location, 'aw-card-meta-icon');
    const text = createElement('span', { className: 'aw-card-location' }, ad.location);
    locationRow.appendChild(icon);
    locationRow.appendChild(text);
    body.appendChild(locationRow);
  }

  const footer = createElement('div', { className: 'aw-card-footer' });

  const priceText = formatPrice(ad.price, ad.currency);
  if (priceText) {
    const priceRow = createElement('div', { className: 'aw-card-meta-row aw-card-meta-row--price' });
    const icon = createIcon(ICONS.price, 'aw-card-meta-icon');
    const price = createElement('span', { className: 'aw-card-price' }, priceText);
    priceRow.appendChild(icon);
    priceRow.appendChild(price);
    body.appendChild(priceRow);
  }

  // Toujours afficher la ligne "amenities" pour un rendu uniforme entre cartes.
  const amenities = createElement('div', { className: 'aw-card-amenities' });
  amenities.appendChild(createAmenity(ICONS.bed, ad.rooms || 0));
  amenities.appendChild(createAmenity(ICONS.bath, ad.bathrooms || 0));
  amenities.appendChild(createAmenity(ICONS.car, ad.garage || 0));
  footer.appendChild(amenities);
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
