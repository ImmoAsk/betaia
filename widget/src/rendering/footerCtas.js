import { createElement } from '../utils/dom.js';

function isPdfUrl(url) {
  if (!url) return false;
  try {
    return new URL(url, window.location.href).pathname.toLowerCase().endsWith('.pdf');
  } catch (e) {
    return String(url).toLowerCase().includes('.pdf');
  }
}

function resolveDownloadName(url, explicitName) {
  const cleanName = String(explicitName || '').trim();
  if (cleanName) return cleanName;
  try {
    const pathname = new URL(url, window.location.href).pathname;
    const fileName = pathname.split('/').filter(Boolean).pop();
    return fileName || 'magazine.pdf';
  } catch (e) {
    return 'magazine.pdf';
  }
}

function enableSpaceKeyActivation(anchor) {
  anchor.addEventListener('keydown', (event) => {
    if (event.key !== ' ') return;
    event.preventDefault();
    anchor.click();
  });
}

function createButton(label, url, variant, options = {}) {
  if (!url) return null;
  const text = String(label || 'Action').trim() || 'Action';
  const isDownload = options.download === true;
  const attrs = {
    className: `aw-cta-btn ${variant}`.trim(),
    href: url,
    'aria-label': text
  };
  if (isDownload) {
    attrs.download = resolveDownloadName(url, options.downloadName);
  } else {
    attrs.target = '_blank';
    attrs.rel = 'noopener noreferrer';
  }
  const button = createElement('a', attrs, text);
  enableSpaceKeyActivation(button);
  return button;
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
  const magazineIsPdf = isPdfUrl(magazineUrl);

  const magazineBtn = createButton(
    ctaConfig?.magazineLabel || 'Télécharger notre magazine',
    magazineUrl,
    'aw-cta-btn--magazine',
    {
      download: magazineIsPdf,
      downloadName: ctaConfig?.magazineDownloadName || ''
    }
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
