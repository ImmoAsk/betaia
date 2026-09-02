/**
 * Endpoints API du widget betaia
 * @module api/endpoints
 */

// Configuration API betaia - URLs passees via proxy ou meta tags
const BETAIA_CONFIG = {
  API_BASE: '',
  IMAGE_BASE: ''
};

/**
 * Recupere la config depuis les meta tags ou attributs
 * @returns {Object} Configuration API
 */
function getApiConfig() {
  // Cherche d'abord dans les meta tags
  const apiMeta = document.querySelector('meta[name="betaia-api-url"]');
  const imgMeta = document.querySelector('meta[name="betaia-image-url"]');
  
  return {
    API_BASE: apiMeta?.content || BETAIA_CONFIG.API_BASE,
    IMAGE_BASE: imgMeta?.content || BETAIA_CONFIG.IMAGE_BASE
  };
}

function getWidgetScript() {
  return document.currentScript
    || document.querySelector('script[data-api-url]')
    || document.querySelector('script[src*="widget.js"]');
}

/**
 * Configuration des endpoints
 * @param {string} baseUrl - URL de base du serveur widget (legacy)
 * @returns {Object} Endpoints configures
 */
export function createEndpoints(baseUrl) {
  return Object.freeze({
    // API GraphQL betaia pour les annonces
    ads: BETAIA_CONFIG.API_BASE,
    
    // URL de base des images
    images: BETAIA_CONFIG.IMAGE_BASE
  });
}

/**
 * Construit la query GraphQL pour les annonces
 * @param {Object} params - Parametres de filtrage
 * @returns {string} Query GraphQL encodee
 */
export function buildAdsQuery(params = {}) {
  const { usage = 1, limit = 6, status = 1 } = params;
  const query = `{
    getPropertiesByKeyWords(
      orderBy:{column:NUO,order:DESC},
      limit:${limit},
      usage:${usage},
      statut:${status}
    ) {
      nuo, titre, cout_mensuel, cout_vente, surface, piece,
      visuels { uri, position },
      quartier { denomination, minus_denomination },
      ville { denomination },
      offre { denomination },
      categorie_propriete { denomination },
      pays { code }
    }
  }`;
  return encodeURIComponent(query);
}

/**
 * Construit l'URL complete de l'image
 * @param {string} uri - URI relative
 * @returns {string} URL complete
 */
export function getImageUrl(uri) {
  if (!uri) return '';
  if (uri.startsWith('http')) return uri;
  return `${BETAIA_CONFIG.IMAGE_BASE}${uri}`;
}

/**
 * Determine l'URL de base depuis le script
 * @returns {string} URL de base detectee
 */
export function detectBaseUrl() {
  try {
    const script = getWidgetScript();
    
    if (script && script.src) {
      const url = new URL(script.src);
      return `${url.protocol}//${url.host}`;
    }
  } catch (e) {
    // Ignore les erreurs
  }
  
  // Fallback sur l'origine actuelle
  return window.location.origin;
}

/**
 * Valide une URL d'endpoint
 * @param {string} url - URL a valider
 * @returns {boolean} URL valide
 */
export function isValidEndpoint(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (e) {
    return false;
  }
}
