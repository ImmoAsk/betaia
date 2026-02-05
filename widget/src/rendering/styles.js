/**
 * Styles CSS encapsules pour le widget
 * @module rendering/styles
 */

import { getPalette, generateCSSVariables } from '../adapters/colorPalettes.js';

/**
 * Genere les styles de base du widget
 * @param {string} theme - Theme actif
 * @returns {string} CSS du widget
 */
export function generateBaseStyles(theme) {
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
export function generateGridStyles(columns) {
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
export function generateListStyles() {
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
export function generateAdaptiveStyles(siteColors) {
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
