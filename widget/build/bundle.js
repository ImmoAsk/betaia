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
const assetsDir = path.join(__dirname, '..', 'assets');

function parsePositiveInt(value) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseNonEmptyString(value) {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  return s ? s : null;
}

function getEnvValueFromBuildEnvironment(envObj, key) {
  return parseNonEmptyString(envObj[key]);
}

function getBuildDefaults() {
  let widgetDefaultMaxAds = null;
  let widgetDefaultSlideIntervalMs = null;
  let widgetUtmMedium = null;
  let widgetUtmCampaign = null;
  let widgetMagazineUrl = null;
  let widgetAppUrl = null;
  let widgetAppAndroidUrl = null;
  let widgetAppIosUrl = null;
  let widgetMagazineLabel = null;
  let widgetMagazineDownloadName = null;
  let widgetAppLabel = null;
  let widgetApiBaseUrl = null;
  const envFromProcess = process.env || {};
  const envFromFile = {};

  try {
    if (fs.existsSync(envPath)) {
      const parsed = dotenv.parse(fs.readFileSync(envPath, 'utf8'));
      Object.assign(envFromFile, parsed);
    }
  } catch (e) {
    console.warn('[Build] Impossible de lire .env pour les defaults widget:', e.message);
  }

  const getBuildValue = (key, parser = parseNonEmptyString) => {
    const value =
      getEnvValueFromBuildEnvironment(envFromProcess, key) ??
      getEnvValueFromBuildEnvironment(envFromFile, key);
    return parser(value);
  };

  widgetDefaultMaxAds = parsePositiveInt(
    getBuildValue('WIDGET_DEFAULT_MAX_ADS', parseInt) ?? widgetDefaultMaxAds
  );
  widgetDefaultSlideIntervalMs = parsePositiveInt(
    getBuildValue('WIDGET_DEFAULT_SLIDE_INTERVAL_MS', parseInt) ?? widgetDefaultSlideIntervalMs
  );
  widgetUtmMedium = getBuildValue('WIDGET_UTM_MEDIUM');
  widgetUtmCampaign = getBuildValue('WIDGET_UTM_CAMPAIGN');
  widgetMagazineUrl = getBuildValue('WIDGET_MAGAZINE_URL');
  widgetAppUrl = getBuildValue('WIDGET_APP_URL');
  widgetAppAndroidUrl = getBuildValue('WIDGET_APP_ANDROID_URL');
  widgetAppIosUrl = getBuildValue('WIDGET_APP_IOS_URL');
  widgetMagazineLabel = getBuildValue('WIDGET_MAGAZINE_LABEL');
  widgetMagazineDownloadName = getBuildValue('WIDGET_MAGAZINE_DOWNLOAD_NAME');
  widgetAppLabel = getBuildValue('WIDGET_APP_LABEL');
  widgetApiBaseUrl = getBuildValue('WIDGET_API_BASE_URL');

  return {
    widgetDefaultMaxAds,
    widgetDefaultSlideIntervalMs,
    widgetUtmMedium,
    widgetUtmCampaign,
    widgetMagazineUrl,
    widgetAppUrl,
    widgetAppAndroidUrl,
    widgetAppIosUrl,
    widgetMagazineLabel,
    widgetMagazineDownloadName,
    widgetAppLabel,
    widgetApiBaseUrl
  };
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
  'rendering/styleParts/coreHostStyles.js',
  'rendering/styleParts/headerStyles.js',
  'rendering/styleParts/filterTriggerStyles.js',
  'rendering/styleParts/filterPanelStyles.js',
  'rendering/styleParts/ctaStyles.js',
  'rendering/styleParts/responsiveStyles.js',
  'rendering/styleParts/layoutStyles.js',
  'rendering/styleParts/adaptiveStyles.js',
  'rendering/styles.js',
  'rendering/cardStyles.js',
  'rendering/skeletonStyles.js',
  'rendering/cardFactory.js',
  'rendering/layoutGrid.js',
  'rendering/layoutList.js',
  'rendering/gridSlider.js',
  'rendering/filterControl.js',
  'rendering/brandHeader.js',
  'rendering/footerCtas.js',
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

function copyStaticAssets() {
  if (!fs.existsSync(assetsDir)) return;
  const entries = fs.readdirSync(assetsDir, { withFileTypes: true });
  entries
    .filter((entry) => entry.isFile())
    .forEach((entry) => {
      const sourcePath = path.join(assetsDir, entry.name);
      const targetPath = path.join(distDir, entry.name);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`[Build] Asset copie: ${entry.name}`);
    });
}

/**
 * Build principal
 */
async function build() {
  console.log('[Build] Demarrage...');
  const buildDefaults = getBuildDefaults();
  console.log('[Build] Default max ads (env):', buildDefaults.widgetDefaultMaxAds ?? 'none');
  console.log('[Build] Default slide interval (env):', buildDefaults.widgetDefaultSlideIntervalMs ?? 'none');
  
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
  const toJsString = (value) => (typeof value === 'string' ? JSON.stringify(value) : 'null');
  bundle += `const __AW_DEFAULT_MAX_ADS__ = ${
    Number.isInteger(buildDefaults.widgetDefaultMaxAds) ? buildDefaults.widgetDefaultMaxAds : 'null'
  };\n\n`;
  bundle += `const __AW_DEFAULT_SLIDE_INTERVAL_MS__ = ${
    Number.isInteger(buildDefaults.widgetDefaultSlideIntervalMs) ? buildDefaults.widgetDefaultSlideIntervalMs : 'null'
  };\n`;
  bundle += `const __AW_UTM_MEDIUM__ = ${toJsString(buildDefaults.widgetUtmMedium)};\n`;
  bundle += `const __AW_UTM_CAMPAIGN__ = ${toJsString(buildDefaults.widgetUtmCampaign)};\n`;
  bundle += `const __AW_MAGAZINE_URL__ = ${toJsString(buildDefaults.widgetMagazineUrl)};\n`;
  bundle += `const __AW_APP_URL__ = ${toJsString(buildDefaults.widgetAppUrl)};\n`;
  bundle += `const __AW_APP_ANDROID_URL__ = ${toJsString(buildDefaults.widgetAppAndroidUrl)};\n`;
  bundle += `const __AW_APP_IOS_URL__ = ${toJsString(buildDefaults.widgetAppIosUrl)};\n`;
  bundle += `const __AW_MAGAZINE_LABEL__ = ${toJsString(buildDefaults.widgetMagazineLabel)};\n`;
  bundle += `const __AW_MAGAZINE_DOWNLOAD_NAME__ = ${toJsString(buildDefaults.widgetMagazineDownloadName)};\n`;
  bundle += `const __AW_APP_LABEL__ = ${toJsString(buildDefaults.widgetAppLabel)};\n`;
  bundle += `const __AW_WIDGET_API_BASE_URL__ = ${toJsString(buildDefaults.widgetApiBaseUrl)};\n\n`;
  
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
  copyStaticAssets();
  
  const stats = fs.statSync(outputPath);
  console.log(`[Build] Bundle cree: ${outputPath}`);
  console.log(`[Build] Taille: ${(stats.size / 1024).toFixed(2)} KB`);
}

build();
