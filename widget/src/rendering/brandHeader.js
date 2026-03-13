import { createElement } from '../utils/dom.js';

const LOGO_FILE_NAME = 'immoask-logo-cropped.png';

function getWidgetScript() {
  return document.currentScript
    || document.querySelector('script[data-api-url]')
    || document.querySelector('script[src*="widget.js"]');
}

function resolveLogoUrl() {
  try {
    const script = getWidgetScript();
    if (script?.src) {
      return new URL(LOGO_FILE_NAME, script.src).toString();
    }
  } catch (e) {
    // Fallback handled below.
  }
  return `./${LOGO_FILE_NAME}`;
}

function createBrand() {
  const brand = createElement('span', { className: 'aw-header-brand', 'aria-label': 'ImmoAsk' });
  const logo = createElement('img', {
    className: 'aw-header-brand-logo',
    alt: 'ImmoAsk',
    loading: 'eager',
    decoding: 'async',
    fetchpriority: 'high'
  });
  logo.src = resolveLogoUrl();
  logo.addEventListener('error', () => {
    brand.textContent = 'ImmoAsk';
  });
  brand.appendChild(logo);
  return brand;
}

export function createHeader(filterElement = null) {
  const header = createElement('div', { className: 'aw-header' });
  const left = createElement('div', { className: 'aw-header-left' });
  if (filterElement) {
    left.appendChild(filterElement);
  } else {
    left.appendChild(createElement('span', { className: 'aw-header-label' }, 'Annonces'));
  }
  header.appendChild(left);
  header.appendChild(createBrand());
  return header;
}
