/**
 * Initialiseur du widget
 * @module core/initializer
 */

import { extractConfigFromScript, createConfig } from './config.js';
import { getStore } from './state.js';
import { DEFAULT_CONTAINER_ID, LAYOUTS } from './constants.js';
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
 * Initialise tous les services du widget
 * @returns {Promise<Object>} Services initialises
 */
export async function initializeWidget() {
  // Configuration
  const extractedConfig = extractConfigFromScript();
  const config = createConfig(extractedConfig);
  
  if (!config.clientId) {
    throw new Error('CLIENT_ID manquant (data-id)');
  }

  // Conteneur
  const container = document.getElementById(DEFAULT_CONTAINER_ID);
  if (!container) {
    throw new Error(`Conteneur #${DEFAULT_CONTAINER_ID} non trouve`);
  }

  // Applique dimensions configurees
  applyDimensions(container, config);

  // Store
  const store = getStore();
  
  // Theme, dimensions et couleurs du site hote
  const theme = resolveTheme(config.theme);
  const siteColors = config.adaptColors ? extractSiteColors() : null;
  const { width, height } = measureContainer(container);
  const layout = calculateOptimalLayout(width, height, config.layout, config.orientation);
  const adCount = calculateOptimalAdCount(width, config.maxAds, height, config.orientation);

  store.setState({
    currentTheme: theme,
    currentLayout: layout,
    containerWidth: width,
    containerHeight: height,
    siteColors
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
  renderer.showLoading(adCount, layout);

  // Tracking init
  if (rgpdService.isTrackingAllowed()) {
    trackingService.init();
  }

  // Charge les annonces (dynamique selon espace)
  const ads = await loadAds(adsClient, config.clientId, adCount, securityService);
  
  if (ads.length === 0) {
    renderer.showError('Aucune annonce disponible');
    return createServices();
  }

  // Rendu
  renderer.render(ads, layout, width, handleAdClick);
  
  // Rotation setup
  rotationService.init(ads, ads);
  rotationService.setupBehaviorDetection(container);

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
    renderer.render(newAds, store.getState().currentLayout, 
      store.getState().containerWidth, handleAdClick);
  }

  function handleResize(newWidth, newHeight) {
    const state = store.getState();
    const newLayout = calculateOptimalLayout(newWidth, newHeight, config.layout, config.orientation);
    const newAdCount = calculateOptimalAdCount(newWidth, config.maxAds, newHeight, config.orientation);
    
    store.setState({ 
      containerWidth: newWidth, 
      containerHeight: newHeight,
      currentLayout: newLayout
    });
    
    // Recalcule le nombre d'annonces et re-rend
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
      refresh: () => refresh(adsClient, config.clientId, renderer, securityService),
      getStats: () => ({ ads: store.getState().ads.length }),
      rgpdService, trackingService,
      destroy: () => cleanup(cleanupResize, trackingService, rotationService)
    };
  }

  store.setState({ loadTime: Date.now(), ads });
  return createServices();
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

async function refresh(client, clientId, renderer, security) {
  renderer.showLoading(3, LAYOUTS.GRID);
  const ads = await loadAds(client, clientId, 5, security);
  renderer.render(ads, LAYOUTS.GRID, 800, () => {});
}

function cleanup(resizeCleanup, tracking, rotation) {
  resizeCleanup?.();
  tracking?.destroy();
  rotation?.destroy();
}
