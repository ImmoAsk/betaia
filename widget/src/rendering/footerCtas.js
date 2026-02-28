import { createElement } from '../utils/dom.js';

function createButton(label, url, variant) {
  if (!url) return null;
  const text = String(label || 'Action').trim() || 'Action';
  return createElement('a', {
    className: `aw-cta-btn ${variant}`.trim(),
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': text
  }, text);
}

export function createFooterCtas(ctaConfig) {
  const magazineUrl = ctaConfig?.magazineUrl || '';
  const appUrl = ctaConfig?.appUrl || '';
  if (!magazineUrl && !appUrl) return null;

  const footer = createElement('div', {
    className: 'aw-cta-row',
    role: 'navigation',
    'aria-label': 'Actions widget'
  });

  const magazineBtn = createButton(
    ctaConfig?.magazineLabel || 'Telecharger notre magazine',
    magazineUrl,
    'aw-cta-btn--magazine'
  );
  const appBtn = createButton(
    ctaConfig?.appLabel || 'Notre appli mobile',
    appUrl,
    'aw-cta-btn--app'
  );

  if (magazineBtn) footer.appendChild(magazineBtn);
  if (appBtn) footer.appendChild(appBtn);
  return footer.childElementCount > 0 ? footer : null;
}
