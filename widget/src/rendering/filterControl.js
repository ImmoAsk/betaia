import { createElement } from '../utils/dom.js';

function getFilters(filterConfig) {
  return Array.isArray(filterConfig?.filters) ? filterConfig.filters : [];
}

function isSameUsage(currentUsage, nextUsage) {
  return Number(currentUsage) === Number(nextUsage);
}

export function createFilterControl({
  filterConfig,
  getActiveUsage,
  setActiveUsage,
  onFilterChange
}) {
  const filters = getFilters(filterConfig);
  if (filters.length === 0) return null;

  const wrap = createElement('div', {
    className: 'aw-filter-bar',
    role: 'toolbar',
    'aria-label': 'Filtres annonces'
  });
  const cleanups = [];

  const sync = () => {
    const usage = getActiveUsage();
    wrap.querySelectorAll('.aw-filter-chip').forEach((node) => {
      const isActive = isSameUsage(node.getAttribute('data-usage'), usage);
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  filters.forEach((filter) => {
    const usage = Number(filter?.usage);
    const label = String(filter?.label || '').trim();
    if (!Number.isFinite(usage) || !label) return;
    const chip = createElement('button', {
      type: 'button',
      className: 'aw-filter-chip',
      'aria-pressed': 'false',
      'data-usage': String(usage)
    }, label);
    const onClick = () => {
      if (isSameUsage(getActiveUsage(), usage)) return;
      setActiveUsage(usage);
      sync();
      onFilterChange?.(usage);
    };
    chip.addEventListener('click', onClick);
    cleanups.push(() => chip.removeEventListener('click', onClick));
    wrap.appendChild(chip);
  });

  sync();

  return {
    element: wrap,
    sync,
    cleanup: () => cleanups.forEach((cleanup) => cleanup())
  };
}
