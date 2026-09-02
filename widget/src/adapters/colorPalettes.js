/**
 * Palettes de couleurs pour les themes
 * @module adapters/colorPalettes
 */

/**
 * Palette pour le mode clair
 */
export const lightPalette = {
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
export const darkPalette = {
  background: '#1A1A1A',
  backgroundAlt: '#2A2A2A',
  border: '#444444',
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
export function getPalette(theme) {
  return theme === 'dark' ? darkPalette : lightPalette;
}

/**
 * Genere les variables CSS pour une palette
 * @param {Object} palette - Palette de couleurs
 * @param {string} prefix - Prefixe des variables CSS
 * @returns {string} CSS variables
 */
export function generateCSSVariables(palette, prefix = 'aw') {
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
export function mergePalette(basePalette, customColors) {
  const merged = { ...basePalette };
  
  Object.entries(customColors).forEach(([key, value]) => {
    if (value && merged.hasOwnProperty(key)) {
      merged[key] = value;
    }
  });
  
  return merged;
}
