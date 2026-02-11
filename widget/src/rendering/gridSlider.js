/**
 * Grille avec defilement automatique
 * Gere l'affichage en grille rows x cols avec rotation des annonces
 * @module rendering/gridSlider
 */

import { createElement } from '../utils/dom.js';
import { createCard, createListCard } from './cardFactory.js';
import { GRID_DEFAULTS, TIMING } from '../core/constants.js';

/**
 * Cree un slider de grille
 * @param {Object} options - Options du slider
 * @param {Object[]} options.allAds - Toutes les annonces disponibles
 * @param {number} options.rows - Nombre de lignes
 * @param {number} options.cols - Nombre de colonnes
 * @param {Function} options.onAdClick - Handler de clic
 * @param {number} options.interval - Intervalle de rotation en ms
 * @param {boolean} options.autoSlide - Activer le defilement auto
 * @returns {Object} Slider avec element et methodes de controle
 */
export function createGridSlider(options) {
  const {
    allAds = [],
    rows = 1,
    cols = 1,
    onAdClick,
    interval = TIMING.AUTO_SLIDE_INTERVAL,
    autoSlide = true
  } = options;

  const pageSize = rows * cols;
  const totalPages = Math.max(1, Math.ceil(allAds.length / pageSize));
  let currentPage = 0;
  let autoPlayTimer = null;
  let isPaused = false;

  // Determine l'orientation : horizontal si 1 ligne, vertical si 1 colonne
  const isVertical = rows > 1 && cols === 1;
  const isHorizontal = rows === 1 && cols >= 1;

  // Conteneur principal
  const wrapper = createElement('div', { className: 'aw-slider' });

  // Viewport (zone visible)
  const viewport = createElement('div', { className: 'aw-slider-viewport' });

  // Track (toutes les pages)
  const track = createElement('div', { className: 'aw-slider-track' });

  // Indicateurs (dots)
  const dotsContainer = createElement('div', {
    className: 'aw-slider-dots',
    role: 'tablist',
    'aria-label': 'Navigation des annonces'
  });

  /**
   * Retourne les annonces de la page donnee
   * @param {number} page - Index de la page
   * @returns {Object[]} Annonces de la page
   */
  function getPageAds(page) {
    const start = page * pageSize;
    return allAds.slice(start, start + pageSize);
  }

  /**
   * Cree un element de page avec sa grille
   * @param {Object[]} ads - Annonces de la page
   * @param {number} pageIndex - Index de la page
   * @returns {HTMLElement} Element page
   */
  function createPage(ads, pageIndex) {
    const page = createElement('div', {
      className: 'aw-slider-page',
      'data-page': String(pageIndex)
    });

    const gridClass = pageSize === 1 ? 'aw-slider-grid aw-slider-grid--single' : 'aw-slider-grid';
    const grid = createElement('div', { className: gridClass });

    // Definit la grille CSS
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    ads.forEach(ad => {
      // Utilise la carte en liste si vertical 1 colonne, sinon carte standard
      const card = (isVertical && rows > 2) ? createListCard(ad, onAdClick) : createCard(ad, onAdClick);
      grid.appendChild(card);
    });

    page.appendChild(grid);
    return page;
  }

  /**
   * Cree les dots de navigation
   */
  function buildDots() {
    dotsContainer.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 0; i < totalPages; i++) {
      const dot = createElement('button', {
        className: `aw-slider-dot ${i === currentPage ? 'aw-slider-dot--active' : ''}`,
        'aria-label': `Page ${i + 1}`,
        'aria-selected': i === currentPage ? 'true' : 'false',
        role: 'tab',
        type: 'button'
      });
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  /**
   * Met a jour les dots actifs
   */
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.aw-slider-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('aw-slider-dot--active', i === currentPage);
      dot.setAttribute('aria-selected', i === currentPage ? 'true' : 'false');
    });
  }

  /**
   * Effectue la transition de page
   * @param {boolean} animate - Animer la transition
   */
  function slideToPage(animate = true) {
    const duration = animate ? TIMING.SLIDE_TRANSITION : 0;
    track.style.transition = animate ? `transform ${duration}ms ease` : 'none';
    track.style.transform = `translateX(-${currentPage * 100}%)`;
    updateDots();
  }

  /**
   * Va a une page specifique
   * @param {number} page - Index de la page
   */
  function goTo(page) {
    if (page < 0 || page >= totalPages || page === currentPage) return;
    currentPage = page;
    slideToPage();
  }

  /**
   * Page suivante (boucle)
   */
  function next() {
    currentPage = (currentPage + 1) % totalPages;
    slideToPage();
  }

  /**
   * Page precedente (boucle)
   */
  function prev() {
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    slideToPage();
  }

  /**
   * Demarre le defilement automatique
   */
  function startAutoPlay() {
    if (totalPages <= 1 || !autoSlide) return;
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (!isPaused) next();
    }, interval);
  }

  /**
   * Arrete le defilement automatique
   */
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  /**
   * Construit le slider complet
   */
  function build() {
    track.innerHTML = '';

    for (let p = 0; p < totalPages; p++) {
      const ads = getPageAds(p);
      if (ads.length === 0) break;
      const page = createPage(ads, p);
      track.appendChild(page);
    }

    viewport.appendChild(track);
    wrapper.appendChild(viewport);

    buildDots();
    if (totalPages > 1) {
      wrapper.appendChild(dotsContainer);
    }

    // Boutons de navigation si plusieurs pages
    if (totalPages > 1) {
      const navPrev = createElement('button', {
        className: 'aw-slider-nav aw-slider-nav--prev',
        'aria-label': 'Page precedente',
        type: 'button'
      });
      navPrev.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
      navPrev.addEventListener('click', prev);

      const navNext = createElement('button', {
        className: 'aw-slider-nav aw-slider-nav--next',
        'aria-label': 'Page suivante',
        type: 'button'
      });
      navNext.innerHTML = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';
      navNext.addEventListener('click', next);

      wrapper.appendChild(navPrev);
      wrapper.appendChild(navNext);
    }

    // Pause au survol
    wrapper.addEventListener('mouseenter', () => { isPaused = true; });
    wrapper.addEventListener('mouseleave', () => { isPaused = false; });

    // Support tactile
    setupTouch(wrapper);

    slideToPage(false);
  }

  /**
   * Configure les handlers tactiles
   * @param {HTMLElement} el - Element a observer
   */
  function setupTouch(el) {
    let startX = 0;
    let isDragging = false;

    el.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const delta = endX - startX;
      if (Math.abs(delta) > 40) {
        if (delta > 0) prev();
        else next();
      }
      isDragging = false;
    }, { passive: true });
  }

  /**
   * Met a jour les annonces
   * @param {Object[]} newAds - Nouvelles annonces
   */
  function updateAds(newAds) {
    allAds.length = 0;
    allAds.push(...newAds);
    currentPage = 0;
    build();
    if (autoSlide) startAutoPlay();
  }

  /**
   * Detruit le slider
   */
  function destroy() {
    stopAutoPlay();
    wrapper.innerHTML = '';
  }

  // Construction initiale
  build();

  return Object.freeze({
    element: wrapper,
    next,
    prev,
    goTo,
    startAutoPlay,
    stopAutoPlay,
    updateAds,
    destroy,
    get currentPage() { return currentPage; },
    get totalPages() { return totalPages; },
    get pageSize() { return pageSize; }
  });
}

/**
 * Genere les styles CSS du slider de grille
 * @returns {string} CSS du slider
 */
export function generateGridSliderStyles() {
  return `
    .aw-slider {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .aw-slider-viewport {
      width: 100%;
      overflow: hidden;
    }

    .aw-slider-track {
      display: flex;
      width: 100%;
      will-change: transform;
    }

    .aw-slider-page {
      flex: 0 0 100%;
      width: 100%;
      min-width: 100%;
    }

    .aw-slider-grid {
      display: grid;
      gap: 4px;
      padding: 4px;
      width: 100%;
      box-sizing: border-box;
    }

    /* Mode compact quand 1 seule carte par page */
    .aw-slider-grid--single {
      max-width: 200px;
    }

    /* Cartes stables dans la grille */
    .aw-slider-grid .aw-card {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
    }

    .aw-slider-grid .aw-card-image {
      position: relative;
      width: 100%;
      padding-bottom: 45%;
      overflow: hidden;
    }

    .aw-slider-grid .aw-card-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .aw-slider-grid .aw-card-body {
      padding: 4px 6px;
      overflow: hidden;
    }

    .aw-slider-grid .aw-list-card {
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }

    /* Navigation */
    .aw-slider-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 50%;
      background: var(--aw-background);
      color: var(--aw-text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 4px var(--aw-shadow);
      z-index: 10;
      padding: 0;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .aw-slider:hover .aw-slider-nav {
      opacity: 1;
    }

    .aw-slider-nav--prev { left: 2px; }
    .aw-slider-nav--next { right: 2px; }

    .aw-slider-nav:hover { background: var(--aw-background-alt); }

    .aw-slider-nav svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }

    /* Dots */
    .aw-slider-dots {
      display: flex;
      justify-content: center;
      gap: 3px;
      padding: 3px 0;
    }

    .aw-slider-dot {
      width: 5px;
      height: 5px;
      border: none;
      border-radius: 50%;
      background: var(--aw-border);
      cursor: pointer;
      padding: 0;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .aw-slider-dot--active {
      background: var(--aw-accent);
      transform: scale(1.3);
    }

    .aw-slider-dot:hover {
      background: var(--aw-accent);
    }
  `;
}
