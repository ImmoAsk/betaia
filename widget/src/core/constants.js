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

// Selecteur multi-instance
export const WIDGET_SELECTOR = '[data-immoask]';

// Configuration des seuils d'adaptation
export const BREAKPOINTS = {
  XS: 200,
  SM: 400,
  MD: 600,
  LG: 900
};

// Nombre d'annonces par breakpoint (dynamique selon espace)
export const ADS_PER_BREAKPOINT = {
  XS: 1,
  SM: 2,
  MD: 3,
  LG: 4
};

// Taille compacte des cartes
export const CARD_SIZES = {
  MINI_WIDTH: 120,
  MINI_HEIGHT: 130,
  COMPACT_WIDTH: 150,
  COMPACT_HEIGHT: 160,
  IMAGE_RATIO: 0.45
};

// Layouts disponibles
export const LAYOUTS = {
  CARD: 'card',
  LIST: 'list',
  GRID: 'grid',
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
  CLICK_FRAUD_THRESHOLD: 500,
  AUTO_SLIDE_INTERVAL: 5000,
  SLIDE_TRANSITION: 600
};

// Limites de securite
export const LIMITS = {
  MAX_ADS: 30,
  MIN_ADS: 1,
  MAX_CACHE_ITEMS: 100,
  MAX_QUEUE_SIZE: 50,
  MAX_RETRY_ATTEMPTS: 3,
  MAX_CLICKS_PER_MINUTE: 10
};

// Configuration grille par defaut
export const GRID_DEFAULTS = {
  MIN_ROWS: 1,
  MAX_ROWS: 6,
  MIN_COLS: 1,
  MAX_COLS: 6,
  ROTATION_INTERVAL: 5000,
  TRANSITION_DURATION: 600,
  FETCH_MULTIPLIER: 4
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
