/**
 * Initialiseur du widget - supporte multi-instance
 * @module core/initializer
 */

import { extractConfigFromScript, createConfig } from './config.js';
import { getStore } from './state.js';
import { LAYOUTS, GRID_DEFAULTS } from './constants.js';
import { resolveTheme, extractSiteColors } from '../adapters/themeDetector.js';
import { measureContainer, calculateOptimalAdCount, calculateOptimalLayout, createResizeObserver } from '../adapters/spaceDetector.js';
import { createSecurityService } from '../security/securityService.js';
import { createRenderer } from '../rendering/renderer.js';
import { createRotationService } from '../rotation/rotationService.js';
import { createAdsClient } from '../api/adsClient.js';
import { createAdsCache } from '../api/adsCache.js';
import { detectBaseUrl } from '../api/endpoints.js';

const DEFAULT_UTM_MEDIUM =
  (typeof __AW_UTM_MEDIUM__ !== 'undefined' && __AW_UTM_MEDIUM__)
    ? String(__AW_UTM_MEDIUM__)
    : 'widget';
const DEFAULT_UTM_CAMPAIGN =
  (typeof __AW_UTM_CAMPAIGN__ !== 'undefined' && __AW_UTM_CAMPAIGN__)
    ? String(__AW_UTM_CAMPAIGN__)
    : 'immoask_widget';
const DEFAULT_MAGAZINE_URL =
  (typeof __AW_MAGAZINE_URL__ !== 'undefined' && __AW_MAGAZINE_URL__)
    ? String(__AW_MAGAZINE_URL__)
    : '';
const DEFAULT_APP_URL =
  (typeof __AW_APP_URL__ !== 'undefined' && __AW_APP_URL__)
    ? String(__AW_APP_URL__)
    : '';
const DEFAULT_APP_ANDROID_URL =
  (typeof __AW_APP_ANDROID_URL__ !== 'undefined' && __AW_APP_ANDROID_URL__)
    ? String(__AW_APP_ANDROID_URL__)
    : '';
const DEFAULT_APP_IOS_URL =
  (typeof __AW_APP_IOS_URL__ !== 'undefined' && __AW_APP_IOS_URL__)
    ? String(__AW_APP_IOS_URL__)
    : '';
const DEFAULT_MAGAZINE_LABEL =
  (typeof __AW_MAGAZINE_LABEL__ !== 'undefined' && __AW_MAGAZINE_LABEL__)
    ? String(__AW_MAGAZINE_LABEL__)
    : 'Télécharger notre magazine';
const DEFAULT_MAGAZINE_DOWNLOAD_NAME =
  (typeof __AW_MAGAZINE_DOWNLOAD_NAME__ !== 'undefined' && __AW_MAGAZINE_DOWNLOAD_NAME__)
    ? String(__AW_MAGAZINE_DOWNLOAD_NAME__)
    : 'magazine.pdf';
const DEFAULT_APP_LABEL =
  (typeof __AW_APP_LABEL__ !== 'undefined' && __AW_APP_LABEL__)
    ? String(__AW_APP_LABEL__)
    : 'Notre appli mobile';
const USAGE_FILTERS = Object.freeze([
  { key: 'sejourner', label: 'Séjourner', usage: 5 },
  { key: 'entreprendre', label: 'Entreprendre', usage: 3 },
  { key: 'acquerir', label: 'Acquérir', usage: 7 },
  { key: 'se_loger', label: 'Se loger', usage: 1 }
]);
const INITIALIZER_DEFAULT_USAGE = 1;

/**
 * Applique les dimensions configurees au conteneur
 * @param {HTMLElement} container - Conteneur du widget
 * @param {Object} config - Configuration
 */
function applyDimensions(container, config) {
  if (config.width) {
    container.style.width = config.width;
    container.style.maxWidth = '100%';
  }
  if (config.height) {
    container.style.height = config.height;
    container.style.overflow = 'auto';
  }
}

/**
 * Initialise une instance du widget dans un conteneur donne
 * @param {HTMLElement} container - Element conteneur
 * @returns {Promise<Object>} Services initialises
 */
export async function initializeWidgetInstance(container) {
  // Configuration depuis le script tag
  const extractedConfig = extractConfigFromScript();
  
  // Surcharges depuis les data-attributes du conteneur
  const containerOverrides = extractContainerConfig(container);
  const config = createConfig({ ...extractedConfig, ...containerOverrides });
  
  // Applique dimensions configurees
  applyDimensions(container, config);

  // Store (un par instance)
  const store = getStore();
  
  // Theme, dimensions et couleurs du site hote
  const theme = resolveTheme(config.theme);
  const siteColors = config.adaptColors ? extractSiteColors() : null;
  const { width, height } = measureContainer(container);
  const orientation = container.dataset.orientation || config.orientation;
  
  // Determine la grille depuis data-grid du conteneur ou de la config
  const gridConfig = parseContainerGrid(container)
    || config.grid
    || buildLinearGridFromOrientation(config.maxAds, orientation);
  
  // Calcul du layout et du nombre d'annonces visibles
  const layout = gridConfig 
    ? (gridConfig.cols === 1 ? LAYOUTS.LIST : LAYOUTS.GRID)
    : calculateOptimalLayout(width, height, config.layout, orientation);
  
  const visibleCount = gridConfig 
    ? gridConfig.rows * gridConfig.cols 
    : calculateOptimalAdCount(width, config.maxAds, height, orientation);
  
  // Nombre d'annonces a fetcher : plus pour permettre la rotation
  const fetchCount = gridConfig
    ? Math.min(visibleCount * GRID_DEFAULTS.FETCH_MULTIPLIER, 30)
    : visibleCount;

  store.setState({
    currentTheme: theme,
    currentLayout: layout,
    containerWidth: width,
    containerHeight: height,
    siteColors,
    gridConfig
  });

  // Shadow DOM pour isolation
  const shadowRoot = container.attachShadow({ mode: 'closed' });
  
  // Services
  const baseUrl = config.apiUrl || detectBaseUrl();
  const securityService = createSecurityService(handleFraudDetected);
  const rotationService = createRotationService(handleRotation);
  const adsClient = createAdsClient(baseUrl, { debug: config.debug });
  const adsCache = createAdsCache();
  const ctaConfig = buildCtaConfig();
  let currentUsage = INITIALIZER_DEFAULT_USAGE;
  let activeFetchToken = 0;
  const renderer = createRenderer(
    shadowRoot,
    theme,
    store.getState().siteColors,
    ctaConfig,
    {
      isVertical: Boolean(gridConfig && gridConfig.cols === 1 && gridConfig.rows > 1)
    },
    {
      filters: USAGE_FILTERS,
      selectedUsage: currentUsage,
      onChange: handleUsageFilterChange
    }
  );
  const gridRenderOptions = buildGridRenderOptions(config);
  let poolRefreshTimer = null;
  let poolRefreshInFlight = false;

  // Initialise le rendu
  renderer.initStyles();
  renderer.showLoading(visibleCount, layout);

  // Charge les annonces (pool plus large pour la rotation)
  const ads = await loadAds(adsClient, fetchCount, securityService, config.debug, currentUsage);
  
  if (ads.length === 0) {
    renderer.showError('Aucune annonce disponible');
    return createServices();
  }

  // Rendu selon le mode
  if (gridConfig) {
    // Mode grille fixe avec rotation des cartes en place
    renderer.renderWithGrid(ads, gridConfig, handleAdClick, {
      ...gridRenderOptions
    });
  } else {
    // Mode classique
    const displayAds = ads.slice(0, visibleCount);
    renderer.render(displayAds, layout, width, handleAdClick);
  }
  
  // Rotation setup (pour le mode classique)
  if (!gridConfig) {
    rotationService.init(ads, ads.slice(0, visibleCount));
    rotationService.setupBehaviorDetection(container);
  }

  // Renouvelle regulierement le pool pour eviter de boucler toujours sur le meme set.
  // Le slider continue de tourner "en place", mais les annonces source sont rechargees.
  startPoolRefresh();

  // Observer resize pour recalcul dynamique
  const cleanupResize = createResizeObserver(container, handleResize);

  // Honeypot securite
  shadowRoot.appendChild(securityService.getHoneypotElement());

  // Helpers
  function handleAdClick(ad, event) {
    const rect = event.target.getBoundingClientRect();
    const displayTime = Date.now() - store.getState().loadTime;
    
    const validation = securityService.validateClick(ad.id, displayTime, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });

    if (validation.valid) {
      rotationService.recordClick(ad.id);
      const destinationUrl = buildClickUrlWithUtm(ad.linkUrl, ad);
      const fallbackUrl = toSafeExternalUrl(DEFAULT_MAGAZINE_URL) || 'https://www.immoask.com/tg';
      window.open(destinationUrl || fallbackUrl, '_blank', 'noopener');
    }
  }

  function handleRotation(newAds, reason) {
    if (!gridConfig) {
      renderer.render(newAds, store.getState().currentLayout, 
        store.getState().containerWidth, handleAdClick);
    }
  }

  function handleResize(newWidth, newHeight) {
    const state = store.getState();
    
    // En mode grille fixe, pas de recalcul du nombre d'annonces
    if (gridConfig) {
      store.setState({ containerWidth: newWidth, containerHeight: newHeight });
      return;
    }
    
    const newLayout = calculateOptimalLayout(newWidth, newHeight, config.layout, orientation);
    const newAdCount = calculateOptimalAdCount(newWidth, config.maxAds, newHeight, orientation);
    
    store.setState({ 
      containerWidth: newWidth, 
      containerHeight: newHeight,
      currentLayout: newLayout
    });
    
    if (newLayout !== state.currentLayout || newAdCount !== state.ads?.length) {
      const displayAds = (state.ads || []).slice(0, newAdCount);
      renderer.render(displayAds, newLayout, newWidth, handleAdClick);
    } else {
      renderer.updateResponsive(newWidth);
    }
  }

  function handleFraudDetected(data) {
    if (config.debug) {
      console.warn('[AnnoncesWidget] Fraude detectee', data);
    }
  }

  function createServices() {
    return {
      refresh: () => refreshInstance(adsClient, config, renderer, securityService, gridConfig, handleAdClick, currentUsage),
      getStats: () => ({ ads: store.getState().ads?.length || 0 }),
      setUsageFilter: (usage) => handleUsageFilterChange(usage),
      destroy: () => cleanup(cleanupResize, rotationService, renderer, poolRefreshTimer)
    };
  }

  function getPoolRefreshIntervalMs() {
    const minMs = 20000;
    const maxMs = 120000;
    const base = Math.max(config.slideInterval || GRID_DEFAULTS.ROTATION_INTERVAL, 3000);
    const factor = Math.max(visibleCount, 1);
    return Math.min(maxMs, Math.max(minMs, base * factor));
  }

  function startPoolRefresh() {
    if (!config.autoSlide) return;

    const intervalMs = getPoolRefreshIntervalMs();
    poolRefreshTimer = setInterval(async () => {
      if (poolRefreshInFlight) return;
      poolRefreshInFlight = true;

      try {
        const refreshToken = activeFetchToken;
        const freshAds = await loadAds(adsClient, fetchCount, securityService, config.debug, currentUsage);
        if (refreshToken !== activeFetchToken) return;
        logDebug(config.debug, '[AnnoncesWidget] Pool rafraichi:', freshAds.length);
        if (!Array.isArray(freshAds) || freshAds.length === 0) return;

        store.setState({ ads: freshAds });

        if (gridConfig) {
          const slider = renderer.slider;
          if (slider?.updateAds) {
            slider.updateAds(freshAds);
          } else {
            renderer.renderWithGrid(freshAds, gridConfig, handleAdClick, {
              ...gridRenderOptions
            });
          }
          return;
        }

        // Mode classique: remplace la base et re-render les annonces visibles.
        const displayAds = freshAds.slice(0, visibleCount);
        rotationService.init(freshAds, displayAds);
        renderer.render(displayAds, store.getState().currentLayout, store.getState().containerWidth, handleAdClick);
      } catch (err) {
        if (config.debug) {
          console.warn('[AnnoncesWidget] Echec refresh pool:', err?.message || err);
        }
      } finally {
        poolRefreshInFlight = false;
      }
    }, intervalMs);
  }

  async function handleUsageFilterChange(nextUsage) {
    const normalizedUsage = sanitizeUsage(nextUsage);
    if (normalizedUsage === currentUsage) return;

    currentUsage = normalizedUsage;
    renderer.setActiveFilter(currentUsage);

    const requestToken = ++activeFetchToken;
    renderer.showLoading(visibleCount, layout);

    const adsByFilter = await loadAds(adsClient, fetchCount, securityService, config.debug, currentUsage);
    if (requestToken !== activeFetchToken) return;

    if (!Array.isArray(adsByFilter) || adsByFilter.length === 0) {
      store.setState({ ads: [], loadTime: Date.now() });
      renderer.showError('Aucune annonce disponible pour ce filtre');
      return;
    }

    store.setState({ ads: adsByFilter, loadTime: Date.now() });

    if (gridConfig) {
      renderer.renderWithGrid(adsByFilter, gridConfig, handleAdClick, {
        ...gridRenderOptions
      });
      return;
    }

    const state = store.getState();
    const displayAds = adsByFilter.slice(0, visibleCount);
    rotationService.init(adsByFilter, displayAds);
    renderer.render(
      displayAds,
      state.currentLayout || layout,
      state.containerWidth || width,
      handleAdClick
    );
  }

  store.setState({ loadTime: Date.now(), ads });
  return createServices();
}

/**
 * Extrait la configuration depuis les data-attributes d'un conteneur
 * @param {HTMLElement} container - Element conteneur
 * @returns {Object} Configuration partielle
 */
function extractContainerConfig(container) {
  const overrides = {};
  const maxAds = container.dataset.maxAds;
  const layout = container.dataset.layout;
  const theme = container.dataset.theme;
  const orientation = container.dataset.orientation;
  const width = container.dataset.width;
  const height = container.dataset.height;
  
  if (maxAds) overrides.maxAds = parseInt(maxAds, 10);
  if (layout) overrides.layout = layout;
  if (theme) overrides.theme = theme;
  if (orientation) overrides.orientation = orientation;
  if (width) overrides.width = width;
  if (height) overrides.height = height;
  
  return overrides;
}

/**
 * Parse la grille depuis les data-attributes du conteneur
 * @param {HTMLElement} container - Element conteneur
 * @returns {Object|null} {rows, cols} ou null
 */
function parseContainerGrid(container) {
  const gridAttr = container.dataset.grid;
  if (!gridAttr) return null;
  const parts = gridAttr.split(',').map(v => parseInt(v.trim(), 10));
  if (parts.length !== 2 || parts.some(isNaN)) return null;
  const rows = Math.max(1, Math.min(parts[0], 6));
  const cols = Math.max(1, Math.min(parts[1], 6));
  return { rows, cols };
}

/**
 * Construit une "grille lineaire" a partir de maxAds + orientation
 * pour supporter le mode (n,1) / (1,n) sans data-grid explicite.
 */
function buildLinearGridFromOrientation(maxAds, orientation) {
  if (!Number.isFinite(maxAds) || maxAds < 1) return null;
  if (!['horizontal', 'vertical'].includes(orientation)) return null;

  const n = Math.max(1, Math.min(Math.trunc(maxAds), GRID_DEFAULTS.MAX_ROWS));
  return orientation === 'vertical'
    ? { rows: n, cols: 1 }
    : { rows: 1, cols: n };
}

async function loadAds(client, count, security, debug = false, usage = INITIALIZER_DEFAULT_USAGE) {
  try {
    logDebug(debug, '[AnnoncesWidget] Chargement des annonces...');
    const ads = await client.fetchAds(count, usage);
    logDebug(debug, '[AnnoncesWidget] Annonces recues:', ads.length);
    return security.secureAds(ads);
  } catch (e) {
    console.error('[AnnoncesWidget] Erreur chargement:', e);
    return [];
  }
}

async function refreshInstance(client, config, renderer, security, gridConfig, onAdClick, usage = INITIALIZER_DEFAULT_USAGE) {
  const count = gridConfig 
    ? gridConfig.rows * gridConfig.cols * GRID_DEFAULTS.FETCH_MULTIPLIER
    : 5;
  renderer.showLoading(gridConfig ? gridConfig.rows * gridConfig.cols : 3, LAYOUTS.GRID);
  const ads = await loadAds(client, count, security, config.debug, usage);
  if (gridConfig) {
    renderer.renderWithGrid(ads, gridConfig, onAdClick, {
      ...buildGridRenderOptions(config)
    });
  } else {
    renderer.render(ads, LAYOUTS.GRID, 800, () => {});
  }
}

function cleanup(resizeCleanup, rotation, renderer, poolRefreshTimer) {
  resizeCleanup?.();
  if (poolRefreshTimer) clearInterval(poolRefreshTimer);
  rotation?.destroy();
  if (typeof renderer?.destroy === 'function') {
    renderer.destroy();
  } else {
    renderer?.destroySlider?.();
  }
}

function buildClickUrlWithUtm(rawUrl, ad = {}) {
  try {
    const dest = new URL(rawUrl, window.location.href);
    if (!isSafeHttpUrl(dest)) return '';
    const host = String(window.location.hostname || 'unknown').toLowerCase();

    dest.searchParams.set('utm_source', host);
    dest.searchParams.set('utm_medium', DEFAULT_UTM_MEDIUM);
    dest.searchParams.set('utm_campaign', DEFAULT_UTM_CAMPAIGN);
    if (ad?.id != null) {
      dest.searchParams.set('utm_content', `ad_${String(ad.id)}`);
    }

    return dest.toString();
  } catch (e) {
    return rawUrl;
  }
}

function toSafeExternalUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    if (!isSafeHttpUrl(parsed)) return '';
    return parsed.toString();
  } catch (e) {
    return '';
  }
}

function isSafeHttpUrl(parsedUrl) {
  if (!parsedUrl || !['http:', 'https:'].includes(parsedUrl.protocol)) return false;
  const host = String(parsedUrl.hostname || '').trim().toLowerCase();
  if (!host || host === '&' || host === '...') return false;
  if (host.includes('&')) return false;
  if (!/[a-z0-9]/i.test(host)) return false;
  return /^[a-z0-9.-]+$/i.test(host);
}

function detectMobilePlatform() {
  const uaData = navigator.userAgentData;
  const uaDataPlatform = String(uaData?.platform || '').toLowerCase();
  const ua = String(navigator.userAgent || '').toLowerCase();
  const maxTouchPoints = Number(navigator.maxTouchPoints || 0);

  if (/android/.test(uaDataPlatform) || /android/.test(ua)) return 'android';

  const isIosUaData = /ios|iphone|ipad|ipod/.test(uaDataPlatform);
  const isIosUa = /iphone|ipad|ipod/.test(ua);
  const isIpadDesktopMode = /macintosh/.test(ua) && maxTouchPoints > 1;
  if (isIosUaData || isIosUa || isIpadDesktopMode) return 'ios';

  return 'other';
}

function resolveAppCtaUrl() {
  const generic = toSafeExternalUrl(DEFAULT_APP_URL);
  const android = toSafeExternalUrl(DEFAULT_APP_ANDROID_URL);
  const ios = toSafeExternalUrl(DEFAULT_APP_IOS_URL);
  const platform = detectMobilePlatform();

  if (platform === 'android') return android || generic || ios || '';
  if (platform === 'ios') return ios || generic || android || '';
  return generic || android || ios || '';
}

function buildCtaConfig() {
  return Object.freeze({
    magazineUrl: toSafeExternalUrl(DEFAULT_MAGAZINE_URL),
    magazineDownloadName: String(DEFAULT_MAGAZINE_DOWNLOAD_NAME || 'magazine.pdf'),
    appUrl: resolveAppCtaUrl(),
    magazineLabel: String(DEFAULT_MAGAZINE_LABEL || 'Télécharger notre magazine'),
    appLabel: String(DEFAULT_APP_LABEL || 'Notre appli mobile')
  });
}

function buildGridRenderOptions(config) {
  return {
    autoSlide: config.autoSlide,
    interval: config.slideInterval,
    onRender: null
  };
}

function logDebug(isDebug, ...args) {
  if (isDebug) {
    console.log(...args);
  }
}

function sanitizeUsage(value) {
  const n = parseInt(value, 10);
  return [1, 3, 5, 7].includes(n) ? n : INITIALIZER_DEFAULT_USAGE;
}
