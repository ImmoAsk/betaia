import { LAYOUTS } from '../core/constants.js';
import { generateBaseStyles, generateGridStyles, generateListStyles, generateAdaptiveStyles } from './styles.js';
import { generateCardStyles, generateListCardStyles } from './cardStyles.js';
import { generateSkeletonStyles, createSkeletonCardHTML } from './skeletonStyles.js';
import { renderGridLayout, updateGridLayout } from './layoutGrid.js';
import { renderListLayout } from './layoutList.js';
import { createGridSlider, generateGridSliderStyles } from './gridSlider.js';
import { createElement } from '../utils/dom.js';
import { createHeader } from './brandHeader.js';
import { createFooterCtas } from './footerCtas.js';
import { createFilterControl } from './filterControl.js';

export function createRenderer(shadowRoot, theme, siteColors = null, ctaConfig = null, filterConfig = null) {
  let currentLayout = null;
  let contentContainer = null;
  let activeSlider = null;
  let filterControl = null;
  let activeFilterUsage = Number.isFinite(Number(filterConfig?.selectedUsage)) ? Number(filterConfig.selectedUsage) : null;

  const getActiveUsage = () => activeFilterUsage;
  const setActiveUsage = (usage) => { activeFilterUsage = Number(usage); };
  const appendFooter = () => { const f = createFooterCtas(ctaConfig); if (f) contentContainer.appendChild(f); };
  const destroySlider = () => { if (activeSlider) { activeSlider.destroy(); activeSlider = null; } };
  const destroyFilter = () => { filterControl?.cleanup?.(); filterControl = null; };
  const resetContent = () => { destroySlider(); destroyFilter(); contentContainer.innerHTML = ''; };

  function initStyles() {
    const style = createElement('style');
    const styles = [generateBaseStyles(theme), generateCardStyles(), generateListCardStyles(), generateGridStyles(4), generateListStyles(), generateSkeletonStyles(), generateGridSliderStyles()];
    if (siteColors) styles.push(generateAdaptiveStyles(siteColors));
    style.textContent = styles.join('\n');
    shadowRoot.appendChild(style);
    contentContainer = createElement('div', { className: 'aw-container' });
    if (siteColors) shadowRoot.host.classList.add('aw-adaptive');
    shadowRoot.appendChild(contentContainer);
  }

  function appendHeader() {
    filterControl = createFilterControl({
      shadowRoot,
      filterConfig,
      getActiveUsage,
      setActiveUsage,
      onFilterChange: (usage) => filterConfig?.onChange?.(usage)
    });
    contentContainer.appendChild(createHeader(filterControl?.element || null));
  }

  function showLoading(count, layout) {
    resetContent();
    appendHeader();
    const wrapper = createElement('div', { className: layout === LAYOUTS.LIST ? 'aw-list' : 'aw-grid' });
    for (let i = 0; i < Math.min(count, 4); i++) { const item = createElement('div'); item.innerHTML = createSkeletonCardHTML(); wrapper.appendChild(item.firstChild); }
    contentContainer.appendChild(wrapper);
    appendFooter();
  }

  function showError(message) {
    resetContent();
    appendHeader();
    contentContainer.appendChild(createElement('div', { className: 'aw-error', role: 'alert' }, message));
    appendFooter();
  }

  function renderWithGrid(ads, gridConfig, onAdClick, sliderOptions = {}) {
    resetContent();
    appendHeader();
    if (!ads.length) return showError('Aucune annonce disponible');
    activeSlider = createGridSlider({ allAds: ads, rows: gridConfig.rows, cols: gridConfig.cols, onAdClick, interval: sliderOptions.interval || 5000, autoSlide: sliderOptions.autoSlide !== false, onRender: sliderOptions.onRender });
    contentContainer.appendChild(activeSlider.element);
    appendFooter();
    if (sliderOptions.autoSlide !== false) activeSlider.startAutoPlay();
  }

  function render(ads, layout, containerWidth, onAdClick) {
    resetContent();
    currentLayout = layout;
    if (!ads.length) return showError('Aucune annonce disponible');
    appendHeader();
    const content = layout === LAYOUTS.LIST ? renderListLayout(ads, onAdClick) : renderGridLayout(ads, containerWidth, onAdClick);
    contentContainer.appendChild(content);
    appendFooter();
  }

  function updateResponsive(containerWidth) { if (currentLayout === LAYOUTS.GRID) { const grid = contentContainer.querySelector('.aw-grid'); if (grid) updateGridLayout(grid, containerWidth); } }
  function updateTheme(newTheme) { const style = shadowRoot.querySelector('style'); if (style) style.textContent = style.textContent.replace(/(:host\s*\{[^}]*)/, generateBaseStyles(newTheme).match(/(:host\s*\{[^}]*)/)[1]); }
  function setActiveFilter(usage) { setActiveUsage(usage); filterControl?.sync?.(); }
  function destroy() { resetContent(); }

  return Object.freeze({ initStyles, showLoading, showError, render, renderWithGrid, updateResponsive, updateTheme, setActiveFilter, destroy, destroySlider, get container() { return contentContainer; }, get slider() { return activeSlider; } });
}
