/**
 * Detecteur de theme (clair/sombre) du site hote
 * @module adapters/themeDetector
 */

import { THEMES } from '../core/constants.js';

/**
 * Detecte le theme prefere via media query
 * @returns {string} 'light' ou 'dark'
 */
export function detectPreferredColorScheme() {
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
export function detectSiteTheme() {
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
export function extractCSSVariables() {
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
export function extractSiteColors() {
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
    
    // Bordure : on ignore les couleurs trop sombres (noir) ou trop claires
    const bordered = document.querySelector('[style*="border"], .card, .panel, article');
    if (bordered) {
      const borderRgb = parseColor(getComputedStyle(bordered).borderColor);
      if (borderRgb) {
        const lum = getLuminance(borderRgb.r, borderRgb.g, borderRgb.b);
        // Ne garder que les gris intermediaires (pas noir, pas blanc)
        if (lum > 0.05 && lum < 0.85) {
          colors.border = rgbToHex(borderRgb);
        }
      }
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
export function resolveTheme(configTheme) {
  if (configTheme && configTheme !== THEMES.AUTO) {
    return configTheme;
  }
  return detectSiteTheme();
}
