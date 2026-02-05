/**
 * Script de build du widget
 * Bundle tous les modules en un seul fichier
 */

const fs = require('fs');
const path = require('path');

const isDev = process.argv.includes('--dev');
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Ordre de concatenation des modules
const moduleOrder = [
  'core/constants.js',
  'utils/uuid.js',
  'utils/dom.js',
  'utils/timing.js',
  'utils/storage.js',
  'adapters/colorPalettes.js',
  'adapters/themeDetector.js',
  'adapters/deviceDetector.js',
  'adapters/spaceDetector.js',
  'tracking/eventTypes.js',
  'tracking/eventFactory.js',
  'tracking/eventQueue.js',
  'tracking/eventSender.js',
  'tracking/contextCollector.js',
  'tracking/visibilityObserver.js',
  'tracking/interactionObserver.js',
  'tracking/trackingService.js',
  'security/sanitizer.js',
  'security/fraudDetector.js',
  'security/honeypot.js',
  'security/securityService.js',
  'rgpd/consentManager.js',
  'rgpd/dataAnonymizer.js',
  'rgpd/rgpdService.js',
  'rendering/styles.js',
  'rendering/cardStyles.js',
  'rendering/carouselStyles.js',
  'rendering/skeletonStyles.js',
  'rendering/cardFactory.js',
  'rendering/layoutGrid.js',
  'rendering/layoutList.js',
  'rendering/layoutCarousel.js',
  'rendering/carouselController.js',
  'rendering/carouselManager.js',
  'rendering/renderer.js',
  'rotation/scoringEngine.js',
  'rotation/viewedHistory.js',
  'rotation/behaviorDetector.js',
  'rotation/rotationService.js',
  'api/endpoints.js',
  'api/adsCache.js',
  'api/adsClient.js',
  'api/publicApi.js',
  'core/config.js',
  'core/state.js',
  'core/initializer.js',
  'core/widget.js'
];

/**
 * Lit et traite un fichier source
 */
function processModule(modulePath) {
  const fullPath = path.join(srcDir, modulePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Supprime les imports (simples et multi-lignes)
  content = content.replace(/^import\s+[\s\S]*?\s+from\s+['"].*['"];?\s*$/gm, '');
  content = content.replace(/^import\s*\{[\s\S]*?\}\s*from\s*['"].*['"];?\s*$/gm, '');
  
  // Supprime les exports
  content = content.replace(/^export\s+(default\s+)?/gm, '');
  
  return `// === ${modulePath} ===\n${content}\n`;
}

/**
 * Build principal
 */
function build() {
  console.log('[Build] Demarrage...');
  
  // Cree le dossier dist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Header du bundle
  const header = `/**
 * Annonces Widget v1.0.0
 * Bundle genere le ${new Date().toISOString()}
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
`;

  // Concatene les modules
  let bundle = header + '(function() {\n"use strict";\n\n';
  
  for (const modulePath of moduleOrder) {
    try {
      bundle += processModule(modulePath);
    } catch (e) {
      console.error(`[Build] Erreur module ${modulePath}:`, e.message);
    }
  }
  
  bundle += '\n})();\n';

  // Ecrit le bundle
  const outputPath = path.join(distDir, 'widget.js');
  fs.writeFileSync(outputPath, bundle);
  
  const stats = fs.statSync(outputPath);
  console.log(`[Build] Bundle cree: ${outputPath}`);
  console.log(`[Build] Taille: ${(stats.size / 1024).toFixed(2)} KB`);
}

build();
