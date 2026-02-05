/**
 * Annonces Widget v1.0.0
 * Bundle genere le 2026-02-05T18:23:13.958Z
 * 
 * INTEGRATION :
 * <div id="annonces-widget"></div>
 * <script async src="https://tonsite.com/widget.js" data-id="CLIENT_ID"></script>
 * 
 * OPTIONS :
 * - data-max-ads : [1-10] Nombre max d'annonces
 * - data-theme : "light" | "dark" | "auto"
 * - data-layout : "card" | "list" | "grid" | "carousel" | "auto"
 * - data-no-tracking : Desactive le tracking
 * 
 * API PUBLIQUE :
 * - window.__AnnoncesWidget__.refresh()
 * - window.__AnnoncesWidget__.getStats()
 * - window.__AnnoncesWidget__.giveConsent()
 * - window.__AnnoncesWidget__.revokeConsent()
 * 
 * BROWSER SUPPORT : Chrome 90+, Firefox 88+, Safari 14+
 */
(function() {
"use strict";

// === core/constants.js ===
/**
 * Constantes globales du widget
 * @module core/constants
 */

// Version du widget
const VERSION = '1.0.0';

// Namespace global pour eviter les collisions
const NAMESPACE = '__AnnoncesWidget__';

// Selecteur par defaut du conteneur
const DEFAULT_CONTAINER_ID = 'annonces-widget';

// Configuration des seuils d'adaptation
const BREAKPOINTS = {
  XS: 300,
  SM: 600,
  MD: 900,
  LG: 1200
};

// Nombre d'annonces par breakpoint
const ADS_PER_BREAKPOINT = {
  XS: 1,
  SM: 2,
  MD: 3,
  LG: 5
};

// Layouts disponibles
const LAYOUTS = {
  CARD: 'card',
  LIST: 'list',
  GRID: 'grid',
  CAROUSEL: 'carousel',
  AUTO: 'auto'
};

// Themes disponibles
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Timing pour le tracking (en ms)
const TIMING = {
  IMPRESSION_THRESHOLD: 1000,
  VISIBILITY_THRESHOLD: 0.5,
  ROTATION_DELAY: 30000,
  BATCH_INTERVAL: 5000,
  DEBOUNCE_DELAY: 150,
  THROTTLE_DELAY: 100,
  CLICK_FRAUD_THRESHOLD: 500
};

// Limites de securite
const LIMITS = {
  MAX_ADS: 10,
  MIN_ADS: 1,
  MAX_CACHE_ITEMS: 100,
  MAX_QUEUE_SIZE: 50,
  MAX_RETRY_ATTEMPTS: 3,
  MAX_CLICKS_PER_MINUTE: 10
};

// Noms des cookies
const COOKIES = {
  CONSENT: 'annonces_consent',
  SESSION: 'annonces_session'
};

// Cles de stockage
const STORAGE_KEYS = {
  VIEWED_ADS: 'annonces_viewed',
  SESSION_DATA: 'annonces_session',
  CACHE: 'annonces_cache'
};

// === utils/uuid.js ===
/**
 * Generateur d'identifiants uniques
 * @module utils/uuid
 */

/**
 * Genere un UUID v4
 * @returns {string} UUID unique
 */
function generateUUID() {
  // Utilise crypto.randomUUID si disponible
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback avec crypto.getRandomValues
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    
    // Ajuste les bits pour UUID v4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32)
    ].join('-');
  }

  // Dernier fallback (moins securise)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Genere un identifiant court
 * @param {number} length - Longueur souhaitee
 * @returns {string} Identifiant court
 */
function generateShortId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map(b => chars[b % chars.length])
      .join('');
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Genere un hash simple d'une chaine
 * @param {string} str - Chaine a hasher
 * @returns {string} Hash hexadecimal
 */
function simpleHash(str) {
  let hash = 0;
  if (str.length === 0) return hash.toString(16);
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Conversion en 32bit integer
  }
  
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// === utils/dom.js ===
/**
 * Utilitaires DOM securises
 * @module utils/dom
 */

/**
 * Echappe les caracteres HTML pour prevenir XSS
 * @param {string} str - Chaine a echapper
 * @returns {string} Chaine echappee
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;'
  };
  return str.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Cree un element DOM de maniere securisee
 * @param {string} tag - Nom de la balise
 * @param {Object} attrs - Attributs a appliquer
 * @param {string|Node[]} children - Contenu enfant
 * @returns {HTMLElement} Element cree
 */
function createElement(tag, attrs = {}, children = null) {
  const el = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('data-')) {
      el.setAttribute(key, escapeHtml(String(value)));
    } else if (key === 'textContent') {
      el.textContent = value;
    } else {
      el.setAttribute(key, escapeHtml(String(value)));
    }
  });

  if (children) {
    if (typeof children === 'string') {
      el.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Node) el.appendChild(child);
      });
    }
  }

  return el;
}

/**
 * Requete animationFrame avec fallback
 * @param {Function} callback - Fonction a executer
 * @returns {number} ID de la frame
 */
function requestFrame(callback) {
  return (window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame ||
    (cb => setTimeout(cb, 16)))(callback);
}

/**
 * Annule une frame demandee
 * @param {number} id - ID de la frame
 */
function cancelFrame(id) {
  (window.cancelAnimationFrame || 
    window.webkitCancelAnimationFrame ||
    clearTimeout)(id);
}

// === utils/timing.js ===
/**
 * Utilitaires de timing (debounce, throttle)
 * @module utils/timing
 */

/**
 * Cree une fonction debounced
 * @param {Function} fn - Fonction a debouncer
 * @param {number} delay - Delai en ms
 * @returns {Function} Fonction debounced avec methode cancel
 */
function debounce(fn, delay) {
  let timeoutId = null;

  function debounced(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Cree une fonction throttled
 * @param {Function} fn - Fonction a throttler
 * @param {number} limit - Intervalle minimum en ms
 * @returns {Function} Fonction throttled
 */
function throttle(fn, limit) {
  let lastCall = 0;
  let timeoutId = null;

  function throttled(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttled;
}

/**
 * Attend un delai specifique
 * @param {number} ms - Delai en millisecondes
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute une fonction avec timeout
 * @param {Function} fn - Fonction a executer
 * @param {number} timeout - Timeout en ms
 * @returns {Promise<any>} Resultat ou erreur timeout
 */
function withTimeout(fn, timeout) {
  return Promise.race([
    fn(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// === utils/storage.js ===
/**
 * Utilitaires de stockage (SessionStorage avec fallback)
 * @module utils/storage
 */


/**
 * Verifie si le storage est disponible
 * @param {string} type - 'localStorage' ou 'sessionStorage'
 * @returns {boolean} Disponibilite
 */
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Cache memoire en fallback
const memoryCache = new Map();

/**
 * Recupere une valeur du storage
 * @param {string} key - Cle de stockage
 * @returns {any} Valeur parsee ou null
 */
function getItem(key) {
  try {
    if (isStorageAvailable('sessionStorage')) {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return memoryCache.get(key) || null;
  } catch (e) {
    return memoryCache.get(key) || null;
  }
}

/**
 * Stocke une valeur
 * @param {string} key - Cle de stockage
 * @param {any} value - Valeur a stocker
 */
function setItem(key, value) {
  try {
    const serialized = JSON.stringify(value);
    if (isStorageAvailable('sessionStorage')) {
      sessionStorage.setItem(key, serialized);
    }
    memoryCache.set(key, value);
  } catch (e) {
    memoryCache.set(key, value);
  }
}

/**
 * Supprime une valeur
 * @param {string} key - Cle de stockage
 */
function removeItem(key) {
  try {
    if (isStorageAvailable('sessionStorage')) {
      sessionStorage.removeItem(key);
    }
    memoryCache.delete(key);
  } catch (e) {
    memoryCache.delete(key);
  }
}

/**
 * Gere le cache des annonces avec limite de taille
 * @param {string} adId - ID de l'annonce
 * @param {Object} data - Donnees a cacher
 */
function cacheAd(adId, data) {
  const cache = getItem(STORAGE_KEYS.CACHE) || {};
  const keys = Object.keys(cache);
  
  // Supprime les plus anciennes si limite atteinte
  if (keys.length >= LIMITS.MAX_CACHE_ITEMS) {
    const oldestKey = keys[0];
    delete cache[oldestKey];
  }
  
  cache[adId] = { data, timestamp: Date.now() };
  setItem(STORAGE_KEYS.CACHE, cache);
}

/**
 * Recupere une annonce du cache
 * @param {string} adId - ID de l'annonce
 * @returns {Object|null} Donnees cachees ou null
 */
function getCachedAd(adId) {
  const cache = getItem(STORAGE_KEYS.CACHE) || {};
  return cache[adId]?.data || null;
}

// === adapters/colorPalettes.js ===
/**
 * Palettes de couleurs pour les themes
 * @module adapters/colorPalettes
 */

/**
 * Palette pour le mode clair
 */
const lightPalette = {
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F5',
  border: '#E0E0E0',
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  accent: '#0066CC',
  accentHover: '#0052A3',
  success: '#28A745',
  error: '#DC3545',
  shadow: 'rgba(0, 0, 0, 0.1)'
};

/**
 * Palette pour le mode sombre
 */
const darkPalette = {
  background: '#1A1A1A',
  backgroundAlt: '#2A2A2A',
  border: '#404040',
  text: '#E0E0E0',
  textSecondary: '#B0B0B0',
  textMuted: '#808080',
  accent: '#4DA6FF',
  accentHover: '#66B3FF',
  success: '#34D058',
  error: '#F85149',
  shadow: 'rgba(0, 0, 0, 0.3)'
};

/**
 * Recupere la palette appropriee selon le theme
 * @param {string} theme - 'light' ou 'dark'
 * @returns {Object} Palette de couleurs
 */
function getPalette(theme) {
  return theme === 'dark' ? darkPalette : lightPalette;
}

/**
 * Genere les variables CSS pour une palette
 * @param {Object} palette - Palette de couleurs
 * @param {string} prefix - Prefixe des variables CSS
 * @returns {string} CSS variables
 */
function generateCSSVariables(palette, prefix = 'aw') {
  return Object.entries(palette)
    .map(([key, value]) => `--${prefix}-${kebabCase(key)}: ${value};`)
    .join('\n');
}

/**
 * Convertit camelCase en kebab-case
 * @param {string} str - Chaine en camelCase
 * @returns {string} Chaine en kebab-case
 */
function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Fusionne une palette avec des couleurs personnalisees
 * @param {Object} basePalette - Palette de base
 * @param {Object} customColors - Couleurs personnalisees
 * @returns {Object} Palette fusionnee
 */
function mergePalette(basePalette, customColors) {
  const merged = { ...basePalette };
  
  Object.entries(customColors).forEach(([key, value]) => {
    if (value && merged.hasOwnProperty(key)) {
      merged[key] = value;
    }
  });
  
  return merged;
}

// === adapters/themeDetector.js ===
/**
 * Detecteur de theme (clair/sombre) du site hote
 * @module adapters/themeDetector
 */


/**
 * Detecte le theme prefere via media query
 * @returns {string} 'light' ou 'dark'
 */
function detectPreferredColorScheme() {
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK;
  }
  return THEMES.LIGHT;
}

/**
 * Calcule la luminosite d'une couleur RGB
 * @param {number} r - Rouge (0-255)
 * @param {number} g - Vert (0-255)
 * @param {number} b - Bleu (0-255)
 * @returns {number} Luminosite (0-1)
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse une couleur CSS en RGB
 * @param {string} color - Couleur CSS
 * @returns {Object|null} {r, g, b} ou null
 */
function parseColor(color) {
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null;
  
  // Match rgb/rgba
  const rgbMatch = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
  }
  
  // Fallback canvas
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b };
  } catch (e) {
    return null;
  }
}

/**
 * Convertit RGB en hex
 * @param {Object} rgb - {r, g, b}
 * @returns {string} Couleur hex
 */
function rgbToHex(rgb) {
  if (!rgb) return null;
  return '#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('');
}

/**
 * Detecte le theme du site hote en analysant les couleurs
 * @returns {string} 'light' ou 'dark'
 */
function detectSiteTheme() {
  try {
    const body = document.body;
    const computedStyle = getComputedStyle(body);
    const bgColor = computedStyle.backgroundColor;
    
    const rgb = parseColor(bgColor);
    if (rgb) {
      const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
      return luminance > 0.5 ? THEMES.LIGHT : THEMES.DARK;
    }
  } catch (e) {
    // Ignore les erreurs
  }
  
  return detectPreferredColorScheme();
}

/**
 * Extrait les variables CSS du site hote
 * @returns {Object} Variables CSS detectees
 */
function extractCSSVariables() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  
  // Liste des noms de variables communes
  const varNames = [
    '--primary-color', '--primary', '--color-primary',
    '--secondary-color', '--secondary', '--color-secondary',
    '--accent-color', '--accent', '--color-accent',
    '--text-color', '--text', '--color-text',
    '--background-color', '--background', '--bg-color', '--color-bg'
  ];
  
  const vars = {};
  varNames.forEach(name => {
    const value = style.getPropertyValue(name).trim();
    if (value) {
      const key = name.replace(/^--|color-/g, '').replace(/-/g, '_');
      vars[key] = value;
    }
  });
  
  return vars;
}

/**
 * Extrait les couleurs dominantes du site hote
 * @returns {Object} Couleurs detectees
 */
function extractSiteColors() {
  const colors = {
    background: null,
    text: null,
    primary: null,
    border: null
  };
  
  try {
    const body = document.body;
    const bodyStyle = getComputedStyle(body);
    
    // Background
    const bgRgb = parseColor(bodyStyle.backgroundColor);
    colors.background = rgbToHex(bgRgb);
    
    // Text
    const textRgb = parseColor(bodyStyle.color);
    colors.text = rgbToHex(textRgb);
    
    // Cherche une couleur primaire dans les liens ou boutons
    const link = document.querySelector('a[href]');
    if (link) {
      const linkRgb = parseColor(getComputedStyle(link).color);
      colors.primary = rgbToHex(linkRgb);
    }
    
    // Bordure depuis un element quelconque
    const bordered = document.querySelector('[style*="border"], .card, .panel, article');
    if (bordered) {
      const borderRgb = parseColor(getComputedStyle(bordered).borderColor);
      colors.border = rgbToHex(borderRgb);
    }
    
    // Variables CSS en priorite
    const cssVars = extractCSSVariables();
    if (cssVars.primary) colors.primary = cssVars.primary;
    if (cssVars.background) colors.background = cssVars.background;
    if (cssVars.text) colors.text = cssVars.text;
    
  } catch (e) {
    // Ignore les erreurs
  }
  
  return colors;
}

/**
 * Determine le theme final a appliquer
 * @param {string} configTheme - Theme configure par l'utilisateur
 * @returns {string} Theme final
 */
function resolveTheme(configTheme) {
  if (configTheme && configTheme !== THEMES.AUTO) {
    return configTheme;
  }
  return detectSiteTheme();
}

// === adapters/deviceDetector.js ===
/**
 * Detecteur de type d'appareil et capacites
 * @module adapters/deviceDetector
 */

/**
 * Detecte le type d'appareil
 * @returns {string} 'mobile', 'tablet', ou 'desktop'
 */
function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  
  // Detection mobile via user agent
  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTabletUA = /ipad|tablet|playbook|silk/i.test(ua);
  
  // Detection via taille d'ecran
  const isMobileSize = width < 768;
  const isTabletSize = width >= 768 && width < 1024;
  
  if (isTabletUA || (isMobileUA && isTabletSize)) {
    return 'tablet';
  }
  
  if (isMobileUA || isMobileSize) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Recupere les informations sur le navigateur
 * @returns {Object} {name, version}
 */
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = '0';
  
  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.split('Firefox/')[1]?.split(' ')[0] || '0';
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.split('Edg/')[1]?.split(' ')[0] || '0';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.split('Chrome/')[1]?.split(' ')[0] || '0';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.split('Version/')[1]?.split(' ')[0] || '0';
  }
  
  return { name, version };
}

/**
 * Recupere les informations sur le systeme d'exploitation
 * @returns {string} Nom du systeme
 */
function getOSInfo() {
  const ua = navigator.userAgent;
  
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  
  return 'unknown';
}

/**
 * Recupere les dimensions de l'ecran et du viewport
 * @returns {Object} Dimensions
 */
function getScreenInfo() {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}

/**
 * Verifie si l'appareil supporte le touch
 * @returns {boolean} Support tactile
 */
function hasTouchSupport() {
  return 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
}

// === adapters/spaceDetector.js ===
/**
 * Detecteur de dimensions et espace disponible
 * @module adapters/spaceDetector
 */



/**
 * Mesure les dimensions d'un conteneur
 * @param {HTMLElement} container - Element conteneur
 * @returns {Object} {width, height}
 */
function measureContainer(container) {
  if (!container) {
    return { width: 0, height: 0 };
  }
  
  const rect = container.getBoundingClientRect();
  return {
    width: Math.floor(rect.width),
    height: Math.floor(rect.height)
  };
}

/**
 * Determine le nombre optimal d'annonces selon la largeur
 * @param {number} width - Largeur en pixels
 * @param {number|null} maxAds - Limite configuree
 * @returns {number} Nombre d'annonces
 */
function calculateOptimalAdCount(width, maxAds = null) {
  let count;
  
  if (width < BREAKPOINTS.XS) {
    count = ADS_PER_BREAKPOINT.XS;
  } else if (width < BREAKPOINTS.SM) {
    count = ADS_PER_BREAKPOINT.SM;
  } else if (width < BREAKPOINTS.MD) {
    count = ADS_PER_BREAKPOINT.MD;
  } else {
    count = ADS_PER_BREAKPOINT.LG;
  }
  
  // Applique la limite configuree si presente
  if (maxAds !== null && maxAds > 0) {
    count = Math.min(count, maxAds);
  }
  
  return count;
}

/**
 * Determine le layout optimal selon les dimensions
 * @param {number} width - Largeur en pixels
 * @param {number} height - Hauteur en pixels
 * @param {string} configLayout - Layout configure
 * @returns {string} Layout optimal
 */
function calculateOptimalLayout(width, height, configLayout) {
  // Si un layout specifique est configure, l'utiliser
  if (configLayout && configLayout !== LAYOUTS.AUTO) {
    return configLayout;
  }
  
  // Layout automatique selon les dimensions
  if (width < BREAKPOINTS.XS) {
    return LAYOUTS.LIST;
  }
  
  if (width < BREAKPOINTS.SM) {
    return LAYOUTS.CARD;
  }
  
  if (width < BREAKPOINTS.MD) {
    return height > 400 ? LAYOUTS.GRID : LAYOUTS.CAROUSEL;
  }
  
  // Grande largeur
  return LAYOUTS.GRID;
}

/**
 * Cree un observateur de redimensionnement
 * @param {HTMLElement} element - Element a observer
 * @param {Function} callback - Callback (width, height) => void
 * @returns {Function} Fonction de cleanup
 */
function createResizeObserver(element, callback) {
  const debouncedCallback = debounce((entries) => {
    const entry = entries[0];
    if (entry) {
      const { width, height } = entry.contentRect;
      callback(Math.floor(width), Math.floor(height));
    }
  }, 150);

  const observer = new ResizeObserver(debouncedCallback);
  observer.observe(element);

  return () => {
    debouncedCallback.cancel();
    observer.disconnect();
  };
}

// === tracking/eventTypes.js ===
/**
 * Types d'evenements de tracking
 * @module tracking/eventTypes
 */

/**
 * Enumeration des types d'evenements
 */
const EventTypes = {
  // Evenements d'affichage
  IMPRESSION: 'impression',
  VIEW_DURATION: 'view_duration',
  
  // Evenements d'interaction
  CLICK: 'click',
  HOVER: 'hover',
  SCROLL_DEPTH: 'scroll_depth',
  
  // Evenements de comportement
  ENGAGEMENT_SCORE: 'engagement_score',
  BOUNCE: 'bounce',
  ROTATION: 'rotation',
  
  // Evenements systeme
  WIDGET_LOAD: 'widget_load',
  WIDGET_ERROR: 'widget_error',
  API_ERROR: 'api_error'
};

/**
 * Niveaux de priorite des evenements
 */
const EventPriority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
};

/**
 * Map des priorites par type d'evenement
 */
const EventPriorityMap = {
  [EventTypes.IMPRESSION]: EventPriority.MEDIUM,
  [EventTypes.VIEW_DURATION]: EventPriority.LOW,
  [EventTypes.CLICK]: EventPriority.CRITICAL,
  [EventTypes.HOVER]: EventPriority.LOW,
  [EventTypes.SCROLL_DEPTH]: EventPriority.LOW,
  [EventTypes.ENGAGEMENT_SCORE]: EventPriority.MEDIUM,
  [EventTypes.BOUNCE]: EventPriority.MEDIUM,
  [EventTypes.ROTATION]: EventPriority.LOW,
  [EventTypes.WIDGET_LOAD]: EventPriority.HIGH,
  [EventTypes.WIDGET_ERROR]: EventPriority.HIGH,
  [EventTypes.API_ERROR]: EventPriority.HIGH
};

/**
 * Verifie si un evenement est critique
 * @param {string} eventType - Type d'evenement
 * @returns {boolean} True si critique
 */
function isCriticalEvent(eventType) {
  return EventPriorityMap[eventType] === EventPriority.CRITICAL;
}

/**
 * Verifie si un evenement est haute priorite
 * @param {string} eventType - Type d'evenement
 * @returns {boolean} True si haute priorite ou plus
 */
function isHighPriorityEvent(eventType) {
  const priority = EventPriorityMap[eventType];
  return priority >= EventPriority.HIGH;
}

// === tracking/eventFactory.js ===
/**
 * Factory pour creer des evenements de tracking
 * @module tracking/eventFactory
 */



/**
 * Cree un evenement de base
 * @param {string} type - Type d'evenement
 * @param {Object} data - Donnees de l'evenement
 * @returns {Object} Evenement formate
 */
function createBaseEvent(type, data = {}) {
  return {
    id: generateShortId(12),
    type,
    ts: Date.now(),
    ...data
  };
}

/**
 * Cree un evenement d'impression
 * @param {string} adId - ID de l'annonce
 * @param {number} visibilityRatio - Ratio de visibilite (0-1)
 * @returns {Object} Evenement d'impression
 */
function createImpressionEvent(adId, visibilityRatio) {
  return createBaseEvent(EventTypes.IMPRESSION, {
    aid: adId,
    vr: Math.round(visibilityRatio * 100) / 100
  });
}

/**
 * Cree un evenement de duree de vue
 * @param {string} adId - ID de l'annonce
 * @param {number} duration - Duree en ms
 * @returns {Object} Evenement de duree
 */
function createViewDurationEvent(adId, duration) {
  return createBaseEvent(EventTypes.VIEW_DURATION, {
    aid: adId,
    dur: Math.round(duration)
  });
}

/**
 * Cree un evenement de clic
 * @param {string} adId - ID de l'annonce
 * @param {Object} position - Position {x, y}
 * @returns {Object} Evenement de clic
 */
function createClickEvent(adId, position) {
  return createBaseEvent(EventTypes.CLICK, {
    aid: adId,
    pos: { x: Math.round(position.x), y: Math.round(position.y) }
  });
}

/**
 * Cree un evenement de survol
 * @param {string} adId - ID de l'annonce
 * @param {number} duration - Duree du survol en ms
 * @returns {Object} Evenement de survol
 */
function createHoverEvent(adId, duration) {
  return createBaseEvent(EventTypes.HOVER, {
    aid: adId,
    dur: Math.round(duration)
  });
}

/**
 * Cree un evenement de profondeur de scroll
 * @param {string} adId - ID de l'annonce
 * @param {number} depth - Profondeur (0-1)
 * @returns {Object} Evenement de scroll
 */
function createScrollDepthEvent(adId, depth) {
  return createBaseEvent(EventTypes.SCROLL_DEPTH, {
    aid: adId,
    depth: Math.round(depth * 100) / 100
  });
}

/**
 * Cree un evenement de score d'engagement
 * @param {string} adId - ID de l'annonce
 * @param {number} score - Score calcule
 * @returns {Object} Evenement d'engagement
 */
function createEngagementScoreEvent(adId, score) {
  return createBaseEvent(EventTypes.ENGAGEMENT_SCORE, {
    aid: adId,
    score: Math.round(score * 100) / 100
  });
}

/**
 * Cree un evenement de rotation
 * @param {string} fromAdId - ID annonce precedente
 * @param {string} toAdId - ID nouvelle annonce
 * @param {string} reason - Raison de la rotation
 * @returns {Object} Evenement de rotation
 */
function createRotationEvent(fromAdId, toAdId, reason) {
  return createBaseEvent(EventTypes.ROTATION, {
    from: fromAdId,
    to: toAdId,
    reason
  });
}

// === tracking/eventQueue.js ===
/**
 * Queue d'evenements avec gestion asynchrone
 * @module tracking/eventQueue
 */



/**
 * Cree une queue d'evenements
 * @param {Function} flushCallback - Callback (events) => Promise
 * @returns {Object} Queue avec methodes add, flush, destroy
 */
function createEventQueue(flushCallback) {
  const queue = [];
  let flushTimer = null;
  let isDestroyed = false;

  /**
   * Planifie un flush automatique
   */
  function scheduleFlush() {
    if (flushTimer || isDestroyed) return;
    
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flush();
    }, TIMING.BATCH_INTERVAL);
  }

  /**
   * Ajoute un evenement a la queue
   * @param {Object} event - Evenement a ajouter
   */
  function add(event) {
    if (isDestroyed) return;
    
    queue.push(event);
    
    // Envoi immediat pour evenements critiques
    if (isCriticalEvent(event.type)) {
      flush();
      return;
    }
    
    // Envoi si limite atteinte
    if (queue.length >= LIMITS.MAX_QUEUE_SIZE) {
      flush();
      return;
    }
    
    scheduleFlush();
  }

  /**
   * Envoie tous les evenements en attente
   * @returns {Promise<boolean>} Succes de l'envoi
   */
  async function flush() {
    if (queue.length === 0 || isDestroyed) return true;
    
    // Copie et vide la queue
    const events = queue.splice(0, queue.length);
    
    try {
      await flushCallback(events);
      return true;
    } catch (error) {
      // Remet les evenements haute priorite dans la queue
      const highPriority = events.filter(e => isHighPriorityEvent(e.type));
      queue.unshift(...highPriority);
      return false;
    }
  }

  /**
   * Recupere les evenements en attente (pour sendBeacon)
   * @returns {Object[]} Evenements en attente
   */
  function getPendingEvents() {
    return [...queue];
  }

  /**
   * Vide la queue sans envoi
   */
  function clear() {
    queue.length = 0;
  }

  /**
   * Detruit la queue proprement
   */
  function destroy() {
    isDestroyed = true;
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    flush(); // Dernier envoi
    clear();
  }

  return Object.freeze({
    add,
    flush,
    getPendingEvents,
    clear,
    destroy,
    get size() { return queue.length; }
  });
}

// === tracking/eventSender.js ===
/**
 * Expediteur d'evenements vers le serveur
 * @module tracking/eventSender
 */


/**
 * Cree un expediteur d'evenements
 * @param {string} endpoint - URL de l'API de tracking
 * @returns {Object} Sender avec methodes send, sendBeacon
 */
function createEventSender(endpoint) {
  let retryCount = 0;

  /**
   * Envoie des evenements via fetch
   * @param {Object} payload - Donnees a envoyer
   * @returns {Promise<boolean>} Succes de l'envoi
   */
  async function send(payload) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'omit',
        keepalive: true
      });

      if (response.ok) {
        retryCount = 0;
        return true;
      }

      return await handleRetry(payload);
    } catch (error) {
      return await handleRetry(payload);
    }
  }

  /**
   * Gere les retries avec backoff exponentiel
   * @param {Object} payload - Donnees a renvoyer
   * @returns {Promise<boolean>} Succes du retry
   */
  async function handleRetry(payload) {
    if (retryCount >= LIMITS.MAX_RETRY_ATTEMPTS) {
      retryCount = 0;
      return false;
    }

    retryCount++;
    const backoffDelay = Math.pow(2, retryCount) * 1000;
    
    await new Promise(resolve => setTimeout(resolve, backoffDelay));
    return send(payload);
  }

  /**
   * Envoie des evenements via sendBeacon (pour unload)
   * @param {Object} payload - Donnees a envoyer
   * @returns {boolean} Succes de l'envoi
   */
  function sendViaBeacon(payload) {
    if (!navigator.sendBeacon) {
      return false;
    }

    const blob = new Blob(
      [JSON.stringify(payload)],
      { type: 'application/json' }
    );

    return navigator.sendBeacon(endpoint, blob);
  }

  /**
   * Envoie avec fallback automatique
   * @param {Object} payload - Donnees a envoyer
   * @param {boolean} useBeacon - Utiliser sendBeacon si possible
   * @returns {Promise<boolean>|boolean} Succes
   */
  function sendWithFallback(payload, useBeacon = false) {
    if (useBeacon && navigator.sendBeacon) {
      return sendViaBeacon(payload);
    }
    return send(payload);
  }

  return Object.freeze({
    send,
    sendViaBeacon,
    sendWithFallback
  });
}

// === tracking/contextCollector.js ===
/**
 * Collecteur de contexte de session
 * @module tracking/contextCollector
 */





/**
 * Genere ou recupere l'ID de session
 * @returns {string} Session ID
 */
function getSessionId() {
  let sessionData = getItem(STORAGE_KEYS.SESSION_DATA);
  
  if (!sessionData || !sessionData.sid) {
    sessionData = {
      sid: generateUUID(),
      started: Date.now()
    };
    setItem(STORAGE_KEYS.SESSION_DATA, sessionData);
  }
  
  return sessionData.sid;
}

/**
 * Genere un fingerprint leger de l'utilisateur
 * @returns {string} Fingerprint hash
 */
function generateFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform || 'unknown'
  ];
  
  return simpleHash(components.join('|'));
}

/**
 * Collecte le contexte complet de la session
 * @param {string} clientId - ID du client
 * @returns {Object} Contexte de session
 */
function collectSessionContext(clientId) {
  const browserInfo = getBrowserInfo();
  const screenInfo = getScreenInfo();
  
  return {
    cid: clientId,
    sid: getSessionId(),
    fp: generateFingerprint(),
    device: detectDeviceType(),
    browser: browserInfo.name,
    browserVer: browserInfo.version,
    os: getOSInfo(),
    sw: screenInfo.screenWidth,
    sh: screenInfo.screenHeight,
    vw: screenInfo.viewportWidth,
    vh: screenInfo.viewportHeight,
    pr: screenInfo.pixelRatio,
    lang: navigator.language || 'unknown',
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    ref: document.referrer || null,
    url: getAnonymizedUrl()
  };
}

/**
 * Recupere l'URL courante de maniere anonymisee
 * @returns {string|null} URL anonymisee
 */
function getAnonymizedUrl() {
  try {
    const url = new URL(window.location.href);
    // Supprime les parametres sensibles
    url.searchParams.delete('token');
    url.searchParams.delete('key');
    url.searchParams.delete('auth');
    url.searchParams.delete('password');
    url.searchParams.delete('email');
    return url.pathname + url.search;
  } catch (e) {
    return null;
  }
}

// === tracking/visibilityObserver.js ===
/**
 * Observateur de visibilite des annonces
 * @module tracking/visibilityObserver
 */



/**
 * Cree un observateur de visibilite pour les annonces
 * @param {Function} onImpression - Callback pour impression validee
 * @param {Function} onViewEnd - Callback pour fin de vue
 * @returns {Object} Observer avec methodes observe, unobserve, destroy
 */
function createVisibilityObserver(onImpression, onViewEnd) {
  // Map des annonces observees avec leurs timers
  const observedAds = new Map();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const adId = entry.target.dataset.adId;
      if (!adId) return;
      
      const adData = observedAds.get(adId) || createAdData();
      
      if (entry.isIntersecting && entry.intersectionRatio >= TIMING.VISIBILITY_THRESHOLD) {
        handleVisible(adId, adData, entry.intersectionRatio);
      } else {
        handleHidden(adId, adData);
      }
      
      observedAds.set(adId, adData);
    });
  }, {
    threshold: [0, 0.25, 0.5, 0.75, 1.0]
  });

  /**
   * Cree les donnees initiales pour une annonce
   * @returns {Object} Donnees de tracking
   */
  function createAdData() {
    return {
      visibleSince: null,
      impressionSent: false,
      impressionTimer: null,
      totalViewTime: 0
    };
  }

  /**
   * Gere l'apparition d'une annonce
   */
  function handleVisible(adId, adData, ratio) {
    if (adData.visibleSince === null) {
      adData.visibleSince = Date.now();
    }
    
    // Lance le timer pour valider l'impression
    if (!adData.impressionSent && !adData.impressionTimer) {
      adData.impressionTimer = setTimeout(() => {
        if (!adData.impressionSent) {
          adData.impressionSent = true;
          onImpression(createImpressionEvent(adId, ratio));
        }
      }, TIMING.IMPRESSION_THRESHOLD);
    }
  }

  /**
   * Gere la disparition d'une annonce
   */
  function handleHidden(adId, adData) {
    // Annule le timer d'impression si pas encore valide
    if (adData.impressionTimer) {
      clearTimeout(adData.impressionTimer);
      adData.impressionTimer = null;
    }
    
    // Calcule le temps de vue
    if (adData.visibleSince !== null) {
      const viewTime = Date.now() - adData.visibleSince;
      adData.totalViewTime += viewTime;
      adData.visibleSince = null;
      
      if (viewTime > 500) {
        onViewEnd(createViewDurationEvent(adId, viewTime));
      }
    }
  }

  return Object.freeze({
    observe: (element) => observer.observe(element),
    unobserve: (element) => observer.unobserve(element),
    getViewTime: (adId) => observedAds.get(adId)?.totalViewTime || 0,
    destroy: () => {
      observedAds.forEach(data => {
        if (data.impressionTimer) clearTimeout(data.impressionTimer);
      });
      observedAds.clear();
      observer.disconnect();
    }
  });
}

// === tracking/interactionObserver.js ===
/**
 * Observateur d'interactions utilisateur
 * @module tracking/interactionObserver
 */



/**
 * Cree un observateur d'interactions sur les annonces
 * @param {Function} onEvent - Callback pour les evenements d'interaction
 * @returns {Object} Observer avec methodes attach, detach, destroy
 */
function createInteractionObserver(onEvent) {
  const trackedElements = new WeakMap();
  const handlers = new Map();

  /**
   * Attache les listeners a un element d'annonce
   * @param {HTMLElement} element - Element annonce
   * @param {string} adId - ID de l'annonce
   */
  function attach(element, adId) {
    if (trackedElements.has(element)) return;

    const state = {
      hoverStart: null,
      maxScrollDepth: 0
    };

    // Handler de survol entree
    const handleMouseEnter = () => {
      state.hoverStart = Date.now();
    };

    // Handler de survol sortie
    const handleMouseLeave = () => {
      if (state.hoverStart) {
        const duration = Date.now() - state.hoverStart;
        if (duration > 100) {
          onEvent(createHoverEvent(adId, duration));
        }
        state.hoverStart = null;
      }
    };

    // Handler de scroll throttle
    const handleScroll = throttle(() => {
      const rect = element.getBoundingClientRect();
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calcul de la profondeur visible
      const visibleTop = Math.max(0, -rect.top);
      const depth = Math.min(1, visibleTop / elementHeight);
      
      if (depth > state.maxScrollDepth) {
        state.maxScrollDepth = depth;
        if (depth >= 0.25) {
          onEvent(createScrollDepthEvent(adId, depth));
        }
      }
    }, 200);

    // Handler de clic
    const handleClick = (event) => {
      const rect = element.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      onEvent(createClickEvent(adId, position));
    };

    // Attache les listeners
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Stocke les references pour cleanup
    const elementHandlers = {
      mouseenter: handleMouseEnter,
      mouseleave: handleMouseLeave,
      click: handleClick,
      scroll: handleScroll
    };

    trackedElements.set(element, state);
    handlers.set(element, elementHandlers);
  }

  /**
   * Detache les listeners d'un element
   * @param {HTMLElement} element - Element a detacher
   */
  function detach(element) {
    const elementHandlers = handlers.get(element);
    if (!elementHandlers) return;

    element.removeEventListener('mouseenter', elementHandlers.mouseenter);
    element.removeEventListener('mouseleave', elementHandlers.mouseleave);
    element.removeEventListener('click', elementHandlers.click);
    window.removeEventListener('scroll', elementHandlers.scroll);
    elementHandlers.scroll.cancel?.();

    handlers.delete(element);
    trackedElements.delete(element);
  }

  /**
   * Detruit l'observateur
   */
  function destroy() {
    handlers.forEach((_, element) => detach(element));
  }

  return Object.freeze({ attach, detach, destroy });
}

// === tracking/trackingService.js ===
/**
 * Service principal de tracking
 * @module tracking/trackingService
 */







/**
 * Cree le service de tracking complet
 * @param {Object} config - Configuration du widget
 * @param {string} trackingEndpoint - URL de l'API de tracking
 * @returns {Object} Service de tracking
 */
function createTrackingService(config, trackingEndpoint) {
  let isEnabled = !config.noTracking;
  let context = null;
  
  const sender = createEventSender(trackingEndpoint);
  const queue = createEventQueue(flushEvents);
  
  const visibilityObserver = createVisibilityObserver(
    (event) => { if (isEnabled) queue.add(event); },
    (event) => { if (isEnabled) queue.add(event); }
  );
  
  const interactionObserver = createInteractionObserver(
    (event) => { if (isEnabled) queue.add(event); }
  );

  /**
   * Initialise le service avec le contexte
   */
  function init() {
    context = collectSessionContext(config.clientId);
    setupUnloadHandler();
    setupVisibilityHandler();
  }

  /**
   * Formate et envoie les evenements
   * @param {Object[]} events - Evenements a envoyer
   * @returns {Promise<boolean>}
   */
  async function flushEvents(events) {
    if (events.length === 0 || !isEnabled) return true;
    
    const payload = {
      v: VERSION,
      ctx: context,
      events
    };
    
    return sender.send(payload);
  }

  /**
   * Configure le handler de fermeture de page
   */
  function setupUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      const pending = queue.getPendingEvents();
      if (pending.length > 0 && isEnabled) {
        sender.sendViaBeacon({
          v: VERSION,
          ctx: context,
          events: pending
        });
      }
    });
  }

  /**
   * Configure le handler de changement de visibilite
   */
  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        queue.flush();
      }
    });
  }

  /**
   * Observe une annonce pour le tracking
   * @param {HTMLElement} element - Element annonce
   * @param {string} adId - ID de l'annonce
   */
  function trackAd(element, adId) {
    element.dataset.adId = adId;
    visibilityObserver.observe(element);
    interactionObserver.attach(element, adId);
  }

  /**
   * Arrete le tracking d'une annonce
   * @param {HTMLElement} element - Element annonce
   */
  function untrackAd(element) {
    visibilityObserver.unobserve(element);
    interactionObserver.detach(element);
  }

  /**
   * Ajoute un evenement personnalise
   * @param {Object} event - Evenement a ajouter
   */
  function track(event) {
    if (isEnabled) queue.add(event);
  }

  /**
   * Active/desactive le tracking
   * @param {boolean} enabled - Etat souhaite
   */
  function setEnabled(enabled) {
    isEnabled = enabled;
    if (!enabled) queue.clear();
  }

  /**
   * Detruit le service proprement
   */
  function destroy() {
    queue.destroy();
    visibilityObserver.destroy();
    interactionObserver.destroy();
  }

  return Object.freeze({
    init, trackAd, untrackAd, track, setEnabled, destroy,
    get isEnabled() { return isEnabled; }
  });
}

// === security/sanitizer.js ===
/**
 * Sanitizer pour prevenir les attaques XSS
 * @module security/sanitizer
 */


/**
 * Liste des balises autorisees
 */
const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'span', 'br'];

/**
 * Liste des attributs autorises
 */
const ALLOWED_ATTRS = ['class', 'id'];

/**
 * Sanitize une chaine pour affichage HTML
 * @param {string} input - Chaine a sanitizer
 * @returns {string} Chaine securisee
 */
function sanitizeText(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return escapeHtml(input);
}

/**
 * Sanitize une URL
 * @param {string} url - URL a valider
 * @returns {string|null} URL valide ou null
 */
function sanitizeUrl(url) {
  if (typeof url !== 'string') return null;
  
  const trimmed = url.trim();
  
  // Bloque les protocoles dangereux
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:'
  ];
  
  const lowerUrl = trimmed.toLowerCase();
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return null;
    }
  }
  
  // Valide le format URL
  try {
    const parsed = new URL(trimmed, window.location.origin);
    // Accepte uniquement http et https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.href;
  } catch (e) {
    return null;
  }
}

/**
 * Sanitize un objet d'annonce
 * @param {Object} ad - Objet annonce brut
 * @returns {Object} Annonce sanitizee
 */
function sanitizeAd(ad) {
  if (!ad || typeof ad !== 'object') {
    return null;
  }

  return {
    id: sanitizeText(String(ad.id || '')),
    title: sanitizeText(String(ad.title || '')),
    description: sanitizeText(String(ad.description || '')),
    price: sanitizeNumber(ad.price),
    currency: sanitizeText(String(ad.currency || 'EUR')),
    imageUrl: sanitizeUrl(ad.imageUrl),
    linkUrl: sanitizeUrl(ad.linkUrl),
    location: sanitizeText(String(ad.location || '')),
    category: sanitizeText(String(ad.category || ''))
  };
}

/**
 * Sanitize un nombre
 * @param {any} value - Valeur a sanitizer
 * @returns {number|null} Nombre valide ou null
 */
function sanitizeNumber(value) {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  return num;
}

/**
 * Sanitize un tableau d'annonces
 * @param {Object[]} ads - Tableau d'annonces
 * @returns {Object[]} Annonces sanitizees
 */
function sanitizeAds(ads) {
  if (!Array.isArray(ads)) return [];
  return ads.map(sanitizeAd).filter(Boolean);
}

// === security/fraudDetector.js ===
/**
 * Detecteur de fraude aux clics
 * @module security/fraudDetector
 */


/**
 * Cree un detecteur de fraude
 * @returns {Object} Detecteur avec methodes d'analyse
 */
function createFraudDetector() {
  const clickHistory = [];
  const suspiciousPatterns = [];
  
  /**
   * Enregistre et analyse un clic
   * @param {string} adId - ID de l'annonce
   * @param {number} displayTime - Temps depuis affichage (ms)
   * @param {Object} position - Position du clic
   * @returns {Object} Resultat d'analyse
   */
  function analyzeClick(adId, displayTime, position) {
    const now = Date.now();
    const result = {
      suspicious: false,
      flags: [],
      score: 0
    };

    // Verification du temps depuis affichage
    if (displayTime < TIMING.CLICK_FRAUD_THRESHOLD) {
      result.flags.push('too_fast');
      result.score += 30;
    }

    // Verification du rate de clics
    const recentClicks = clickHistory.filter(c => now - c.time < 60000);
    if (recentClicks.length >= LIMITS.MAX_CLICKS_PER_MINUTE) {
      result.flags.push('rate_exceeded');
      result.score += 40;
    }

    // Detection de patterns repetitifs
    if (detectRepetitivePattern(position)) {
      result.flags.push('repetitive_pattern');
      result.score += 50;
    }

    // Enregistre le clic
    clickHistory.push({ adId, time: now, position });
    
    // Nettoie l'historique ancien
    cleanupHistory();

    result.suspicious = result.score >= 50;
    return result;
  }

  /**
   * Detecte un pattern de clics repetitif
   * @param {Object} position - Position du clic
   * @returns {boolean} Pattern detecte
   */
  function detectRepetitivePattern(position) {
    const lastClicks = clickHistory.slice(-5);
    if (lastClicks.length < 3) return false;

    // Verifie si les positions sont trop similaires
    const similarCount = lastClicks.filter(c => {
      const dx = Math.abs(c.position.x - position.x);
      const dy = Math.abs(c.position.y - position.y);
      return dx < 10 && dy < 10;
    }).length;

    return similarCount >= 3;
  }

  /**
   * Nettoie l'historique des clics anciens
   */
  function cleanupHistory() {
    const cutoff = Date.now() - 300000; // 5 minutes
    while (clickHistory.length > 0 && clickHistory[0].time < cutoff) {
      clickHistory.shift();
    }
  }

  /**
   * Verifie si une requete semble automatisee
   * @returns {boolean} Requete suspecte
   */
  function isAutomatedRequest() {
    // Verifie les signaux d'automatisation
    const webdriver = navigator.webdriver;
    const phantom = window.callPhantom || window._phantom;
    const selenium = window.document.__selenium_unwrapped;
    
    return !!(webdriver || phantom || selenium);
  }

  /**
   * Reinitialise le detecteur
   */
  function reset() {
    clickHistory.length = 0;
    suspiciousPatterns.length = 0;
  }

  return Object.freeze({
    analyzeClick,
    isAutomatedRequest,
    reset
  });
}

// === security/honeypot.js ===
/**
 * Honeypot invisible pour detection de bots
 * @module security/honeypot
 */


/**
 * Cree un honeypot invisible
 * @param {Function} onTrigger - Callback si bot detecte
 * @returns {Object} Honeypot avec element et methodes
 */
function createHoneypot(onTrigger) {
  let triggered = false;
  
  // Styles pour rendre le honeypot invisible aux humains
  const honeypotStyles = {
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    width: '1px',
    height: '1px',
    opacity: '0',
    pointerEvents: 'auto',
    overflow: 'hidden',
    tabIndex: '-1'
  };

  /**
   * Cree l'element honeypot
   * @returns {HTMLElement} Element honeypot
   */
  function createHoneypotElement() {
    const container = createElement('div', {
      className: 'aw-hp-container',
      style: honeypotStyles,
      'aria-hidden': 'true'
    });

    // Lien invisible
    const link = createElement('a', {
      href: '#aw-special-offer',
      className: 'aw-hp-link'
    }, 'Offre speciale');

    // Input invisible
    const input = createElement('input', {
      type: 'text',
      name: 'aw_phone',
      className: 'aw-hp-input',
      tabIndex: '-1',
      autocomplete: 'off'
    });

    // Listeners de detection
    link.addEventListener('click', handleTrigger);
    link.addEventListener('focus', handleTrigger);
    input.addEventListener('input', handleTrigger);
    input.addEventListener('focus', handleTrigger);

    container.appendChild(link);
    container.appendChild(input);

    return container;
  }

  /**
   * Gere le declenchement du honeypot
   * @param {Event} event - Evenement declencheur
   */
  function handleTrigger(event) {
    event.preventDefault();
    
    if (!triggered) {
      triggered = true;
      onTrigger({
        type: 'honeypot_triggered',
        element: event.target.className,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Verifie si le honeypot a ete declenche
   * @returns {boolean} Etat du honeypot
   */
  function isTriggered() {
    return triggered;
  }

  /**
   * Reinitialise le honeypot
   */
  function reset() {
    triggered = false;
  }

  return Object.freeze({
    createElement: createHoneypotElement,
    isTriggered,
    reset
  });
}

// === security/securityService.js ===
/**
 * Service de securite principal
 * @module security/securityService
 */




/**
 * Cree le service de securite
 * @param {Function} onFraudDetected - Callback en cas de fraude
 * @returns {Object} Service de securite
 */
function createSecurityService(onFraudDetected) {
  const fraudDetector = createFraudDetector();
  const honeypot = createHoneypot(handleHoneypotTrigger);
  let fraudScore = 0;

  /**
   * Gere le declenchement du honeypot
   * @param {Object} data - Donnees du declenchement
   */
  function handleHoneypotTrigger(data) {
    fraudScore += 100;
    onFraudDetected?.({
      type: 'honeypot',
      data,
      score: fraudScore
    });
  }

  /**
   * Valide et analyse un clic
   * @param {string} adId - ID de l'annonce
   * @param {number} displayTime - Temps depuis affichage
   * @param {Object} position - Position du clic
   * @returns {Object} Resultat de validation
   */
  function validateClick(adId, displayTime, position) {
    const analysis = fraudDetector.analyzeClick(adId, displayTime, position);
    
    if (analysis.suspicious) {
      fraudScore += analysis.score;
      onFraudDetected?.({
        type: 'click_fraud',
        adId,
        flags: analysis.flags,
        score: fraudScore
      });
    }

    return {
      valid: !analysis.suspicious,
      flags: analysis.flags
    };
  }

  /**
   * Verifie si le contexte est suspect
   * @returns {boolean} Contexte suspect
   */
  function isContextSuspicious() {
    if (fraudDetector.isAutomatedRequest()) {
      fraudScore += 50;
      return true;
    }
    
    if (honeypot.isTriggered()) {
      return true;
    }
    
    return fraudScore >= 100;
  }

  /**
   * Securise les donnees d'annonces
   * @param {Object[]} ads - Annonces a securiser
   * @returns {Object[]} Annonces securisees
   */
  function secureAds(ads) {
    return sanitizeAds(ads);
  }

  /**
   * Securise une URL
   * @param {string} url - URL a securiser
   * @returns {string|null} URL securisee
   */
  function secureUrl(url) {
    return sanitizeUrl(url);
  }

  /**
   * Recupere l'element honeypot a inserer
   * @returns {HTMLElement} Element honeypot
   */
  function getHoneypotElement() {
    return honeypot.createElement();
  }

  /**
   * Recupere le score de fraude actuel
   * @returns {number} Score de fraude
   */
  function getFraudScore() {
    return fraudScore;
  }

  /**
   * Reinitialise le service
   */
  function reset() {
    fraudDetector.reset();
    honeypot.reset();
    fraudScore = 0;
  }

  return Object.freeze({
    validateClick,
    isContextSuspicious,
    secureAds,
    secureUrl,
    getHoneypotElement,
    getFraudScore,
    reset
  });
}

// === rgpd/consentManager.js ===
/**
 * Gestionnaire de consentement RGPD
 * @module rgpd/consentManager
 */


/**
 * Verifie si le cookie de consentement existe
 * @returns {boolean} Consentement donne
 */
function checkConsentCookie() {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === COOKIES.CONSENT && value === 'true') {
        return true;
      }
    }
  } catch (e) {
    // Ignore les erreurs d'acces aux cookies
  }
  return false;
}

/**
 * Definit le cookie de consentement
 * @param {boolean} consent - Valeur du consentement
 * @param {number} days - Duree en jours (defaut 365)
 */
function setConsentCookie(consent, days = 365) {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    const sameSite = 'SameSite=Strict';
    const secure = location.protocol === 'https:' ? 'Secure' : '';
    
    document.cookie = `${COOKIES.CONSENT}=${consent};${expires};path=/;${sameSite};${secure}`;
  } catch (e) {
    // Ignore les erreurs d'ecriture de cookies
  }
}

/**
 * Supprime le cookie de consentement
 */
function removeConsentCookie() {
  try {
    document.cookie = `${COOKIES.CONSENT}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  } catch (e) {
    // Ignore les erreurs
  }
}

/**
 * Verifie si Do Not Track est active
 * @returns {boolean} DNT active
 */
function isDoNotTrackEnabled() {
  return navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    navigator.msDoNotTrack === '1';
}

/**
 * Verifie si Global Privacy Control est active
 * @returns {boolean} GPC active
 */
function isGlobalPrivacyControlEnabled() {
  return navigator.globalPrivacyControl === true;
}

/**
 * Determine si le tracking est autorise selon RGPD
 * @param {boolean} noTrackingAttr - Attribut data-no-tracking present
 * @returns {Object} Configuration RGPD
 */
function determineTrackingPermissions(noTrackingAttr) {
  const consentGiven = checkConsentCookie();
  const dntEnabled = isDoNotTrackEnabled();
  const gpcEnabled = isGlobalPrivacyControlEnabled();
  
  return {
    consentGiven,
    respectDNT: dntEnabled,
    respectGPC: gpcEnabled,
    anonymizeData: !consentGiven,
    trackingEnabled: !noTrackingAttr && !dntEnabled && !gpcEnabled
  };
}

// === rgpd/dataAnonymizer.js ===
/**
 * Anonymiseur de donnees RGPD
 * @module rgpd/dataAnonymizer
 */


/**
 * Anonymise une adresse IP
 * @param {string} ip - Adresse IP
 * @returns {string} IP anonymisee
 */
function anonymizeIp(ip) {
  if (!ip || typeof ip !== 'string') return '';
  
  // IPv4: masque le dernier octet
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }
  }
  
  // IPv6: masque les 80 derniers bits
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return parts.slice(0, 4).join(':') + '::';
    }
  }
  
  return '';
}

/**
 * Anonymise un user agent
 * @param {string} ua - User Agent
 * @returns {string} UA anonymise
 */
function anonymizeUserAgent(ua) {
  if (!ua || typeof ua !== 'string') return '';
  
  // Garde uniquement les infos generales
  const browser = extractBrowserName(ua);
  const os = extractOSName(ua);
  
  return `${browser}/${os}`;
}

/**
 * Extrait le nom du navigateur
 * @param {string} ua - User Agent
 * @returns {string} Nom du navigateur
 */
function extractBrowserName(ua) {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

/**
 * Extrait le nom de l'OS
 * @param {string} ua - User Agent
 * @returns {string} Nom de l'OS
 */
function extractOSName(ua) {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone')) return 'iOS';
  return 'Other';
}

/**
 * Hash une donnee sensible
 * @param {string} data - Donnee a hasher
 * @returns {string} Hash de la donnee
 */
function hashSensitiveData(data) {
  if (!data || typeof data !== 'string') return '';
  return simpleHash(data);
}

/**
 * Anonymise une URL en supprimant les parametres sensibles
 * @param {string} url - URL a anonymiser
 * @returns {string} URL anonymisee
 */
function anonymizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Parametres sensibles a supprimer
    const sensitiveParams = [
      'token', 'key', 'auth', 'password', 'email',
      'user', 'username', 'session', 'api_key', 'secret'
    ];
    
    sensitiveParams.forEach(param => {
      parsed.searchParams.delete(param);
    });
    
    return parsed.pathname + (parsed.search || '');
  } catch (e) {
    return '';
  }
}

/**
 * Anonymise un objet de contexte
 * @param {Object} context - Contexte a anonymiser
 * @returns {Object} Contexte anonymise
 */
function anonymizeContext(context) {
  return {
    ...context,
    fp: context.fp ? hashSensitiveData(context.fp) : null,
    url: context.url ? anonymizeUrl(context.url) : null,
    ref: context.ref ? anonymizeUrl(context.ref) : null
  };
}

// === rgpd/rgpdService.js ===
/**
 * Service RGPD principal
 * @module rgpd/rgpdService
 */





/**
 * Cree le service RGPD
 * @param {boolean} noTrackingAttr - Attribut data-no-tracking present
 * @returns {Object} Service RGPD
 */
function createRGPDService(noTrackingAttr) {
  let permissions = determineTrackingPermissions(noTrackingAttr);
  const listeners = new Set();

  /**
   * Recupere les permissions actuelles
   * @returns {Object} Permissions RGPD
   */
  function getPermissions() {
    return { ...permissions };
  }

  /**
   * Enregistre le consentement de l'utilisateur
   */
  function giveConsent() {
    setConsentCookie(true);
    permissions = {
      ...permissions,
      consentGiven: true,
      anonymizeData: false,
      trackingEnabled: !noTrackingAttr
    };
    notifyListeners();
  }

  /**
   * Revoque le consentement de l'utilisateur
   */
  function revokeConsent() {
    removeConsentCookie();
    clearUserData();
    permissions = {
      ...permissions,
      consentGiven: false,
      anonymizeData: true,
      trackingEnabled: false
    };
    notifyListeners();
  }

  /**
   * Nettoie toutes les donnees utilisateur
   */
  function clearUserData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      removeItem(key);
    });
  }

  /**
   * Prepare les donnees pour envoi selon les permissions
   * @param {Object} context - Contexte de tracking
   * @returns {Object} Contexte prepare
   */
  function prepareDataForSending(context) {
    if (permissions.anonymizeData) {
      return anonymizeContext(context);
    }
    return context;
  }

  /**
   * Verifie si le tracking est autorise
   * @returns {boolean} Tracking autorise
   */
  function isTrackingAllowed() {
    return permissions.trackingEnabled && 
      !permissions.respectDNT && 
      !permissions.respectGPC;
  }

  /**
   * Abonne un callback aux changements de permissions
   * @param {Function} callback - Callback a appeler
   * @returns {Function} Fonction de desabonnement
   */
  function onPermissionsChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  /**
   * Notifie les listeners des changements
   */
  function notifyListeners() {
    listeners.forEach(callback => {
      try {
        callback(permissions);
      } catch (e) {
        // Ignore les erreurs des callbacks
      }
    });
  }

  /**
   * Recupere le statut de consentement
   * @returns {Object} Statut de consentement
   */
  function getConsentStatus() {
    return {
      consentGiven: permissions.consentGiven,
      dntEnabled: permissions.respectDNT,
      gpcEnabled: permissions.respectGPC,
      trackingActive: isTrackingAllowed()
    };
  }

  return Object.freeze({
    getPermissions,
    giveConsent,
    revokeConsent,
    clearUserData,
    prepareDataForSending,
    isTrackingAllowed,
    onPermissionsChange,
    getConsentStatus
  });
}

// === rendering/styles.js ===
/**
 * Styles CSS encapsules pour le widget
 * @module rendering/styles
 */


/**
 * Genere les styles de base du widget
 * @param {string} theme - Theme actif
 * @returns {string} CSS du widget
 */
function generateBaseStyles(theme) {
  const palette = getPalette(theme);
  const vars = generateCSSVariables(palette);
  
  return `
    :host {
      ${vars}
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      box-sizing: border-box;
    }
    
    *, *::before, *::after {
      box-sizing: inherit;
    }
    
    .aw-container {
      width: 100%;
      background: var(--aw-background);
      color: var(--aw-text);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .aw-loading {
      padding: 20px;
      text-align: center;
    }
    
    .aw-error {
      padding: 20px;
      text-align: center;
      color: var(--aw-error);
    }
    
    .aw-skeleton {
      background: linear-gradient(90deg, 
        var(--aw-background-alt) 25%, 
        var(--aw-border) 50%, 
        var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
      border-radius: 4px;
    }
    
    @keyframes aw-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .aw-ad-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }
    
    .aw-ad-link:focus {
      outline: 2px solid var(--aw-accent);
      outline-offset: 2px;
    }
  `;
}

/**
 * Genere les styles pour le layout grid
 * @param {number} columns - Nombre de colonnes
 * @returns {string} CSS du grid
 */
function generateGridStyles(columns) {
  return `
    .aw-grid {
      display: grid;
      grid-template-columns: repeat(${columns}, 1fr);
      gap: 16px;
      padding: 16px;
    }
    
    @media (max-width: 600px) {
      .aw-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 12px;
      }
    }
  `;
}

/**
 * Genere les styles pour le layout list
 * @returns {string} CSS de la liste
 */
function generateListStyles() {
  return `
    .aw-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
    }
  `;
}

/**
 * Genere les styles adaptatifs avec couleurs du site hote
 * @param {Object} siteColors - Couleurs extraites du site
 * @returns {string} CSS avec couleurs personnalisees
 */
function generateAdaptiveStyles(siteColors) {
  if (!siteColors) return '';
  
  const overrides = [];
  
  if (siteColors.primary) {
    overrides.push(`--aw-accent: ${siteColors.primary};`);
    overrides.push(`--aw-button-bg: ${siteColors.primary};`);
  }
  
  if (siteColors.text) {
    overrides.push(`--aw-text: ${siteColors.text};`);
  }
  
  if (siteColors.background) {
    overrides.push(`--aw-background: ${siteColors.background};`);
  }
  
  if (siteColors.border) {
    overrides.push(`--aw-border: ${siteColors.border};`);
  }
  
  if (overrides.length === 0) return '';
  
  return `
    :host(.aw-adaptive) {
      ${overrides.join('\n      ')}
    }
  `;
}

// === rendering/cardStyles.js ===
/**
 * Styles des cartes d'annonces
 * @module rendering/cardStyles
 */

/**
 * Genere les styles pour les cartes d'annonces
 * @returns {string} CSS des cartes
 */
function generateCardStyles() {
  return `
    .aw-card {
      background: var(--aw-background);
      border: 1px solid var(--aw-border);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }
    
    .aw-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--aw-shadow);
    }
    
    .aw-card-image {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      background: var(--aw-background-alt);
      overflow: hidden;
    }
    
    .aw-card-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .aw-card-body {
      padding: 12px;
    }
    
    .aw-card-title {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--aw-text);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .aw-card-description {
      margin: 0 0 8px;
      font-size: 13px;
      color: var(--aw-text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .aw-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .aw-card-price {
      font-size: 18px;
      font-weight: 700;
      color: var(--aw-accent);
    }
    
    .aw-card-location {
      font-size: 12px;
      color: var(--aw-text-muted);
    }
  `;
}

/**
 * Genere les styles pour les cartes en mode liste
 * @returns {string} CSS des cartes liste
 */
function generateListCardStyles() {
  return `
    .aw-list-card {
      display: flex;
      background: var(--aw-background);
      border: 1px solid var(--aw-border);
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.2s ease;
    }
    
    .aw-list-card:hover {
      box-shadow: 0 2px 8px var(--aw-shadow);
    }
    
    .aw-list-card-image {
      flex-shrink: 0;
      width: 120px;
      height: 90px;
      background: var(--aw-background-alt);
    }
    
    .aw-list-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .aw-list-card-content {
      flex: 1;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .aw-list-card-title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--aw-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .aw-list-card-price {
      font-size: 16px;
      font-weight: 700;
      color: var(--aw-accent);
    }
  `;
}

// === rendering/carouselStyles.js ===
/**
 * Styles du carousel
 * @module rendering/carouselStyles
 */

/**
 * Genere les styles pour le carousel
 * @returns {string} CSS du carousel
 */
function generateCarouselStyles() {
  return `
    .aw-carousel {
      position: relative;
      overflow: hidden;
      padding: 16px;
    }
    
    .aw-carousel-track {
      display: flex;
      transition: transform 0.3s ease;
      gap: 16px;
    }
    
    .aw-carousel-slide {
      flex-shrink: 0;
      width: calc(33.333% - 11px);
    }
    
    @media (max-width: 900px) {
      .aw-carousel-slide {
        width: calc(50% - 8px);
      }
    }
    
    @media (max-width: 600px) {
      .aw-carousel-slide {
        width: 100%;
      }
    }
    
    .aw-carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: var(--aw-background);
      color: var(--aw-text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px var(--aw-shadow);
      z-index: 10;
      transition: background 0.2s ease;
    }
    
    .aw-carousel-btn:hover {
      background: var(--aw-background-alt);
    }
    
    .aw-carousel-btn:focus {
      outline: 2px solid var(--aw-accent);
      outline-offset: 2px;
    }
    
    .aw-carousel-btn--prev {
      left: 8px;
    }
    
    .aw-carousel-btn--next {
      right: 8px;
    }
    
    .aw-carousel-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .aw-carousel-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
    
    .aw-carousel-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
    }
    
    .aw-carousel-dot {
      width: 8px;
      height: 8px;
      border: none;
      border-radius: 50%;
      background: var(--aw-border);
      cursor: pointer;
      padding: 0;
      transition: background 0.2s ease;
    }
    
    .aw-carousel-dot--active {
      background: var(--aw-accent);
    }
    
    .aw-carousel-dot:focus {
      outline: 2px solid var(--aw-accent);
      outline-offset: 2px;
    }
  `;
}

// === rendering/skeletonStyles.js ===
/**
 * Styles des skeletons de chargement
 * @module rendering/skeletonStyles
 */

/**
 * Genere les styles pour les skeletons
 * @returns {string} CSS des skeletons
 */
function generateSkeletonStyles() {
  return `
    .aw-skeleton-card {
      background: var(--aw-background);
      border: 1px solid var(--aw-border);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .aw-skeleton-image {
      width: 100%;
      padding-bottom: 56.25%;
      background: linear-gradient(90deg, 
        var(--aw-background-alt) 25%, 
        var(--aw-border) 50%, 
        var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
    }
    
    .aw-skeleton-body {
      padding: 12px;
    }
    
    .aw-skeleton-line {
      height: 14px;
      margin-bottom: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, 
        var(--aw-background-alt) 25%, 
        var(--aw-border) 50%, 
        var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
    }
    
    .aw-skeleton-line--short {
      width: 60%;
    }
    
    .aw-skeleton-line--medium {
      width: 80%;
    }
    
    .aw-skeleton-line--long {
      width: 100%;
    }
    
    .aw-skeleton-price {
      width: 40%;
      height: 20px;
      margin-top: 12px;
      border-radius: 4px;
      background: linear-gradient(90deg, 
        var(--aw-background-alt) 25%, 
        var(--aw-border) 50%, 
        var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
    }
    
    @keyframes aw-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
}

/**
 * Cree le HTML d'un skeleton de carte
 * @returns {string} HTML du skeleton
 */
function createSkeletonCardHTML() {
  return `
    <div class="aw-skeleton-card">
      <div class="aw-skeleton-image"></div>
      <div class="aw-skeleton-body">
        <div class="aw-skeleton-line aw-skeleton-line--long"></div>
        <div class="aw-skeleton-line aw-skeleton-line--medium"></div>
        <div class="aw-skeleton-price"></div>
      </div>
    </div>
  `;
}

/**
 * Cree le HTML d'un skeleton de liste
 * @returns {string} HTML du skeleton liste
 */
function createSkeletonListHTML() {
  return `
    <div class="aw-skeleton-card" style="display:flex;height:90px;">
      <div style="width:120px;height:100%;background:var(--aw-background-alt);"></div>
      <div style="flex:1;padding:10px 12px;">
        <div class="aw-skeleton-line aw-skeleton-line--long"></div>
        <div class="aw-skeleton-line aw-skeleton-line--short"></div>
      </div>
    </div>
  `;
}

// === rendering/cardFactory.js ===
/**
 * Factory de creation de cartes d'annonces
 * @module rendering/cardFactory
 */


/**
 * Formate un prix pour affichage
 * @param {number} price - Prix
 * @param {string} currency - Devise
 * @returns {string} Prix formate
 */
function formatPrice(price, currency = 'EUR') {
  if (price === null || price === undefined) return '';
  
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  } catch (e) {
    return `${price} ${currency}`;
  }
}

/**
 * Cree une carte d'annonce standard
 * @param {Object} ad - Donnees de l'annonce
 * @param {Function} onClick - Handler de clic
 * @returns {HTMLElement} Element carte
 */
function createCard(ad, onClick) {
  const card = createElement('article', {
    className: 'aw-card',
    'data-ad-id': ad.id,
    role: 'listitem'
  });

  const link = createElement('a', {
    className: 'aw-ad-link',
    href: ad.linkUrl || '#',
    'aria-label': `Voir l'annonce: ${ad.title}`
  });

  // Image avec placeholder et gestion erreur
  const imageContainer = createElement('div', { className: 'aw-card-image' });
  const img = createElement('img', {
    alt: ad.title,
    loading: 'lazy'
  });
  
  // Placeholder SVG en base64 si pas d'image ou erreur
  const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EImage non disponible%3C/text%3E%3C/svg%3E';
  
  img.onerror = () => { img.src = placeholderSvg; };
  img.src = ad.imageUrl || placeholderSvg;
  imageContainer.appendChild(img);

  // Corps
  const body = createElement('div', { className: 'aw-card-body' });
  
  const title = createElement('h3', { className: 'aw-card-title' }, ad.title);
  body.appendChild(title);

  if (ad.description) {
    const desc = createElement('p', { className: 'aw-card-description' }, ad.description);
    body.appendChild(desc);
  }

  // Footer
  const footer = createElement('div', { className: 'aw-card-footer' });
  
  if (ad.price !== null) {
    const price = createElement('span', { className: 'aw-card-price' }, 
      formatPrice(ad.price, ad.currency));
    footer.appendChild(price);
  }

  if (ad.location) {
    const location = createElement('span', { className: 'aw-card-location' }, ad.location);
    footer.appendChild(location);
  }

  body.appendChild(footer);
  link.appendChild(imageContainer);
  link.appendChild(body);
  card.appendChild(link);

  // Handler de clic
  link.addEventListener('click', (e) => {
    e.preventDefault();
    onClick?.(ad, e);
  });

  return card;
}

/**
 * Cree une carte en mode liste
 * @param {Object} ad - Donnees de l'annonce
 * @param {Function} onClick - Handler de clic
 * @returns {HTMLElement} Element carte liste
 */
function createListCard(ad, onClick) {
  const card = createElement('article', {
    className: 'aw-list-card',
    'data-ad-id': ad.id,
    role: 'listitem'
  });

  const link = createElement('a', {
    className: 'aw-ad-link',
    href: ad.linkUrl || '#',
    style: { display: 'flex', width: '100%' },
    'aria-label': `Voir l'annonce: ${ad.title}`
  });

  // Image avec placeholder
  const imageContainer = createElement('div', { className: 'aw-list-card-image' });
  const img = createElement('img', { alt: ad.title, loading: 'lazy' });
  const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"%3E%3Crect fill="%23e0e0e0" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23999"%3ENo img%3C/text%3E%3C/svg%3E';
  img.onerror = () => { img.src = placeholderSvg; };
  img.src = ad.imageUrl || placeholderSvg;
  imageContainer.appendChild(img);

  // Contenu
  const content = createElement('div', { className: 'aw-list-card-content' });
  const title = createElement('h3', { className: 'aw-list-card-title' }, ad.title);
  content.appendChild(title);

  if (ad.price !== null) {
    const price = createElement('span', { className: 'aw-list-card-price' },
      formatPrice(ad.price, ad.currency));
    content.appendChild(price);
  }

  link.appendChild(imageContainer);
  link.appendChild(content);
  card.appendChild(link);

  link.addEventListener('click', (e) => {
    e.preventDefault();
    onClick?.(ad, e);
  });

  return card;
}

// === rendering/layoutGrid.js ===
/**
 * Rendu du layout Grid
 * @module rendering/layoutGrid
 */



/**
 * Calcule le nombre de colonnes selon la largeur
 * @param {number} width - Largeur disponible
 * @param {number} adCount - Nombre d'annonces
 * @returns {number} Nombre de colonnes
 */
function calculateColumns(width, adCount) {
  if (width < 400) return 1;
  if (width < 600) return Math.min(2, adCount);
  if (width < 900) return Math.min(3, adCount);
  return Math.min(4, adCount);
}

/**
 * Cree un conteneur grid
 * @param {number} columns - Nombre de colonnes
 * @returns {HTMLElement} Conteneur grid
 */
function createGridContainer(columns) {
  const grid = createElement('div', {
    className: 'aw-grid',
    role: 'list',
    'aria-label': 'Liste des annonces'
  });
  
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  
  return grid;
}

/**
 * Rend les annonces en mode grid
 * @param {Object[]} ads - Annonces a afficher
 * @param {number} containerWidth - Largeur du conteneur
 * @param {Function} onAdClick - Handler de clic
 * @returns {HTMLElement} Element grid complet
 */
function renderGridLayout(ads, containerWidth, onAdClick) {
  const columns = calculateColumns(containerWidth, ads.length);
  const grid = createGridContainer(columns);
  
  ads.forEach(ad => {
    const card = createCard(ad, onAdClick);
    grid.appendChild(card);
  });
  
  return grid;
}

/**
 * Met a jour le layout grid existant
 * @param {HTMLElement} grid - Element grid
 * @param {number} containerWidth - Nouvelle largeur
 */
function updateGridLayout(grid, containerWidth) {
  const adCount = grid.children.length;
  const columns = calculateColumns(containerWidth, adCount);
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

// === rendering/layoutList.js ===
/**
 * Rendu du layout Liste
 * @module rendering/layoutList
 */



/**
 * Cree un conteneur liste
 * @returns {HTMLElement} Conteneur liste
 */
function createListContainer() {
  return createElement('div', {
    className: 'aw-list',
    role: 'list',
    'aria-label': 'Liste des annonces'
  });
}

/**
 * Rend les annonces en mode liste
 * @param {Object[]} ads - Annonces a afficher
 * @param {Function} onAdClick - Handler de clic
 * @returns {HTMLElement} Element liste complet
 */
function renderListLayout(ads, onAdClick) {
  const list = createListContainer();
  
  ads.forEach(ad => {
    const card = createListCard(ad, onAdClick);
    list.appendChild(card);
  });
  
  return list;
}

/**
 * Ajoute une annonce a la liste
 * @param {HTMLElement} list - Element liste
 * @param {Object} ad - Annonce a ajouter
 * @param {Function} onAdClick - Handler de clic
 * @param {string} position - Position ('start' ou 'end')
 */
function appendToList(list, ad, onAdClick, position = 'end') {
  const card = createListCard(ad, onAdClick);
  
  if (position === 'start' && list.firstChild) {
    list.insertBefore(card, list.firstChild);
  } else {
    list.appendChild(card);
  }
}

/**
 * Supprime une annonce de la liste
 * @param {HTMLElement} list - Element liste
 * @param {string} adId - ID de l'annonce a supprimer
 */
function removeFromList(list, adId) {
  const card = list.querySelector(`[data-ad-id="${adId}"]`);
  if (card) {
    card.remove();
  }
}

// === rendering/layoutCarousel.js ===
/**
 * Rendu du layout Carousel
 * @module rendering/layoutCarousel
 */



// Icones SVG pour navigation
const PREV_ICON = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
const NEXT_ICON = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

/**
 * Cree le conteneur du carousel
 * @returns {Object} Elements du carousel
 */
function createCarouselContainer() {
  const carousel = createElement('div', {
    className: 'aw-carousel',
    role: 'region',
    'aria-label': 'Carousel d\'annonces'
  });

  const track = createElement('div', {
    className: 'aw-carousel-track',
    role: 'list'
  });

  const prevBtn = createElement('button', {
    className: 'aw-carousel-btn aw-carousel-btn--prev',
    'aria-label': 'Annonce precedente',
    type: 'button'
  });
  prevBtn.innerHTML = PREV_ICON;

  const nextBtn = createElement('button', {
    className: 'aw-carousel-btn aw-carousel-btn--next',
    'aria-label': 'Annonce suivante',
    type: 'button'
  });
  nextBtn.innerHTML = NEXT_ICON;

  const dots = createElement('div', {
    className: 'aw-carousel-dots',
    role: 'tablist',
    'aria-label': 'Navigation du carousel'
  });

  carousel.appendChild(track);
  carousel.appendChild(prevBtn);
  carousel.appendChild(nextBtn);
  carousel.appendChild(dots);

  return { carousel, track, prevBtn, nextBtn, dots };
}

/**
 * Cree les points de navigation
 * @param {number} count - Nombre de slides
 * @param {number} current - Index actuel
 * @param {Function} onDotClick - Handler de clic
 * @returns {HTMLElement[]} Elements dots
 */
function createDots(count, current, onDotClick) {
  const dots = [];
  
  for (let i = 0; i < count; i++) {
    const dot = createElement('button', {
      className: `aw-carousel-dot ${i === current ? 'aw-carousel-dot--active' : ''}`,
      'aria-label': `Aller a l'annonce ${i + 1}`,
      'aria-selected': i === current ? 'true' : 'false',
      role: 'tab',
      type: 'button'
    });
    
    dot.addEventListener('click', () => onDotClick(i));
    dots.push(dot);
  }
  
  return dots;
}

/**
 * Cree un slide du carousel
 * @param {Object} ad - Annonce
 * @param {Function} onAdClick - Handler de clic
 * @returns {HTMLElement} Element slide
 */
function createCarouselSlide(ad, onAdClick) {
  const slide = createElement('div', {
    className: 'aw-carousel-slide',
    role: 'listitem'
  });
  
  const card = createCard(ad, onAdClick);
  slide.appendChild(card);
  
  return slide;
}

// === rendering/carouselController.js ===
/**
 * Controleur du carousel
 * @module rendering/carouselController
 */


/**
 * Cree un controleur pour le carousel
 * @param {Object} elements - Elements du carousel
 * @param {number} slideCount - Nombre de slides
 * @param {Function} onSlideChange - Callback changement de slide
 * @returns {Object} Controleur avec methodes
 */
function createCarouselController(elements, slideCount, onSlideChange) {
  const { track, prevBtn, nextBtn, dots } = elements;
  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayTimer = null;

  /**
   * Met a jour la position du carousel
   * @param {boolean} animate - Animer la transition
   */
  function updatePosition(animate = true) {
    if (isAnimating) return;
    
    isAnimating = true;
    const translateX = -currentIndex * 100;
    
    track.style.transition = animate ? 'transform 0.3s ease' : 'none';
    track.style.transform = `translateX(${translateX}%)`;
    
    requestFrame(() => {
      setTimeout(() => {
        isAnimating = false;
      }, animate ? 300 : 0);
    });

    updateButtons();
    updateDots();
    onSlideChange?.(currentIndex);
  }

  /**
   * Met a jour l'etat des boutons
   */
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= slideCount - 1;
  }

  /**
   * Met a jour l'etat des dots
   */
  function updateDots() {
    const dotElements = dots.querySelectorAll('.aw-carousel-dot');
    dotElements.forEach((dot, i) => {
      dot.classList.toggle('aw-carousel-dot--active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });
  }

  /**
   * Va au slide suivant
   */
  function next() {
    if (currentIndex < slideCount - 1) {
      currentIndex++;
      updatePosition();
    }
  }

  /**
   * Va au slide precedent
   */
  function prev() {
    if (currentIndex > 0) {
      currentIndex--;
      updatePosition();
    }
  }

  /**
   * Va a un slide specifique
   * @param {number} index - Index du slide
   */
  function goTo(index) {
    if (index >= 0 && index < slideCount && index !== currentIndex) {
      currentIndex = index;
      updatePosition();
    }
  }

  /**
   * Demarre l'autoplay
   * @param {number} interval - Intervalle en ms
   */
  function startAutoPlay(interval = 5000) {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (currentIndex < slideCount - 1) {
        next();
      } else {
        goTo(0);
      }
    }, interval);
  }

  /**
   * Arrete l'autoplay
   */
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Setup listeners
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Init
  updatePosition(false);

  return Object.freeze({
    next, prev, goTo, startAutoPlay, stopAutoPlay,
    get currentIndex() { return currentIndex; },
    destroy: () => {
      stopAutoPlay();
      prevBtn.removeEventListener('click', prev);
      nextBtn.removeEventListener('click', next);
    }
  });
}

// === rendering/carouselManager.js ===
/**
 * Gestionnaire du carousel complet
 * @module rendering/carouselManager
 */




/**
 * Cree et gere un carousel complet
 * @param {Object[]} ads - Annonces a afficher
 * @param {Function} onAdClick - Handler de clic
 * @param {Function} onSlideChange - Handler changement de slide
 * @returns {Object} Manager avec element et controleur
 */
function createCarouselManager(ads, onAdClick, onSlideChange) {
  const elements = createCarouselContainer();
  const { carousel, track, dots } = elements;

  // Cree les slides
  ads.forEach(ad => {
    const slide = createCarouselSlide(ad, onAdClick);
    track.appendChild(slide);
  });

  // Cree les dots
  const dotElements = createDots(ads.length, 0, (index) => {
    controller.goTo(index);
  });
  dotElements.forEach(dot => dots.appendChild(dot));

  // Cree le controleur
  const controller = createCarouselController(elements, ads.length, onSlideChange);

  // Support tactile
  if (hasTouchSupport()) {
    setupTouchHandlers(carousel, controller);
  }

  // Pause autoplay au hover
  carousel.addEventListener('mouseenter', () => controller.stopAutoPlay());
  carousel.addEventListener('mouseleave', () => controller.startAutoPlay());

  /**
   * Demarre le carousel
   * @param {boolean} autoPlay - Activer l'autoplay
   */
  function start(autoPlay = false) {
    if (autoPlay) {
      controller.startAutoPlay();
    }
  }

  /**
   * Detruit le carousel
   */
  function destroy() {
    controller.destroy();
  }

  return Object.freeze({
    element: carousel,
    controller,
    start,
    destroy
  });
}

/**
 * Configure les handlers tactiles
 * @param {HTMLElement} carousel - Element carousel
 * @param {Object} controller - Controleur du carousel
 */
function setupTouchHandlers(carousel, controller) {
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;
    
    // Si mouvement vertical plus important, ignore
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      isDragging = false;
    }
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        controller.prev();
      } else {
        controller.next();
      }
    }
    
    isDragging = false;
  }, { passive: true });
}

// === rendering/renderer.js ===
/**
 * Gestionnaire de rendu principal
 * @module rendering/renderer
 */









/**
 * Cree le renderer principal
 * @param {ShadowRoot} shadowRoot - Shadow root du widget
 * @param {string} theme - Theme actif
 * @param {Object} siteColors - Couleurs du site hote (optionnel)
 * @returns {Object} Renderer avec methodes
 */
function createRenderer(shadowRoot, theme, siteColors = null) {
  let currentLayout = null;
  let contentContainer = null;

  /**
   * Initialise les styles dans le shadow DOM
   */
  function initStyles() {
    const style = createElement('style');
    const styles = [
      generateBaseStyles(theme),
      generateCardStyles(),
      generateListCardStyles(),
      generateGridStyles(3),
      generateListStyles(),
      generateCarouselStyles(),
      generateSkeletonStyles()
    ];
    
    // Ajoute styles adaptatifs si couleurs disponibles
    if (siteColors) {
      styles.push(generateAdaptiveStyles(siteColors));
    }
    
    style.textContent = styles.join('\n');
    shadowRoot.appendChild(style);
    
    contentContainer = createElement('div', { className: 'aw-container' });
    
    // Ajoute classe adaptative si couleurs utilisees
    if (siteColors) {
      shadowRoot.host.classList.add('aw-adaptive');
    }
    
    shadowRoot.appendChild(contentContainer);
  }

  /**
   * Affiche l'etat de chargement
   * @param {number} count - Nombre de skeletons
   * @param {string} layout - Layout a utiliser
   */
  function showLoading(count, layout) {
    contentContainer.innerHTML = '';
    const wrapper = createElement('div', { 
      className: layout === LAYOUTS.LIST ? 'aw-list' : 'aw-grid' 
    });
    
    for (let i = 0; i < count; i++) {
      const skeleton = createElement('div');
      skeleton.innerHTML = createSkeletonCardHTML();
      wrapper.appendChild(skeleton.firstChild);
    }
    
    contentContainer.appendChild(wrapper);
  }

  /**
   * Affiche un message d'erreur
   * @param {string} message - Message d'erreur
   */
  function showError(message) {
    contentContainer.innerHTML = '';
    const error = createElement('div', { 
      className: 'aw-error',
      role: 'alert'
    }, message);
    contentContainer.appendChild(error);
  }

  /**
   * Rend les annonces
   * @param {Object[]} ads - Annonces a afficher
   * @param {string} layout - Layout a utiliser
   * @param {number} containerWidth - Largeur du conteneur
   * @param {Function} onAdClick - Handler de clic
   */
  function render(ads, layout, containerWidth, onAdClick) {
    contentContainer.innerHTML = '';
    currentLayout = layout;

    if (ads.length === 0) {
      showError('Aucune annonce disponible');
      return;
    }

    let content;
    switch (layout) {
      case LAYOUTS.LIST:
        content = renderListLayout(ads, onAdClick);
        break;
      case LAYOUTS.GRID:
      default:
        content = renderGridLayout(ads, containerWidth, onAdClick);
        break;
    }

    contentContainer.appendChild(content);
  }

  /**
   * Met a jour le layout responsive
   * @param {number} containerWidth - Nouvelle largeur
   */
  function updateResponsive(containerWidth) {
    if (currentLayout === LAYOUTS.GRID) {
      const grid = contentContainer.querySelector('.aw-grid');
      if (grid) updateGridLayout(grid, containerWidth);
    }
  }

  /**
   * Met a jour le theme
   * @param {string} newTheme - Nouveau theme
   */
  function updateTheme(newTheme) {
    const style = shadowRoot.querySelector('style');
    if (style) {
      style.textContent = style.textContent.replace(
        /(:host\s*\{[^}]*)/,
        generateBaseStyles(newTheme).match(/(:host\s*\{[^}]*)/)[1]
      );
    }
  }

  return Object.freeze({
    initStyles,
    showLoading,
    showError,
    render,
    updateResponsive,
    updateTheme,
    get container() { return contentContainer; }
  });
}

// === rotation/scoringEngine.js ===
/**
 * Algorithme de scoring des annonces
 * @module rotation/scoringEngine
 */

/**
 * Calcule le score d'engagement d'une annonce
 * @param {Object} metrics - Metriques de l'annonce
 * @returns {number} Score d'engagement (0-100)
 */
function calculateEngagementScore(metrics) {
  const {
    viewTime = 0,
    hoverDuration = 0,
    scrollDepth = 0,
    clicked = false,
    impressions = 0
  } = metrics;

  // Poids des facteurs
  const weights = {
    viewTime: 0.25,
    hoverDuration: 0.30,
    scrollDepth: 0.25,
    clicked: 0.20
  };

  // Normalisation du temps de vue (max 30s = score max)
  const viewTimeScore = Math.min(viewTime / 30000, 1) * 100;
  
  // Normalisation du hover (max 10s = score max)
  const hoverScore = Math.min(hoverDuration / 10000, 1) * 100;
  
  // Scroll depth deja normalise (0-1)
  const scrollScore = scrollDepth * 100;
  
  // Bonus pour clic
  const clickScore = clicked ? 100 : 0;

  // Score pondere
  const score = (
    viewTimeScore * weights.viewTime +
    hoverScore * weights.hoverDuration +
    scrollScore * weights.scrollDepth +
    clickScore * weights.clicked
  );

  return Math.round(score * 100) / 100;
}

/**
 * Calcule le score de priorite pour la rotation
 * @param {Object} ad - Annonce avec metriques
 * @param {Object} context - Contexte de rotation
 * @returns {number} Score de priorite
 */
function calculateRotationPriority(ad, context) {
  const { viewedAds = [], lastRotation = 0 } = context;
  
  let score = 50; // Score de base
  
  // Penalite si deja vue recemment
  if (viewedAds.includes(ad.id)) {
    const recency = viewedAds.indexOf(ad.id);
    score -= (viewedAds.length - recency) * 10;
  }
  
  // Bonus si jamais affichee
  if (!ad.impressions || ad.impressions === 0) {
    score += 20;
  }
  
  // Ajustement par performance globale
  if (ad.ctr && ad.ctr > 0) {
    score += ad.ctr * 100; // CTR en pourcentage booste le score
  }
  
  // Facteur aleatoire pour diversite (10%)
  score += (Math.random() - 0.5) * 10;
  
  return Math.max(0, Math.round(score));
}

/**
 * Trie les annonces par score de priorite
 * @param {Object[]} ads - Liste des annonces
 * @param {Object} context - Contexte de rotation
 * @returns {Object[]} Annonces triees
 */
function sortAdsByPriority(ads, context) {
  return [...ads]
    .map(ad => ({
      ...ad,
      priority: calculateRotationPriority(ad, context)
    }))
    .sort((a, b) => b.priority - a.priority);
}

// === rotation/viewedHistory.js ===
/**
 * Gestionnaire d'historique des annonces vues
 * @module rotation/viewedHistory
 */



/**
 * Cree un gestionnaire d'historique
 * @param {number} maxSize - Taille max de l'historique
 * @returns {Object} Gestionnaire d'historique
 */
function createViewedHistory(maxSize = 50) {
  let history = loadHistory();

  /**
   * Charge l'historique depuis le storage
   * @returns {Object[]} Historique charge
   */
  function loadHistory() {
    const stored = getItem(STORAGE_KEYS.VIEWED_ADS);
    return Array.isArray(stored) ? stored : [];
  }

  /**
   * Sauvegarde l'historique dans le storage
   */
  function saveHistory() {
    setItem(STORAGE_KEYS.VIEWED_ADS, history);
  }

  /**
   * Ajoute une annonce a l'historique
   * @param {string} adId - ID de l'annonce
   * @param {Object} metrics - Metriques associees
   */
  function addViewed(adId, metrics = {}) {
    // Supprime l'entree existante si presente
    history = history.filter(item => item.id !== adId);
    
    // Ajoute au debut
    history.unshift({
      id: adId,
      timestamp: Date.now(),
      metrics
    });
    
    // Limite la taille
    if (history.length > maxSize) {
      history = history.slice(0, maxSize);
    }
    
    saveHistory();
  }

  /**
   * Verifie si une annonce a ete vue
   * @param {string} adId - ID de l'annonce
   * @returns {boolean} Annonce vue
   */
  function hasViewed(adId) {
    return history.some(item => item.id === adId);
  }

  /**
   * Recupere les IDs des annonces vues
   * @param {number} limit - Nombre max d'IDs
   * @returns {string[]} Liste d'IDs
   */
  function getViewedIds(limit = 10) {
    return history.slice(0, limit).map(item => item.id);
  }

  /**
   * Recupere les metriques d'une annonce
   * @param {string} adId - ID de l'annonce
   * @returns {Object|null} Metriques ou null
   */
  function getMetrics(adId) {
    const item = history.find(h => h.id === adId);
    return item?.metrics || null;
  }

  /**
   * Met a jour les metriques d'une annonce
   * @param {string} adId - ID de l'annonce
   * @param {Object} metrics - Nouvelles metriques
   */
  function updateMetrics(adId, metrics) {
    const item = history.find(h => h.id === adId);
    if (item) {
      item.metrics = { ...item.metrics, ...metrics };
      saveHistory();
    }
  }

  /**
   * Nettoie les entrees anciennes
   * @param {number} maxAge - Age max en ms
   */
  function cleanup(maxAge = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAge;
    history = history.filter(item => item.timestamp > cutoff);
    saveHistory();
  }

  /**
   * Vide l'historique
   */
  function clear() {
    history = [];
    saveHistory();
  }

  return Object.freeze({
    addViewed,
    hasViewed,
    getViewedIds,
    getMetrics,
    updateMetrics,
    cleanup,
    clear,
    get size() { return history.length; }
  });
}

// === rotation/behaviorDetector.js ===
/**
 * Detecteur de comportement utilisateur
 * @module rotation/behaviorDetector
 */


/**
 * Cree un detecteur de comportement
 * @param {Object} callbacks - Callbacks de notification
 * @returns {Object} Detecteur avec methodes
 */
function createBehaviorDetector(callbacks) {
  const { onIdle, onReturn, onScrollPast, onEngagement } = callbacks;
  
  let lastActivity = Date.now();
  let isIdle = false;
  let wasHidden = false;
  let scrollPosition = 0;
  let idleTimer = null;
  let idleThreshold = 30000; // 30 secondes

  /**
   * Enregistre une activite utilisateur
   */
  function recordActivity() {
    lastActivity = Date.now();
    
    if (isIdle) {
      isIdle = false;
      onEngagement?.();
    }
    
    resetIdleTimer();
  }

  /**
   * Reinitialise le timer d'inactivite
   */
  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    
    idleTimer = setTimeout(() => {
      isIdle = true;
      onIdle?.();
    }, idleThreshold);
  }

  /**
   * Gere le changement de visibilite de la page
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      wasHidden = true;
    } else if (wasHidden) {
      wasHidden = false;
      onReturn?.();
    }
  }

  /**
   * Gere le scroll de la page
   * @param {HTMLElement} widgetElement - Element du widget
   */
  const handleScroll = throttle((widgetElement) => {
    if (!widgetElement) return;
    
    const rect = widgetElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Detecte si l'utilisateur a scrolle passe le widget
    if (rect.bottom < 0 && scrollPosition >= 0) {
      onScrollPast?.();
    }
    
    scrollPosition = rect.top;
    recordActivity();
  }, 200);

  /**
   * Configure les listeners
   * @param {HTMLElement} widgetElement - Element du widget
   * @returns {Function} Fonction de cleanup
   */
  function setup(widgetElement) {
    // Listeners d'activite
    const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, recordActivity, { passive: true });
    });

    // Listener de visibilite
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listener de scroll
    const scrollHandler = () => handleScroll(widgetElement);
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Demarre le timer
    resetIdleTimer();

    // Retourne la fonction de cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, recordActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', scrollHandler);
      handleScroll.cancel?.();
      if (idleTimer) clearTimeout(idleTimer);
    };
  }

  /**
   * Configure le seuil d'inactivite
   * @param {number} threshold - Seuil en ms
   */
  function setIdleThreshold(threshold) {
    idleThreshold = threshold;
    resetIdleTimer();
  }

  return Object.freeze({
    setup,
    recordActivity,
    setIdleThreshold,
    get isIdle() { return isIdle; },
    get lastActivity() { return lastActivity; }
  });
}

// === rotation/rotationService.js ===
/**
 * Service de rotation des annonces
 * @module rotation/rotationService
 */






/**
 * Cree le service de rotation
 * @param {Function} onRotate - Callback de rotation
 * @param {Function} onTrackEvent - Callback de tracking
 * @returns {Object} Service de rotation
 */
function createRotationService(onRotate, onTrackEvent) {
  const history = createViewedHistory();
  let behaviorDetector = null;
  let cleanupBehavior = null;
  let currentAds = [];
  let allAds = [];
  let rotationCount = 0;

  /**
   * Initialise le service avec les annonces disponibles
   * @param {Object[]} ads - Toutes les annonces disponibles
   * @param {Object[]} initialAds - Annonces initiales a afficher
   */
  function init(ads, initialAds) {
    allAds = ads;
    currentAds = initialAds;
    
    // Marque les annonces initiales comme vues
    initialAds.forEach(ad => history.addViewed(ad.id, { impressions: 1 }));
  }

  /**
   * Configure la detection de comportement
   * @param {HTMLElement} widgetElement - Element du widget
   */
  function setupBehaviorDetection(widgetElement) {
    behaviorDetector = createBehaviorDetector({
      onIdle: handleIdle,
      onReturn: handleReturn,
      onScrollPast: handleScrollPast,
      onEngagement: handleEngagement
    });
    
    cleanupBehavior = behaviorDetector.setup(widgetElement);
  }

  /**
   * Gere l'inactivite utilisateur
   */
  function handleIdle() {
    triggerRotation('idle');
  }

  /**
   * Gere le retour de l'utilisateur
   */
  function handleReturn() {
    triggerRotation('return');
  }

  /**
   * Gere le scroll passe le widget
   */
  function handleScrollPast() {
    // Optionnel: rotation si aucune interaction
    if (!hasUserEngaged()) {
      triggerRotation('scroll_past');
    }
  }

  /**
   * Gere un engagement utilisateur
   */
  function handleEngagement() {
    // Met a jour les metriques
    currentAds.forEach(ad => {
      const metrics = history.getMetrics(ad.id) || {};
      history.updateMetrics(ad.id, {
        ...metrics,
        engagements: (metrics.engagements || 0) + 1
      });
    });
  }

  /**
   * Verifie si l'utilisateur a interagi
   * @returns {boolean} Engagement detecte
   */
  function hasUserEngaged() {
    return currentAds.some(ad => {
      const metrics = history.getMetrics(ad.id);
      return metrics && (metrics.clicked || metrics.hoverDuration > 2000);
    });
  }

  /**
   * Declenche une rotation des annonces
   * @param {string} reason - Raison de la rotation
   */
  function triggerRotation(reason) {
    const context = { viewedAds: history.getViewedIds(20) };
    const sortedAds = sortAdsByPriority(allAds, context);
    
    // Selectionne les nouvelles annonces
    const newAds = sortedAds
      .filter(ad => !currentAds.find(c => c.id === ad.id))
      .slice(0, currentAds.length);
    
    if (newAds.length === 0) return;

    // Tracking de rotation
    const oldIds = currentAds.map(a => a.id);
    const newIds = newAds.map(a => a.id);
    onTrackEvent?.(createRotationEvent(oldIds.join(','), newIds.join(','), reason));

    // Marque comme vues
    newAds.forEach(ad => history.addViewed(ad.id, { impressions: 1 }));
    
    currentAds = newAds;
    rotationCount++;
    
    onRotate?.(newAds, reason);
  }

  /**
   * Enregistre un clic sur une annonce
   * @param {string} adId - ID de l'annonce
   */
  function recordClick(adId) {
    history.updateMetrics(adId, { clicked: true });
  }

  /**
   * Enregistre le temps de vue
   * @param {string} adId - ID de l'annonce
   * @param {number} time - Temps en ms
   */
  function recordViewTime(adId, time) {
    const metrics = history.getMetrics(adId) || {};
    history.updateMetrics(adId, {
      viewTime: (metrics.viewTime || 0) + time
    });
  }

  /**
   * Detruit le service
   */
  function destroy() {
    cleanupBehavior?.();
    history.cleanup();
  }

  return Object.freeze({
    init, setupBehaviorDetection, triggerRotation,
    recordClick, recordViewTime, destroy,
    get currentAds() { return currentAds; },
    get rotationCount() { return rotationCount; }
  });
}

// === api/endpoints.js ===
/**
 * Endpoints API du widget betaia
 * @module api/endpoints
 */

// Configuration API betaia
const BETAIA_CONFIG = {
  API_BASE: 'https://devapi.omnisoft.africa/public/api/v2',
  IMAGE_BASE: 'https://devapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/'
};

/**
 * Configuration des endpoints
 * @param {string} baseUrl - URL de base du serveur de tracking
 * @returns {Object} Endpoints configures
 */
function createEndpoints(baseUrl) {
  return Object.freeze({
    // API GraphQL betaia pour les annonces
    ads: BETAIA_CONFIG.API_BASE,
    
    // URL de base des images
    images: BETAIA_CONFIG.IMAGE_BASE,
    
    // Endpoint pour le tracking (serveur widget)
    tracking: `${baseUrl}/api/tracking`,
    
    // Endpoint pour les statistiques
    stats: `${baseUrl}/api/stats`,
    
    // Endpoint pour le reporting de fraude
    fraud: `${baseUrl}/api/fraud`
  });
}

/**
 * Construit la query GraphQL pour les annonces
 * @param {Object} params - Parametres de filtrage
 * @returns {string} Query GraphQL encodee
 */
function buildAdsQuery(params = {}) {
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
function getImageUrl(uri) {
  if (!uri) return '';
  if (uri.startsWith('http')) return uri;
  return `${BETAIA_CONFIG.IMAGE_BASE}${uri}`;
}

/**
 * Determine l'URL de base depuis le script
 * @returns {string} URL de base detectee
 */
function detectBaseUrl() {
  try {
    const script = document.currentScript || 
      document.querySelector('script[data-id]');
    
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
function isValidEndpoint(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (e) {
    return false;
  }
}

// === api/adsCache.js ===
/**
 * Cache d'annonces prefetchees
 * @module api/adsCache
 */


/**
 * Cree un cache d'annonces en memoire
 * @param {number} maxSize - Taille maximum
 * @returns {Object} Cache avec methodes
 */
function createAdsCache(maxSize = LIMITS.MAX_CACHE_ITEMS) {
  const cache = new Map();
  const ttl = 5 * 60 * 1000; // 5 minutes

  /**
   * Stocke des annonces dans le cache
   * @param {string} key - Cle de cache
   * @param {Object[]} ads - Annonces a cacher
   */
  function set(key, ads) {
    // Nettoie si limite atteinte
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    cache.set(key, {
      ads,
      timestamp: Date.now()
    });
  }

  /**
   * Recupere des annonces du cache
   * @param {string} key - Cle de cache
   * @returns {Object[]|null} Annonces ou null si expire
   */
  function get(key) {
    const entry = cache.get(key);
    
    if (!entry) return null;
    
    // Verifie expiration
    if (Date.now() - entry.timestamp > ttl) {
      cache.delete(key);
      return null;
    }
    
    return entry.ads;
  }

  /**
   * Genere une cle de cache
   * @param {string} clientId - ID client
   * @param {number} limit - Limite
   * @param {string[]} excludeIds - IDs exclus
   * @returns {string} Cle generee
   */
  function generateKey(clientId, limit, excludeIds = []) {
    return `${clientId}:${limit}:${excludeIds.sort().join(',')}`;
  }

  /**
   * Stocke une annonce individuelle
   * @param {Object} ad - Annonce a cacher
   */
  function setAd(ad) {
    if (!ad || !ad.id) return;
    
    const key = `ad:${ad.id}`;
    cache.set(key, {
      ads: [ad],
      timestamp: Date.now()
    });
  }

  /**
   * Recupere une annonce individuelle
   * @param {string} adId - ID de l'annonce
   * @returns {Object|null} Annonce ou null
   */
  function getAd(adId) {
    const key = `ad:${adId}`;
    const entry = cache.get(key);
    
    if (!entry || Date.now() - entry.timestamp > ttl) {
      cache.delete(key);
      return null;
    }
    
    return entry.ads[0];
  }

  /**
   * Vide le cache
   */
  function clear() {
    cache.clear();
  }

  /**
   * Nettoie les entrees expirees
   */
  function cleanup() {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > ttl) {
        cache.delete(key);
      }
    }
  }

  return Object.freeze({
    set,
    get,
    generateKey,
    setAd,
    getAd,
    clear,
    cleanup,
    get size() { return cache.size; }
  });
}

// === api/adsClient.js ===
/**
 * Client API pour recuperer les annonces betaia
 * @module api/adsClient
 */


/**
 * Cree un client API pour les annonces
 * @param {string} baseUrl - URL de base detectee du script
 * @returns {Object} Client avec methodes
 */
function createAdsClient(baseUrl) {
  const defaultTimeout = 10000;
  
  // Utilise le proxy sur le meme domaine que le widget
  const proxyUrl = `${baseUrl}/api/ads`;

  /**
   * Recupere les annonces via le proxy API
   * @param {string} clientId - ID du client
   * @param {number} limit - Nombre max d'annonces
   * @returns {Promise<Object[]>} Liste des annonces
   */
  async function fetchAds(clientId, limit = 6) {
    const url = `${proxyUrl}?limit=${limit}&usage=1&status=1`;
    
    console.log('[AnnoncesWidget] URL Proxy:', url);

    try {
      const response = await withTimeout(
        () => fetch(url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'omit'
        }),
        defaultTimeout
      );

      console.log('[AnnoncesWidget] Response status:', response.status);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json = await response.json();
      console.log('[AnnoncesWidget] Annonces recues:', json.ads?.length || 0);
      
      return json.ads || [];
    } catch (error) {
      console.error('[AnnoncesWidget] Erreur API:', error);
      throw error;
    }
  }

  /**
   * Prefetch les annonces suivantes
   */
  async function prefetchAds(clientId, excludeIds = [], limit = 6) {
    return fetchAds(clientId, limit);
  }

  return Object.freeze({
    fetchAds,
    prefetchAds
  });
}

// === api/publicApi.js ===
/**
 * API publique du widget
 * @module api/publicApi
 */


/**
 * Cree l'API publique exposee sur window
 * @param {Object} services - Services internes
 * @returns {Object} API publique frozen
 */
function createPublicApi(services) {
  const { 
    refresh, 
    getStats, 
    rgpdService, 
    trackingService,
    destroy 
  } = services;

  const api = {
    /**
     * Version du widget
     */
    version: VERSION,

    /**
     * Recharge les annonces
     * @returns {Promise<void>}
     */
    refresh: async () => {
      try {
        await refresh();
      } catch (error) {
        console.error('[AnnoncesWidget] Erreur refresh:', error.message);
      }
    },

    /**
     * Recupere les statistiques locales
     * @returns {Object} Statistiques
     */
    getStats: () => {
      try {
        return getStats();
      } catch (error) {
        return { error: error.message };
      }
    },

    /**
     * Donne le consentement RGPD
     */
    giveConsent: () => {
      rgpdService?.giveConsent();
      trackingService?.setEnabled(true);
    },

    /**
     * Revoque le consentement RGPD
     */
    revokeConsent: () => {
      rgpdService?.revokeConsent();
      trackingService?.setEnabled(false);
    },

    /**
     * Recupere le statut de consentement
     * @returns {Object} Statut de consentement
     */
    getConsentStatus: () => {
      return rgpdService?.getConsentStatus() || { error: 'Service non disponible' };
    },

    /**
     * Detruit le widget
     */
    destroy: () => {
      try {
        destroy();
        delete window[NAMESPACE];
      } catch (error) {
        console.error('[AnnoncesWidget] Erreur destroy:', error.message);
      }
    }
  };

  return Object.freeze(api);
}

/**
 * Expose l'API sur le namespace global
 * @param {Object} api - API a exposer
 */
function exposePublicApi(api) {
  // Protection contre les modifications
  Object.defineProperty(window, NAMESPACE, {
    value: api,
    writable: false,
    configurable: true
  });
}

/**
 * Verifie si le widget est deja charge
 * @returns {boolean} Widget deja charge
 */
function isWidgetLoaded() {
  return typeof window[NAMESPACE] !== 'undefined';
}

// === core/config.js ===
/**
 * Gestionnaire de configuration du widget
 * @module core/config
 */


/**
 * Configuration par defaut du widget
 */
const defaultConfig = {
  clientId: null,
  maxAds: null,
  theme: THEMES.AUTO,
  layout: LAYOUTS.AUTO,
  noTracking: false,
  adaptColors: true,
  containerId: DEFAULT_CONTAINER_ID,
  apiUrl: null,
  debug: false
};

/**
 * Extrait la configuration depuis les attributs data du script
 * @returns {Object} Configuration extraite
 */
function extractConfigFromScript() {
  const script = document.currentScript || 
    document.querySelector('script[data-id]');
  
  if (!script) {
    console.warn('[AnnoncesWidget] Script tag non trouve');
    return { ...defaultConfig };
  }

  const clientId = script.getAttribute('data-id');
  const maxAds = parseInt(script.getAttribute('data-max-ads'), 10);
  const theme = script.getAttribute('data-theme');
  const layout = script.getAttribute('data-layout');
  const apiUrl = script.getAttribute('data-api-url');
  const noTracking = script.hasAttribute('data-no-tracking');
  const noAdaptColors = script.hasAttribute('data-no-adapt-colors');
  const debug = script.hasAttribute('data-debug');

  return {
    clientId: clientId || null,
    maxAds: validateMaxAds(maxAds),
    theme: validateTheme(theme),
    layout: validateLayout(layout),
    apiUrl: apiUrl || null,
    noTracking,
    adaptColors: !noAdaptColors,
    containerId: DEFAULT_CONTAINER_ID,
    debug
  };
}

/**
 * Valide le nombre maximum d'annonces
 * @param {number} value - Valeur a valider
 * @returns {number|null} Valeur validee ou null
 */
function validateMaxAds(value) {
  if (isNaN(value)) return null;
  return Math.min(Math.max(value, LIMITS.MIN_ADS), LIMITS.MAX_ADS);
}

/**
 * Valide le theme
 * @param {string} value - Valeur a valider
 * @returns {string} Theme valide
 */
function validateTheme(value) {
  const valid = Object.values(THEMES);
  return valid.includes(value) ? value : THEMES.AUTO;
}

/**
 * Valide le layout
 * @param {string} value - Valeur a valider
 * @returns {string} Layout valide
 */
function validateLayout(value) {
  const valid = Object.values(LAYOUTS);
  return valid.includes(value) ? value : LAYOUTS.AUTO;
}

/**
 * Cree une configuration complete en fusionnant les defauts
 * @param {Object} overrides - Surcharges de configuration
 * @returns {Object} Configuration complete
 */
function createConfig(overrides = {}) {
  return Object.freeze({ ...defaultConfig, ...overrides });
}

// === core/state.js ===
/**
 * Gestionnaire d'etat central du widget (Pattern Singleton + Observer)
 * @module core/state
 */

/**
 * Cree un store d'etat observable
 * @returns {Object} Store avec methodes get, set, subscribe
 */
function createStore() {
  let state = {
    initialized: false,
    loading: false,
    error: null,
    ads: [],
    visibleAds: [],
    currentLayout: null,
    currentTheme: null,
    containerWidth: 0,
    containerHeight: 0,
    sessionId: null,
    consentGiven: false,
    trackingEnabled: true
  };

  const listeners = new Set();

  /**
   * Recupere l'etat actuel
   * @returns {Object} Copie de l'etat
   */
  function getState() {
    return { ...state };
  }

  /**
   * Met a jour l'etat partiellement
   * @param {Object} partial - Proprietes a mettre a jour
   */
  function setState(partial) {
    const prevState = state;
    state = { ...state, ...partial };
    notifyListeners(prevState, state);
  }

  /**
   * Abonne un callback aux changements d'etat
   * @param {Function} listener - Callback (prevState, newState) => void
   * @returns {Function} Fonction de desabonnement
   */
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  /**
   * Notifie tous les listeners d'un changement
   * @param {Object} prevState - Etat precedent
   * @param {Object} newState - Nouvel etat
   */
  function notifyListeners(prevState, newState) {
    listeners.forEach(listener => {
      try {
        listener(prevState, newState);
      } catch (err) {
        console.error('[AnnoncesWidget] Erreur listener:', err);
      }
    });
  }

  /**
   * Reinitialise l'etat
   */
  function reset() {
    setState({
      loading: false,
      error: null,
      ads: [],
      visibleAds: []
    });
  }

  return Object.freeze({
    getState,
    setState,
    subscribe,
    reset
  });
}

// Instance singleton du store
let storeInstance = null;

/**
 * Recupere l'instance unique du store
 * @returns {Object} Store singleton
 */
function getStore() {
  if (!storeInstance) {
    storeInstance = createStore();
  }
  return storeInstance;
}

// === core/initializer.js ===
/**
 * Initialiseur du widget
 * @module core/initializer
 */














/**
 * Initialise tous les services du widget
 * @returns {Promise<Object>} Services initialises
 */
async function initializeWidget() {
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

  // Store
  const store = getStore();
  
  // Theme, dimensions et couleurs du site hote
  const theme = resolveTheme(config.theme);
  const siteColors = config.adaptColors ? extractSiteColors() : null;
  const { width, height } = measureContainer(container);
  const layout = calculateOptimalLayout(width, height, config.layout);
  const adCount = calculateOptimalAdCount(width, config.maxAds);

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

  // Charge les annonces
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

  // Observer resize
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
    const newLayout = calculateOptimalLayout(newWidth, newHeight, config.layout);
    const newAdCount = calculateOptimalAdCount(newWidth, config.maxAds);
    
    store.setState({ 
      containerWidth: newWidth, 
      containerHeight: newHeight,
      currentLayout: newLayout
    });
    
    // Si le layout change ou le nombre d'annonces optimal change, re-rendre
    if (newLayout !== state.currentLayout) {
      console.log('[AnnoncesWidget] Layout change:', state.currentLayout, '->', newLayout);
      renderer.render(state.ads, newLayout, newWidth, handleAdClick);
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

// === core/widget.js ===
/**
 * Point d'entree principal du widget
 * @module core/widget
 */
















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


})();
