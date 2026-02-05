/**
 * Point d'entree principal du widget
 * @module core/widget
 */

import { extractConfigFromScript, createConfig } from './config.js';
import { getStore } from './state.js';
import { NAMESPACE, DEFAULT_CONTAINER_ID } from './constants.js';
import { resolveTheme } from '../adapters/themeDetector.js';
import { measureContainer, calculateOptimalAdCount, calculateOptimalLayout } from '../adapters/spaceDetector.js';
import { createSecurityService } from '../security/securityService.js';
import { createRGPDService } from '../rgpd/rgpdService.js';
import { createRenderer } from '../rendering/renderer.js';
import { createTrackingService } from '../tracking/trackingService.js';
import { createRotationService } from '../rotation/rotationService.js';
import { createAdsClient } from '../api/adsClient.js';
import { createAdsCache } from '../api/adsCache.js';
import { createEndpoints, detectBaseUrl } from '../api/endpoints.js';
import { createPublicApi, exposePublicApi, isWidgetLoaded } from '../api/publicApi.js';
import { initializeWidget } from './initializer.js';

/**
 * Bootstrap du widget
 */
function bootstrap() {
  // Evite double chargement
  if (isWidgetLoaded()) {
    console.warn('[AnnoncesWidget] Widget deja charge');
    return;
  }

  // Attend que le DOM soit pret
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

/**
 * Initialise le widget
 */
async function init() {
  try {
    const services = await initializeWidget();
    const api = createPublicApi(services);
    exposePublicApi(api);
  } catch (error) {
    console.error('[AnnoncesWidget] Erreur initialisation:', error.message);
  }
}

// Lance le bootstrap
bootstrap();
