/**
 * Script de build du widget
 * Bundle tous les modules en un seul fichier
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const dotenv = require('dotenv');

const isDev = process.argv.includes('--dev');
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');
const envPath = path.join(__dirname, '..', '.env');

function getBuildDefaults() {
  let widgetDefaultMaxAds = null;

  try {
    if (fs.existsSync(envPath)) {
      const parsed = dotenv.parse(fs.readFileSync(envPath, 'utf8'));
      const n = parseInt(parsed.WIDGET_DEFAULT_MAX_ADS, 10);
      if (!isNaN(n)) widgetDefaultMaxAds = n;
    }
  } catch (e) {
    console.warn('[Build] Impossible de lire .env pour les defaults widget:', e.message);
  }

  return { widgetDefaultMaxAds };
}

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
  'security/sanitizer.js',
  'security/fraudDetector.js',
  'security/honeypot.js',
  'security/securityService.js',
  'rendering/styles.js',
  'rendering/cardStyles.js',
  'rendering/skeletonStyles.js',
  'rendering/cardFactory.js',
  'rendering/layoutGrid.js',
  'rendering/layoutList.js',
  'rendering/gridSlider.js',
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
async function build() {
  console.log('[Build] Demarrage...');
  const buildDefaults = getBuildDefaults();
  console.log('[Build] Default max ads (env):', buildDefaults.widgetDefaultMaxAds ?? 'none');
  
  // Cree le dossier dist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Header du bundle
  const header = `/**
 * ImmoAsk Widget v1.0.0
 * Bundle genere le ${new Date().toISOString()}
 * 
 * INTEGRATION MULTI-INSTANCE :
 * <div data-immoask></div>
 * <div data-immoask data-orientation="vertical"></div>
 * <script src="widget.js" data-api-url="URL"></script>
 * 
 * OPTIONS (data-* sur le div) :
 * - data-max-ads, data-layout, data-orientation, data-theme, data-api-url
 */
`;

  // Concatene les modules
  let bundle = header + '(function() {\n"use strict";\n\n';
  bundle += `const __AW_DEFAULT_MAX_ADS__ = ${
    Number.isInteger(buildDefaults.widgetDefaultMaxAds) ? buildDefaults.widgetDefaultMaxAds : 'null'
  };\n\n`;
  
  for (const modulePath of moduleOrder) {
    try {
      bundle += processModule(modulePath);
    } catch (e) {
      console.error(`[Build] Erreur module ${modulePath}:`, e.message);
    }
  }
  
  bundle += '\n})();\n';

  // Obfuscation avec Terser
  console.log('[Build] Obfuscation du code...');
  try {
    const minified = await minify(bundle, {
      compress: {
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        keep_classnames: false,
        keep_fnames: false,
        passes: 3
      },
      mangle: {
        toplevel: true,
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: /^!/,
        preamble: header
      }
    });
    
    if (minified.code) {
      bundle = minified.code;
      console.log('[Build] Obfuscation reussie');
    }
  } catch (e) {
    console.error('[Build] Erreur obfuscation:', e.message);
  }

  // Ecrit le bundle
  const outputPath = path.join(distDir, 'widget.js');
  fs.writeFileSync(outputPath, bundle);
  
  const stats = fs.statSync(outputPath);
  console.log(`[Build] Bundle cree: ${outputPath}`);
  console.log(`[Build] Taille: ${(stats.size / 1024).toFixed(2)} KB`);
}

build();
