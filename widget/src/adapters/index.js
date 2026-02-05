/**
 * Index des exports du module adapters
 * @module adapters
 */

export { detectPreferredColorScheme, detectSiteTheme, extractCSSVariables, resolveTheme } from './themeDetector.js';
export { lightPalette, darkPalette, getPalette, generateCSSVariables, mergePalette } from './colorPalettes.js';
export { measureContainer, calculateOptimalAdCount, calculateOptimalLayout, createResizeObserver } from './spaceDetector.js';
export { detectDeviceType, getBrowserInfo, getOSInfo, getScreenInfo, hasTouchSupport } from './deviceDetector.js';
