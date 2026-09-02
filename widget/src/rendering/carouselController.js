/**
 * Controleur du carousel
 * @module rendering/carouselController
 */

import { requestFrame } from '../utils/dom.js';

/**
 * Cree un controleur pour le carousel
 * @param {Object} elements - Elements du carousel
 * @param {number} slideCount - Nombre de slides
 * @param {Function} onSlideChange - Callback changement de slide
 * @returns {Object} Controleur avec methodes
 */
export function createCarouselController(elements, slideCount, onSlideChange) {
  const { track, prevBtn, nextBtn, dots } = elements;
  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayTimer = null;

  /**
   * Met a jour la position du carousel
   * @param {boolean} animate - Animer la transition
   */
  function updatePosition(animate = true) {
    if (isAnimating) return;
    
    isAnimating = true;
    const translateX = -currentIndex * 100;
    
    track.style.transition = animate ? 'transform 0.3s ease' : 'none';
    track.style.transform = `translateX(${translateX}%)`;
    
    requestFrame(() => {
      setTimeout(() => {
        isAnimating = false;
      }, animate ? 300 : 0);
    });

    updateButtons();
    updateDots();
    onSlideChange?.(currentIndex);
  }

  /**
   * Met a jour l'etat des boutons
   */
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= slideCount - 1;
  }

  /**
   * Met a jour l'etat des dots
   */
  function updateDots() {
    const dotElements = dots.querySelectorAll('.aw-carousel-dot');
    dotElements.forEach((dot, i) => {
      dot.classList.toggle('aw-carousel-dot--active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });
  }

  /**
   * Va au slide suivant
   */
  function next() {
    if (currentIndex < slideCount - 1) {
      currentIndex++;
      updatePosition();
    }
  }

  /**
   * Va au slide precedent
   */
  function prev() {
    if (currentIndex > 0) {
      currentIndex--;
      updatePosition();
    }
  }

  /**
   * Va a un slide specifique
   * @param {number} index - Index du slide
   */
  function goTo(index) {
    if (index >= 0 && index < slideCount && index !== currentIndex) {
      currentIndex = index;
      updatePosition();
    }
  }

  /**
   * Demarre l'autoplay
   * @param {number} interval - Intervalle en ms
   */
  function startAutoPlay(interval = 5000) {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (currentIndex < slideCount - 1) {
        next();
      } else {
        goTo(0);
      }
    }, interval);
  }

  /**
   * Arrete l'autoplay
   */
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Setup listeners
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Init
  updatePosition(false);

  return Object.freeze({
    next, prev, goTo, startAutoPlay, stopAutoPlay,
    get currentIndex() { return currentIndex; },
    destroy: () => {
      stopAutoPlay();
      prevBtn.removeEventListener('click', prev);
      nextBtn.removeEventListener('click', next);
    }
  });
}
