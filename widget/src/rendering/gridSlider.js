/**
 * Grille fixe avec rotation des annonces "en place"
 * Les cases restent fixes, seul le contenu des cartes change.
 * @module rendering/gridSlider
 */

import { createElement } from '../utils/dom.js';
import { createCard } from './cardFactory.js';
import { TIMING } from '../core/constants.js';

/**
 * Cree une grille fixe avec rotation des annonces
 * @param {Object} options - Options
 * @param {Object[]} options.allAds - Pool complet d'annonces
 * @param {number} options.rows - Lignes
 * @param {number} options.cols - Colonnes
 * @param {Function} options.onAdClick - Handler clic
 * @param {number} options.interval - Intervalle de rotation (ms)
 * @param {boolean} options.autoSlide - Rotation auto active
 * @param {Function} options.onRender - Callback apres rendu/remplacement
 * @returns {Object} Controleur compatible avec l'ancienne API slider
 */
export function createGridSlider(options) {
  const {
    allAds = [],
    rows = 1,
    cols = 1,
    onAdClick,
    interval = TIMING.AUTO_SLIDE_INTERVAL,
    autoSlide = true,
    onRender = null
  } = options;

  const pageSize = Math.max(1, rows * cols);
  const isVertical = rows > 1 && cols === 1;
  const wrapper = createElement('div', { className: 'aw-slider aw-slider--fixed' });
  const gridClasses = ['aw-slider-grid'];
  if (pageSize === 1) gridClasses.push('aw-slider-grid--single');
  if (isVertical) gridClasses.push('aw-slider-grid--vertical');
  if (isVertical && rows >= 3) gridClasses.push('aw-slider-grid--vertical-compact');
  if (isVertical && rows >= 4) gridClasses.push('aw-slider-grid--vertical-compact-2');
  if (isVertical && rows >= 5) gridClasses.push('aw-slider-grid--vertical-compact-3');
  const grid = createElement('div', {
    className: gridClasses.join(' '),
    role: 'list',
    'aria-label': 'Liste des annonces'
  });

  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  wrapper.appendChild(grid);

  let adsPool = Array.isArray(allAds) ? [...allAds] : [];
  let visibleAds = [];
  let slotWrappers = [];
  let autoPlayTimer = null;
  let isPaused = false;
  let rotationCursor = 0;
  let slotCursor = 0;

  const onMouseEnter = () => { isPaused = true; };
  const onMouseLeave = () => { isPaused = false; };
  wrapper.addEventListener('mouseenter', onMouseEnter);
  wrapper.addEventListener('mouseleave', onMouseLeave);

  function createCardForAd(ad) {
    return createCard(ad, onAdClick, { horizontal: isVertical });
  }

  function getVisibleCount() {
    return visibleAds.length;
  }

  function notifyRender() {
    onRender?.({
      wrapper,
      grid,
      ads: [...visibleAds],
      cards: slotWrappers
        .map(slot => slot.firstElementChild)
        .filter(Boolean)
    });
  }

  function setInitialVisibleAds() {
    visibleAds = adsPool.slice(0, pageSize);
    slotCursor = 0;
    rotationCursor = visibleAds.length % (adsPool.length || 1);
  }

  function buildSlots() {
    grid.innerHTML = '';
    slotWrappers = [];

    visibleAds.forEach((ad, index) => {
      const slot = createElement('div', {
        className: 'aw-slider-slot',
        'data-slot-index': String(index)
      });

      const card = createCardForAd(ad);
      slot.appendChild(card);
      grid.appendChild(slot);
      slotWrappers.push(slot);
    });

    notifyRender();
  }

  function build() {
    stopAutoPlay();
    setInitialVisibleAds();
    buildSlots();
  }

  function findNextCandidate(excludedIds = new Set()) {
    if (adsPool.length === 0) return null;

    for (let i = 0; i < adsPool.length; i++) {
      const idx = (rotationCursor + i) % adsPool.length;
      const ad = adsPool[idx];
      if (!ad || excludedIds.has(ad.id)) continue;

      rotationCursor = (idx + 1) % adsPool.length;
      return ad;
    }

    return null;
  }

  function replaceSlot(slotIndex, nextAd) {
    const slot = slotWrappers[slotIndex];
    if (!slot || !nextAd) return;

    const card = createCardForAd(nextAd);
    visibleAds[slotIndex] = nextAd;

    slot.classList.add('aw-slider-slot--updating');
    slot.replaceChildren(card);

    setTimeout(() => {
      slot.classList.remove('aw-slider-slot--updating');
    }, 180);

    notifyRender();
  }

  /**
   * Rotation d'une case a la fois (cartes fixes, contenu remplace)
   */
  function rotateOneSlot() {
    const visibleCount = getVisibleCount();
    if (visibleCount === 0) return;
    if (adsPool.length <= visibleCount) return;

    const slotIndex = slotCursor % visibleCount;
    const excludedIds = new Set(visibleAds.map(ad => ad?.id).filter(Boolean));
    const nextAd = findNextCandidate(excludedIds);

    if (!nextAd) return;

    replaceSlot(slotIndex, nextAd);
    slotCursor = (slotCursor + 1) % visibleCount;
  }

  function startAutoPlay() {
    if (!autoSlide) return;
    if (adsPool.length <= visibleAds.length) return;

    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (!isPaused) rotateOneSlot();
    }, interval);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function next() {
    rotateOneSlot();
  }

  function prev() {
    rotateOneSlot();
  }

  function goTo() {
    // Compatibilite API: plus de pages en mode grille fixe
  }

  function updateAds(newAds) {
    adsPool = Array.isArray(newAds) ? [...newAds] : [];
    build();
    if (autoSlide) startAutoPlay();
  }

  function destroy() {
    stopAutoPlay();
    wrapper.removeEventListener('mouseenter', onMouseEnter);
    wrapper.removeEventListener('mouseleave', onMouseLeave);
    wrapper.innerHTML = '';
    slotWrappers = [];
    visibleAds = [];
  }

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
    get currentPage() { return 0; },
    get totalPages() { return Math.max(1, Math.ceil((adsPool.length || 0) / pageSize)); },
    get pageSize() { return pageSize; }
  });
}

/**
 * Styles de la grille fixe rotative
 * @returns {string}
 */
export function generateGridSliderStyles() {
  return `
    .aw-slider {
      position: relative;
      width: 100%;
    }

    .aw-slider--fixed {
      overflow: visible;
    }

    .aw-slider-grid {
      display: grid;
      gap: 10px;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
      align-items: stretch;
    }

    .aw-slider-grid--single {
      max-width: 360px;
    }

    .aw-slider-grid--vertical {
      gap: 10px;
    }

    .aw-slider-slot {
      min-width: 0;
      width: 100%;
      transition: opacity 0.18s ease;
    }

    .aw-slider-slot--updating {
      opacity: 0.92;
    }

    .aw-slider-grid .aw-card,
    .aw-slider-grid .aw-list-card {
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }

    .aw-slider-grid .aw-card {
      overflow: hidden;
    }

    /* Compact a partir de 3 lignes verticales */
    .aw-slider-grid--vertical-compact .aw-card--horizontal .aw-ad-link {
      grid-template-columns: minmax(100px, 36%) 1fr;
    }

    .aw-slider-grid--vertical-compact .aw-card--horizontal .aw-card-image {
      min-height: 120px;
    }

    .aw-slider-grid--vertical-compact .aw-card-title {
      font-size: 13px;
    }

    .aw-slider-grid--vertical-compact .aw-card-price {
      font-size: 13px;
    }

    .aw-slider-grid--vertical-compact .aw-card-location {
      font-size: 11px;
    }

    .aw-slider-grid--vertical-compact .aw-card-body {
      padding: 10px 12px 8px;
      gap: 3px;
    }

    .aw-slider-grid--vertical-compact .aw-card-amenity-value {
      font-size: 11px;
    }

    /* 4+ lignes */
    .aw-slider-grid--vertical-compact-2 {
      gap: 6px;
      padding: 4px;
    }

    .aw-slider-grid--vertical-compact-2 .aw-card--horizontal .aw-ad-link {
      grid-template-columns: minmax(80px, 33%) 1fr;
    }

    .aw-slider-grid--vertical-compact-2 .aw-card--horizontal .aw-card-image {
      min-height: 100px;
    }

    .aw-slider-grid--vertical-compact-2 .aw-card {
      border-radius: 10px;
    }

    .aw-slider-grid--vertical-compact-2 .aw-card-title {
      font-size: 12px;
    }

    .aw-slider-grid--vertical-compact-2 .aw-card-price {
      font-size: 12px;
    }

    .aw-slider-grid--vertical-compact-2 .aw-card-location {
      font-size: 10px;
    }

    .aw-slider-grid--vertical-compact-2 .aw-card-body {
      padding: 8px 10px 6px;
      gap: 2px;
    }

    .aw-slider-grid--vertical-compact-2 .aw-card-amenity-value {
      font-size: 10px;
    }

    /* 5+ lignes */
    .aw-slider-grid--vertical-compact-3 .aw-card--horizontal .aw-ad-link {
      grid-template-columns: minmax(70px, 30%) 1fr;
    }

    .aw-slider-grid--vertical-compact-3 .aw-card--horizontal .aw-card-image {
      min-height: 85px;
    }

    .aw-slider-grid--vertical-compact-3 .aw-card-category {
      display: none;
    }

    .aw-slider-grid--vertical-compact-3 .aw-card-footer {
      padding-top: 5px;
    }
  `;
}
