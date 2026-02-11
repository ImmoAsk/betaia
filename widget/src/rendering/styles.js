/**
 * Styles CSS encapsules pour le widget
 * Design compact et minimal type publicite
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
      width: 100%;
      max-width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      box-sizing: border-box;
      container-type: inline-size;
    }
    
    *, *::before, *::after {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
    }
    
    .aw-container {
      width: 100%;
      max-width: 100%;
      background: var(--aw-background);
      color: var(--aw-text);
      border-radius: 4px;
      overflow: hidden;
      container-type: inline-size;
      border: 1px solid var(--aw-border);
      box-sizing: border-box;
    }
    
    .aw-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 6px;
      font-size: 8px;
      color: var(--aw-text-muted);
      border-bottom: 1px solid var(--aw-border);
      opacity: 0.6;
    }
    
    .aw-header-label {
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    
    .aw-header-brand {
      font-weight: 600;
      opacity: 0.6;
    }
    
    .aw-loading {
      padding: 10px;
      text-align: center;
      font-size: 11px;
    }
    
    .aw-error {
      padding: 10px;
      text-align: center;
      color: var(--aw-error);
      font-size: 11px;
    }
    
    .aw-skeleton {
      background: linear-gradient(90deg, 
        var(--aw-background-alt) 25%, 
        var(--aw-border) 50%, 
        var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
      border-radius: 3px;
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
      outline-offset: 1px;
    }
  `;
}

/**
 * Genere les styles pour le layout grid compact
 * @param {number} columns - Nombre de colonnes (base)
 * @returns {string} CSS du grid
 */
export function generateGridStyles(columns) {
  return `
    .aw-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 4px;
      padding: 4px;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    
    @container (max-width: 250px) {
      .aw-grid {
        grid-template-columns: 1fr;
        gap: 4px;
        padding: 4px;
      }
    }
    
    @container (min-width: 251px) and (max-width: 450px) {
      .aw-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }
    }
    
    @container (min-width: 451px) and (max-width: 700px) {
      .aw-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @container (min-width: 701px) {
      .aw-grid {
        grid-template-columns: repeat(${Math.min(columns, 4)}, 1fr);
      }
    }
    
    @supports not (container-type: inline-size) {
      @media (max-width: 350px) {
        .aw-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  `;
}

/**
 * Genere les styles pour le layout list compact
 * @returns {string} CSS de la liste
 */
export function generateListStyles() {
  return `
    .aw-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 3px;
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
