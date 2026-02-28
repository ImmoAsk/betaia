import { createElement } from '../utils/dom.js';

const FILTER_ICON_SVG = '<svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>';

function getFilters(filterConfig) {
  return Array.isArray(filterConfig?.filters) ? filterConfig.filters : [];
}

function getLabel(filters, usage) {
  const hit = filters.find((f) => Number(f?.usage) === Number(usage));
  return String(hit?.label || 'Filtrer').trim();
}

export function createFilterControl({
  shadowRoot,
  filterConfig,
  getActiveUsage,
  setActiveUsage,
  onFilterChange
}) {
  const filters = getFilters(filterConfig);
  if (filters.length === 0) return null;

  const wrap = createElement('div', { className: 'aw-filter-menu-wrap' });
  const trigger = createElement('button', {
    type: 'button',
    className: 'aw-filter-trigger',
    'aria-haspopup': 'menu',
    'aria-expanded': 'false'
  });
  const icon = createElement('span', { className: 'aw-filter-icon', 'aria-hidden': 'true' });
  const tooltip = createElement('span', { className: 'aw-filter-tooltip', 'aria-hidden': 'true' });
  const panel = createElement('div', { className: 'aw-filter-panel', role: 'menu', 'aria-label': 'Choisir un filtre' });
  icon.innerHTML = FILTER_ICON_SVG;
  trigger.appendChild(icon);
  wrap.appendChild(trigger);
  wrap.appendChild(tooltip);
  wrap.appendChild(panel);

  let isOpen = false;
  const setOpen = (next) => {
    isOpen = next === true;
    wrap.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  const sync = () => {
    const usage = getActiveUsage();
    const label = getLabel(filters, usage);
    tooltip.textContent = label;
    trigger.setAttribute('aria-label', `Filtrer: ${label}`);
    panel.querySelectorAll('.aw-filter-item').forEach((node) => {
      const isActive = Number(node.getAttribute('data-usage')) === Number(usage);
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  };

  filters.forEach((filter) => {
    const usage = Number(filter?.usage);
    const label = String(filter?.label || '').trim();
    if (!Number.isFinite(usage) || !label) return;
    const item = createElement('button', {
      type: 'button',
      className: 'aw-filter-item',
      role: 'menuitemradio',
      'aria-checked': 'false',
      'data-usage': String(usage)
    }, label);
    item.addEventListener('click', () => {
      setOpen(false);
      if (Number(getActiveUsage()) === usage) return;
      setActiveUsage(usage);
      sync();
      onFilterChange?.(usage);
    });
    panel.appendChild(item);
  });

  const onTriggerClick = (e) => { e.preventDefault(); e.stopPropagation(); setOpen(!isOpen); };
  const onShadowPointerDown = (e) => { if (isOpen && !e.composedPath().includes(wrap)) setOpen(false); };
  const onDocPointerDown = (e) => { if (isOpen && !e.composedPath().includes(shadowRoot.host)) setOpen(false); };
  const onEsc = (e) => { if (isOpen && e.key === 'Escape') { setOpen(false); trigger.focus(); } };
  trigger.addEventListener('click', onTriggerClick);
  shadowRoot.addEventListener('pointerdown', onShadowPointerDown, true);
  document.addEventListener('pointerdown', onDocPointerDown, true);
  document.addEventListener('keydown', onEsc, true);
  sync();

  return {
    element: wrap,
    sync,
    cleanup: () => {
      trigger.removeEventListener('click', onTriggerClick);
      shadowRoot.removeEventListener('pointerdown', onShadowPointerDown, true);
      document.removeEventListener('pointerdown', onDocPointerDown, true);
      document.removeEventListener('keydown', onEsc, true);
    }
  };
}
