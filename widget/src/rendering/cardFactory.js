/**
 * Factory de creation de cartes d'annonces
 * @module rendering/cardFactory
 */

import { createElement, escapeHtml } from '../utils/dom.js';

/**
 * Formate un prix pour affichage
 * @param {number} price - Prix
 * @param {string} currency - Devise
 * @returns {string} Prix formate
 */
function formatPrice(price, currency = 'EUR') {
  if (price === null || price === undefined) return '';
  
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  } catch (e) {
    return `${price} ${currency}`;
  }
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

  // Image avec placeholder et gestion erreur
  const imageContainer = createElement('div', { className: 'aw-card-image' });
  const img = createElement('img', {
    alt: ad.title,
    loading: 'lazy'
  });
  
  // Placeholder SVG en base64 si pas d'image ou erreur
  const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EImage non disponible%3C/text%3E%3C/svg%3E';
  
  img.onerror = () => { img.src = placeholderSvg; };
  img.src = ad.imageUrl || placeholderSvg;
  imageContainer.appendChild(img);

  // Corps
  const body = createElement('div', { className: 'aw-card-body' });
  
  const title = createElement('h3', { className: 'aw-card-title' }, ad.title);
  body.appendChild(title);

  if (ad.description) {
    const desc = createElement('p', { className: 'aw-card-description' }, ad.description);
    body.appendChild(desc);
  }

  // Footer
  const footer = createElement('div', { className: 'aw-card-footer' });
  
  if (ad.price !== null) {
    const price = createElement('span', { className: 'aw-card-price' }, 
      formatPrice(ad.price, ad.currency));
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

  // Image avec placeholder
  const imageContainer = createElement('div', { className: 'aw-list-card-image' });
  const img = createElement('img', { alt: ad.title, loading: 'lazy' });
  const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"%3E%3Crect fill="%23e0e0e0" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23999"%3ENo img%3C/text%3E%3C/svg%3E';
  img.onerror = () => { img.src = placeholderSvg; };
  img.src = ad.imageUrl || placeholderSvg;
  imageContainer.appendChild(img);

  // Contenu
  const content = createElement('div', { className: 'aw-list-card-content' });
  const title = createElement('h3', { className: 'aw-list-card-title' }, ad.title);
  content.appendChild(title);

  if (ad.price !== null) {
    const price = createElement('span', { className: 'aw-list-card-price' },
      formatPrice(ad.price, ad.currency));
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
