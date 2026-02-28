import { createElement } from '../utils/dom.js';

const LOGO_URLS = [
  'https://www.immoask.com/images/logo/immoask-logo-cropped.png',
  'https://immoask.com/images/logo/immoask-logo-cropped.png'
];

function createBrand() {
  const brand = createElement('span', { className: 'aw-header-brand', 'aria-label': 'ImmoAsk' });
  const logo = createElement('img', {
    className: 'aw-header-brand-logo',
    src: LOGO_URLS[0],
    alt: 'ImmoAsk',
    loading: 'lazy',
    decoding: 'async',
    referrerpolicy: 'no-referrer'
  });
  let index = 0;
  logo.addEventListener('error', () => {
    index += 1;
    if (index < LOGO_URLS.length) {
      logo.src = LOGO_URLS[index];
      return;
    }
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
