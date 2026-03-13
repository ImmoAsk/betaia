/**
 * Point d'entree principal du widget
 * @module core/widget
 */

import { NAMESPACE, WIDGET_SELECTOR, DEFAULT_CONTAINER_ID } from './constants.js';
import { createPublicApi, exposePublicApi, isWidgetLoaded } from '../api/publicApi.js';
import { initializeWidgetInstance } from './initializer.js';

/**
 * Bootstrap du widget multi-instance
 */
function bootstrap() {
  if (isWidgetLoaded()) {
    console.warn('[ImmoAsk] Widget deja charge');
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

/**
 * Initialise toutes les instances du widget
 */
async function init() {
  try {
    const containers = document.querySelectorAll(WIDGET_SELECTOR);

    if (containers.length === 0) {
      const legacy = document.getElementById(DEFAULT_CONTAINER_ID);
      if (legacy) {
        legacy.setAttribute('data-immoask', '');
        return initSingle(legacy);
      }
      console.warn('[ImmoAsk] Aucun conteneur [data-immoask] trouve');
      return;
    }

    console.log(`[ImmoAsk] ${containers.length} instance(s) detectee(s)`);

    const results = await Promise.allSettled(
      Array.from(containers, (container) => initializeWidgetInstance(container))
    );
    const instances = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    results
      .filter((result) => result.status === 'rejected')
      .forEach((result) => {
        console.error('[ImmoAsk] Erreur instance:', result.reason?.message || result.reason);
      });

    if (instances.length > 0) {
      const api = createPublicApi(instances[0]);
      api.instances = instances;
      exposePublicApi(api);
    }
  } catch (error) {
    console.error('[ImmoAsk] Erreur initialisation:', error.message);
  }
}

/**
 * Initialise une seule instance (fallback)
 */
async function initSingle(container) {
  const services = await initializeWidgetInstance(container);
  const api = createPublicApi(services);
  exposePublicApi(api);
}

bootstrap();
