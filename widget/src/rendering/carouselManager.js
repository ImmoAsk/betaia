/**
 * Gestionnaire du carousel complet
 * @module rendering/carouselManager
 */

import { createCarouselContainer, createCarouselSlide, createDots } from './layoutCarousel.js';
import { createCarouselController } from './carouselController.js';
import { hasTouchSupport } from '../adapters/deviceDetector.js';

/**
 * Cree et gere un carousel complet
 * @param {Object[]} ads - Annonces a afficher
 * @param {Function} onAdClick - Handler de clic
 * @param {Function} onSlideChange - Handler changement de slide
 * @returns {Object} Manager avec element et controleur
 */
export function createCarouselManager(ads, onAdClick, onSlideChange) {
  const elements = createCarouselContainer();
  const { carousel, track, dots } = elements;

  // Cree les slides
  ads.forEach(ad => {
    const slide = createCarouselSlide(ad, onAdClick);
    track.appendChild(slide);
  });

  // Cree les dots
  const dotElements = createDots(ads.length, 0, (index) => {
    controller.goTo(index);
  });
  dotElements.forEach(dot => dots.appendChild(dot));

  // Cree le controleur
  const controller = createCarouselController(elements, ads.length, onSlideChange);

  // Support tactile
  if (hasTouchSupport()) {
    setupTouchHandlers(carousel, controller);
  }

  // Pause autoplay au hover
  carousel.addEventListener('mouseenter', () => controller.stopAutoPlay());
  carousel.addEventListener('mouseleave', () => controller.startAutoPlay());

  /**
   * Demarre le carousel
   * @param {boolean} autoPlay - Activer l'autoplay
   */
  function start(autoPlay = false) {
    if (autoPlay) {
      controller.startAutoPlay();
    }
  }

  /**
   * Detruit le carousel
   */
  function destroy() {
    controller.destroy();
  }

  return Object.freeze({
    element: carousel,
    controller,
    start,
    destroy
  });
}

/**
 * Configure les handlers tactiles
 * @param {HTMLElement} carousel - Element carousel
 * @param {Object} controller - Controleur du carousel
 */
function setupTouchHandlers(carousel, controller) {
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;
    
    // Si mouvement vertical plus important, ignore
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      isDragging = false;
    }
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        controller.prev();
      } else {
        controller.next();
      }
    }
    
    isDragging = false;
  }, { passive: true });
}
