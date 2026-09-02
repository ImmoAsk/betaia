import { getPalette, generateCSSVariables } from '../adapters/colorPalettes.js';
import { coreHostStyles } from './styleParts/coreHostStyles.js';
import { headerStyles } from './styleParts/headerStyles.js';
import { filterTriggerStyles } from './styleParts/filterTriggerStyles.js';
import { filterPanelStyles } from './styleParts/filterPanelStyles.js';
import { ctaStyles } from './styleParts/ctaStyles.js';
import { responsiveStyles } from './styleParts/responsiveStyles.js';
import { generateGridLayoutStyles, generateListLayoutStyles } from './styleParts/layoutStyles.js';
import { generateAdaptiveThemeStyles } from './styleParts/adaptiveStyles.js';

export function generateBaseStyles(theme) {
  const palette = getPalette(theme);
  const vars = generateCSSVariables(palette);
  return [
    coreHostStyles(vars),
    headerStyles(),
    filterTriggerStyles(),
    filterPanelStyles(),
    ctaStyles(),
    responsiveStyles()
  ].join('\n');
}

export function generateGridStyles(columns) {
  return generateGridLayoutStyles(columns);
}

export function generateListStyles() {
  return generateListLayoutStyles();
}

export function generateAdaptiveStyles(siteColors) {
  return generateAdaptiveThemeStyles(siteColors);
}
