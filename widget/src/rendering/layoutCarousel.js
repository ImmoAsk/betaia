/**
 * Rendu du layout Carousel
 * @module rendering/layoutCarousel
 */

import { createElement } from '../utils/dom.js';
import { createCard } from './cardFactory.js';

// Icones SVG pour navigation
const PREV_ICON = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
const NEXT_ICON = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

/**
 * Cree le conteneur du carousel
 * @returns {Object} Elements du carousel
 */
export function createCarouselContainer() {
  const carousel = createElement('div', {
    className: 'aw-carousel',
    role: 'region',
    'aria-label': 'Carousel d\'annonces'
  });

  const track = createElement('div', {
    className: 'aw-carousel-track',
    role: 'list'
  });

  const prevBtn = createElement('button', {
    className: 'aw-carousel-btn aw-carousel-btn--prev',
    'aria-label': 'Annonce precedente',
    type: 'button'
  });
  prevBtn.innerHTML = PREV_ICON;

  const nextBtn = createElement('button', {
    className: 'aw-carousel-btn aw-carousel-btn--next',
    'aria-label': 'Annonce suivante',
    type: 'button'
  });
  nextBtn.innerHTML = NEXT_ICON;

  const dots = createElement('div', {
    className: 'aw-carousel-dots',
    role: 'tablist',
    'aria-label': 'Navigation du carousel'
  });

  carousel.appendChild(track);
  carousel.appendChild(prevBtn);
  carousel.appendChild(nextBtn);
  carousel.appendChild(dots);

  return { carousel, track, prevBtn, nextBtn, dots };
}

/**
 * Cree les points de navigation
 * @param {number} count - Nombre de slides
 * @param {number} current - Index actuel
 * @param {Function} onDotClick - Handler de clic
 * @returns {HTMLElement[]} Elements dots
 */
export function createDots(count, current, onDotClick) {
  const dots = [];
  
  for (let i = 0; i < count; i++) {
    const dot = createElement('button', {
      className: `aw-carousel-dot ${i === current ? 'aw-carousel-dot--active' : ''}`,
      'aria-label': `Aller a l'annonce ${i + 1}`,
      'aria-selected': i === current ? 'true' : 'false',
      role: 'tab',
      type: 'button'
    });
    
    dot.addEventListener('click', () => onDotClick(i));
    dots.push(dot);
  }
  
  return dots;
}

/**
 * Cree un slide du carousel
 * @param {Object} ad - Annonce
 * @param {Function} onAdClick - Handler de clic
 * @returns {HTMLElement} Element slide
 */
export function createCarouselSlide(ad, onAdClick) {
  const slide = createElement('div', {
    className: 'aw-carousel-slide',
    role: 'listitem'
  });
  
  const card = createCard(ad, onAdClick);
  slide.appendChild(card);
  
  return slide;
}

/**
 * Rend les annonces en mode carousel
 * @param {Object[]} ads - Annonces a afficher
 * @param {Function} onAdClick - Handler de clic
 * @returns {HTMLElement} Element carousel complet
 */
export function renderCarouselLayout(ads, onAdClick) {
  const { carousel, track, prevBtn, nextBtn, dots } = createCarouselContainer();
  
  // Cree les slides
  ads.forEach(ad => {
    const slide = createCarouselSlide(ad, onAdClick);
    track.appendChild(slide);
  });
  
  // Variables d'etat
  let currentIndex = 0;
  let isAnimating = false;
  
  /**
   * Met a jour la position du carousel
   */
  function updatePosition(animate = true) {
    if (isAnimating && animate) return;
    
    isAnimating = true;
    const translateX = -currentIndex * 100;
    
    track.style.transition = animate ? 'transform 0.3s ease' : 'none';
    track.style.transform = `translateX(${translateX}%)`;
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        isAnimating = false;
      }, animate ? 300 : 0);
    });
    
    updateButtons();
    updateDots();
  }
  
  /**
   * Met a jour l'etat des boutons
   */
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= ads.length - 1;
    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    nextBtn.style.opacity = currentIndex >= ads.length - 1 ? '0.3' : '1';
  }
  
  /**
   * Met a jour l'etat des dots
   */
  function updateDots() {
    const dotElements = dots.querySelectorAll('.aw-carousel-dot');
    dotElements.forEach((dot, i) => {
      dot.classList.toggle('aw-carousel-dot--active', i === currentIndex);
    });
  }
  
  // Cree les dots
  const dotElements = createDots(ads.length, 0, (index) => {
    if (index !== currentIndex) {
      currentIndex = index;
      updatePosition();
    }
  });
  dotElements.forEach(dot => dots.appendChild(dot));
  
  // Event listeners
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updatePosition();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < ads.length - 1) {
      currentIndex++;
      updatePosition();
    }
  });
  
  // Initialise
  updatePosition(false);
  
  return carousel;
}
