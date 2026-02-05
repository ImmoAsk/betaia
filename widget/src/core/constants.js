/**
 * Constantes globales du widget
 * @module core/constants
 */

// Version du widget
export const VERSION = '1.0.0';

// Namespace global pour eviter les collisions
export const NAMESPACE = '__AnnoncesWidget__';

// Selecteur par defaut du conteneur
export const DEFAULT_CONTAINER_ID = 'annonces-widget';

// Configuration des seuils d'adaptation
export const BREAKPOINTS = {
  XS: 300,
  SM: 600,
  MD: 900,
  LG: 1200
};

// Nombre d'annonces par breakpoint
export const ADS_PER_BREAKPOINT = {
  XS: 1,
  SM: 2,
  MD: 3,
  LG: 5
};

// Layouts disponibles
export const LAYOUTS = {
  CARD: 'card',
  LIST: 'list',
  GRID: 'grid',
  CAROUSEL: 'carousel',
  AUTO: 'auto'
};

// Themes disponibles
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Timing pour le tracking (en ms)
export const TIMING = {
  IMPRESSION_THRESHOLD: 1000,
  VISIBILITY_THRESHOLD: 0.5,
  ROTATION_DELAY: 30000,
  BATCH_INTERVAL: 5000,
  DEBOUNCE_DELAY: 150,
  THROTTLE_DELAY: 100,
  CLICK_FRAUD_THRESHOLD: 500
};

// Limites de securite
export const LIMITS = {
  MAX_ADS: 10,
  MIN_ADS: 1,
  MAX_CACHE_ITEMS: 100,
  MAX_QUEUE_SIZE: 50,
  MAX_RETRY_ATTEMPTS: 3,
  MAX_CLICKS_PER_MINUTE: 10
};

// Noms des cookies
export const COOKIES = {
  CONSENT: 'annonces_consent',
  SESSION: 'annonces_session'
};

// Cles de stockage
export const STORAGE_KEYS = {
  VIEWED_ADS: 'annonces_viewed',
  SESSION_DATA: 'annonces_session',
  CACHE: 'annonces_cache'
};
