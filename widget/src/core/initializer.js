/**
 * Initialiseur du widget - supporte multi-instance
 * @module core/initializer
 */

import { extractConfigFromScript, createConfig } from './config.js';
import { getStore } from './state.js';
import { DEFAULT_CONTAINER_ID, LAYOUTS, GRID_DEFAULTS } from './constants.js';
import { resolveTheme, extractSiteColors } from '../adapters/themeDetector.js';
import { measureContainer, calculateOptimalAdCount, calculateOptimalLayout, createResizeObserver } from '../adapters/spaceDetector.js';
import { createSecurityService } from '../security/securityService.js';
import { createRGPDService } from '../rgpd/rgpdService.js';
import { createRenderer } from '../rendering/renderer.js';
import { createTrackingService } from '../tracking/trackingService.js';
import { createRotationService } from '../rotation/rotationService.js';
import { createAdsClient } from '../api/adsClient.js';
import { createAdsCache } from '../api/adsCache.js';
import { createEndpoints, detectBaseUrl } from '../api/endpoints.js';

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
  
  if (!config.clientId) {
    throw new Error('CLIENT_ID manquant (data-id)');
  }

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
  const gridConfig = parseContainerGrid(container) || config.grid;
  
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
  const endpoints = createEndpoints(baseUrl);
  const rgpdService = createRGPDService(config.noTracking);
  const securityService = createSecurityService(handleFraudDetected);
  const trackingService = createTrackingService(config, endpoints.tracking);
  const rotationService = createRotationService(handleRotation, trackEvent);
  const adsClient = createAdsClient(baseUrl);
  const adsCache = createAdsCache();
  const renderer = createRenderer(shadowRoot, theme, store.getState().siteColors);

  // Initialise le rendu
  renderer.initStyles();
  renderer.showLoading(visibleCount, layout);

  // Tracking init
  if (rgpdService.isTrackingAllowed()) {
    trackingService.init();
  }

  // Charge les annonces (pool plus large pour la rotation)
  const ads = await loadAds(adsClient, config.clientId, fetchCount, securityService);
  
  if (ads.length === 0) {
    renderer.showError('Aucune annonce disponible');
    return createServices();
  }

  // Rendu selon le mode
  if (gridConfig) {
    // Mode grille avec slider
    renderer.renderWithGrid(ads, gridConfig, handleAdClick, {
      autoSlide: config.autoSlide,
      interval: config.slideInterval
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

  // Observer resize pour recalcul dynamique
  const cleanupResize = createResizeObserver(container, handleResize);

  // Tracking des annonces
  const adElements = shadowRoot.querySelectorAll('[data-ad-id]');
  adElements.forEach(el => {
    trackingService.trackAd(el, el.dataset.adId);
  });

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
      window.open(ad.linkUrl, '_blank', 'noopener');
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
    trackingService.track({ type: 'fraud_detected', ...data });
  }

  function trackEvent(event) {
    trackingService.track(event);
  }

  function createServices() {
    return {
      refresh: () => refreshInstance(adsClient, config, renderer, securityService, gridConfig, handleAdClick),
      getStats: () => ({ ads: store.getState().ads?.length || 0 }),
      rgpdService, trackingService,
      destroy: () => cleanup(cleanupResize, trackingService, rotationService, renderer)
    };
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

async function loadAds(client, clientId, count, security) {
  try {
    console.log('[AnnoncesWidget] Chargement des annonces...');
    const ads = await client.fetchAds(clientId, count);
    console.log('[AnnoncesWidget] Annonces recues:', ads.length);
    return security.secureAds(ads);
  } catch (e) {
    console.error('[AnnoncesWidget] Erreur chargement:', e);
    return [];
  }
}

async function refreshInstance(client, config, renderer, security, gridConfig, onAdClick) {
  const count = gridConfig 
    ? gridConfig.rows * gridConfig.cols * GRID_DEFAULTS.FETCH_MULTIPLIER
    : 5;
  renderer.showLoading(gridConfig ? gridConfig.rows * gridConfig.cols : 3, LAYOUTS.GRID);
  const ads = await loadAds(client, config.clientId, count, security);
  if (gridConfig) {
    renderer.renderWithGrid(ads, gridConfig, onAdClick, {
      autoSlide: config.autoSlide,
      interval: config.slideInterval
    });
  } else {
    renderer.render(ads, LAYOUTS.GRID, 800, () => {});
  }
}

function cleanup(resizeCleanup, tracking, rotation, renderer) {
  resizeCleanup?.();
  tracking?.destroy();
  rotation?.destroy();
  renderer?.destroySlider();
}
