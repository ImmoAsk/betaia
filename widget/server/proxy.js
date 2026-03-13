/**
 * Serveur proxy pour le widget d'annonces
 * Contourne les restrictions CORS avec retry logic
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3500;
const API_BASE = process.env.API_BASE_URL;
const IMAGE_BASE = process.env.IMAGE_BASE_URL;
const IMMOASK_URL = process.env.IMMOASK_URL || 'https://www.immoask.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const ADS_RESPONSE_CACHE_TTL_MS = 30 * 1000;
const MIN_FETCH_POOL_SIZE = 24;
const MAX_FETCH_POOL_SIZE = 90;
const DEFAULT_PREWARM_LIMIT = 20;
const DEFAULT_PREWARM_INTERVAL_MS = 20 * 1000;
const PREWARM_USAGE_VALUES = Object.freeze([1, 3, 5, 7]);
const PREWARM_INTERVAL_MS = sanitizePositiveInt(
  process.env.PROXY_PREWARM_INTERVAL_MS,
  DEFAULT_PREWARM_INTERVAL_MS
);
const adsResponseCache = new Map();
const inFlightAdsRequests = new Map();
let prewarmIntervalHandle = null;
let prewarmInFlight = false;

if (!API_BASE || !IMAGE_BASE) {
  console.error('[Proxy] ERREUR: Variables API_BASE_URL et IMAGE_BASE_URL requises dans .env');
  process.exit(1);
}

process.stdout.on('error', (error) => {
  if (error?.code !== 'EPIPE') throw error;
});

process.stderr.on('error', (error) => {
  if (error?.code !== 'EPIPE') throw error;
});

/**
 * Pause pour retry
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch avec promesse et timeout
 */
function fetchUrl(targetUrl, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;
    
    const req = client.get(targetUrl, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Fetch avec retry automatique
 */
async function fetchWithRetry(targetUrl, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchUrl(targetUrl);
    } catch (error) {
      console.warn(`[Proxy] Tentative ${attempt}/${retries} echouee:`, error.message);
      if (attempt < retries) {
        await sleep(RETRY_DELAY * attempt);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Verifie si une URL d'image est valide
 */
function isValidImageUri(uri) {
  if (!uri || typeof uri !== 'string') return false;
  if (uri.length < 5) return false;
  // Verifie extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
  const lowerUri = uri.toLowerCase();
  return validExtensions.some(ext => lowerUri.includes(ext));
}

function buildImageUrl(uri) {
  const safeUri = String(uri || '').trim();
  if (!safeUri) return '';
  if (/^https?:\/\//i.test(safeUri)) return safeUri;
  const base = String(IMAGE_BASE || '').replace(/\/+$/, '');
  const normalizedUri = safeUri.replace(/^\/+/, '');
  return `${base}/${normalizedUri}`;
}

function pickBestImageUrl(visuels) {
  if (!Array.isArray(visuels) || visuels.length === 0) return '';
  const candidate = visuels.map((visual) => visual?.uri).find(isValidImageUri);
  return candidate ? buildImageUrl(candidate) : '';
}

function sanitizeRequestLimit(value) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 6;
  return Math.min(Math.max(parsed, 1), 30);
}

function sanitizePositiveInt(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sanitizeNumericParam(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildAdsCacheKey(usage, status) {
  return `${sanitizeNumericParam(usage, 1)}:${sanitizeNumericParam(status, 1)}`;
}

function computeFetchPoolSize(requestedLimit) {
  return Math.min(Math.max(requestedLimit * 3, MIN_FETCH_POOL_SIZE), MAX_FETCH_POOL_SIZE);
}

function getCachedAdsPool(key, requestedLimit) {
  const cached = adsResponseCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.ts > ADS_RESPONSE_CACHE_TTL_MS) {
    adsResponseCache.delete(key);
    return null;
  }
  if (cached.ads.length < requestedLimit) return null;
  return cached.ads;
}

function setCachedAdsPool(key, ads, fetchLimit) {
  adsResponseCache.set(key, { ads, fetchLimit, ts: Date.now() });
}

async function getAdsPoolWithCache(requestedLimit, usage, status, loader) {
  const cacheKey = buildAdsCacheKey(usage, status);
  const fetchPoolSize = computeFetchPoolSize(requestedLimit);
  const cachedAds = getCachedAdsPool(cacheKey, requestedLimit);
  if (cachedAds) return cachedAds;
  return loadAndCacheAdsPool(cacheKey, fetchPoolSize, loader);
}

function loadAndCacheAdsPool(cacheKey, fetchPoolSize, loader) {
  const activeRequest = inFlightAdsRequests.get(cacheKey);
  if (activeRequest && activeRequest.fetchLimit >= fetchPoolSize) {
    return activeRequest.promise;
  }

  const loadPromise = loader(fetchPoolSize)
    .then((ads) => {
      setCachedAdsPool(cacheKey, ads, fetchPoolSize);
      return ads;
    })
    .finally(() => {
      if (inFlightAdsRequests.get(cacheKey)?.promise === loadPromise) {
        inFlightAdsRequests.delete(cacheKey);
      }
    });

  inFlightAdsRequests.set(cacheKey, { fetchLimit: fetchPoolSize, promise: loadPromise });
  return loadPromise;
}

/**
 * Supprime les accents (equivalent utils/toNormalForm.js)
 */
function toNormalForm(str) {
  return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Remplace les espaces par un caractere
 */
function replaceSpacesWithAny(inputString, anyThing) {
  return String(inputString || '').replace(/ /g, anyThing);
}

/**
 * Normalise une base URL (sans slash final)
 */
function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || '').replace(/\/+$/, '');
}

/**
 * Reproduit la logique de utils/getPropertyFullURL.js pour construire
 * l'URL detail d'un bien sur ImmoAsk.
 */
function getPropertyFullPath(property) {
  const categoryMap = {
    bailler: 'baux-immobiliers',
    vendre: 'ventes-immobilieres',
    louer: 'locations-immobilieres',
    investir: 'investissements-immobiliers'
  };

  const country = String(property?.pays?.code || 'tg').toLowerCase();
  const offerRaw = toNormalForm((property?.offre?.denomination || 'louer').toLowerCase());
  const category = categoryMap[offerRaw] || 'locations-immobilieres';

  const propertyTypeRaw = (property?.categorie_propriete?.denomination || 'propriete').toLowerCase();
  const propertyTypeSlug = replaceSpacesWithAny(toNormalForm(propertyTypeRaw), '-');

  const townRaw = (property?.ville?.denomination || 'lome').toLowerCase();
  const townSlug = toNormalForm(townRaw);

  // Priorite a minus_denomination si disponible (comme l'app principale)
  const quarterRaw = property?.quartier?.minus_denomination || property?.quartier?.denomination || '';
  const quarterSlug = String(quarterRaw || '').toLowerCase();

  const nuo = property?.nuo ? String(property.nuo) : '';

  // Fallback robuste si des champs critiques manquent (quartier requis pour URL detail)
  if (!propertyTypeSlug || !townSlug || !quarterSlug || !nuo) {
    return `/${country}/catalog/${nuo}`.replace(/\/+$/, '');
  }

  return `/${country}/${category}/${propertyTypeSlug}/${townSlug}/${quarterSlug}/${nuo}`;
}

/**
 * URL detail complete d'un bien
 */
function getPropertyFullUrl(property) {
  return `${normalizeBaseUrl(IMMOASK_URL)}${getPropertyFullPath(property)}`;
}

function toSafeInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function buildUsageLabel(usage) {
  if (typeof usage === 'string' && usage.trim()) {
    return usage.trim().toUpperCase();
  }

  const map = {
    1: 'LOGEMENT',
    3: 'IMMOBILIER PRO',
    5: 'SEJOUR',
    7: 'INVESTISSEMENT'
  };
  const n = toSafeInt(usage, 0);
  return map[n] || 'IMMOBILIER';
}

function buildPropertyDisplayTitle(p) {
  const nuo = p?.nuo ? `N°${p.nuo}: ` : '';
  const category = p?.categorie_propriete?.denomination || 'Propriete';
  const offer = p?.offre?.denomination ? ` à ${String(p.offre.denomination).toLowerCase()}` : '';
  const surface = p?.surface ? ` | ${p.surface}m²` : '';
  return `${nuo}${category}${offer}${surface}`.trim();
}

function extractBadgeLabel(p) {
  const badgeName = p?.badge_propriete?.[0]?.badge?.badge_name;
  if (typeof badgeName === 'string' && badgeName.trim()) return badgeName.trim();
  return '';
}

function buildAdFromProperty(property) {
  return {
    id: property.nuo,
    title: buildPropertyDisplayTitle(property),
    description: buildDesc(property),
    price: property.cout_mensuel || property.cout_vente || 0,
    currency: 'XOF',
    imageUrl: pickBestImageUrl(property.visuels),
    linkUrl: getPropertyFullUrl(property),
    location: [property.quartier?.denomination, property.ville?.denomination].filter(Boolean).join(', '),
    category: buildUsageLabel(property.usage),
    propertyType: property.categorie_propriete?.denomination || '',
    offer: property.offre?.denomination || '',
    surface: toSafeInt(property.surface, 0),
    rooms: toSafeInt(property.piece, 0),
    bathrooms: toSafeInt(property.wc_douche_interne, 0),
    garage: toSafeInt(property.garage, 0),
    badgeLabel: extractBadgeLabel(property)
  };
}

async function loadAdsPoolFromApi(fetchLimit, usage, status) {
  const graphQuery = buildPropertiesQuery(fetchLimit, usage, status);
  const apiUrl = `${API_BASE}?query=${encodeURIComponent(graphQuery)}`;
  console.log('[Proxy] Fetching:', apiUrl.substring(0, 100) + '...');

  const response = await fetchWithRetry(apiUrl);
  console.log('[Proxy] API Status:', response.status);
  if (response.status !== 200) {
    throw new Error(`API error: ${response.status}`);
  }

  const json = JSON.parse(response.data);
  const properties = Array.isArray(json.data?.getPropertiesByKeyWords)
    ? json.data.getPropertiesByKeyWords
    : [];
  const seenIds = new Set();
  const normalizedAds = properties
    .map(buildAdFromProperty)
    .filter((ad) => {
      if (!ad?.id || seenIds.has(ad.id)) return false;
      seenIds.add(ad.id);
      return true;
    });

  console.log('[Proxy] Pool annonces:', normalizedAds.length, '/', properties.length, 'brutes');
  return normalizedAds;
}

async function prewarmAdsPools() {
  if (prewarmInFlight) return;
  prewarmInFlight = true;
  const tasks = PREWARM_USAGE_VALUES.map(async (usage) => {
    try {
      const cacheKey = buildAdsCacheKey(usage, 1);
      const fetchPoolSize = computeFetchPoolSize(DEFAULT_PREWARM_LIMIT);
      await loadAndCacheAdsPool(
        cacheKey,
        fetchPoolSize,
        (nextFetchLimit) => loadAdsPoolFromApi(nextFetchLimit, usage, 1)
      );
      console.log(`[Proxy] Cache prechauffe pour usage=${usage}`);
    } catch (error) {
      console.warn(`[Proxy] Echec prechauffage usage=${usage}:`, error.message);
    }
  });
  await Promise.allSettled(tasks);
  prewarmInFlight = false;
}

function schedulePrewarm() {
  if (PREWARM_INTERVAL_MS <= 0) return;
  prewarmIntervalHandle = setInterval(() => {
    prewarmAdsPools().catch((error) => {
      console.warn('[Proxy] Echec cycle prechauffage:', error.message);
    });
  }, PREWARM_INTERVAL_MS);
  if (typeof prewarmIntervalHandle?.unref === 'function') {
    prewarmIntervalHandle.unref();
  }
  console.log(`[Proxy] Prechauffage periodique actif: ${PREWARM_INTERVAL_MS} ms`);
}

/**
 * Handler principal
 */
async function handleRequest(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const parsed = url.parse(req.url, true);
  
  // Route: /api/ads
  if (parsed.pathname === '/api/ads' && req.method === 'GET') {
    return handleAds(parsed.query, res);
  }

  // Route: /health
  if (parsed.pathname === '/health') {
    return res.end(JSON.stringify({ status: 'ok' }));
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
}

/**
 * Handler des annonces
 */
/**
 * Melange aleatoire d'un tableau (Fisher-Yates)
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Construit la query GraphQL des proprietes.
 * Le champ `pays` est volontairement omis car l'API upstream renvoie
 * regulierement une erreur GraphQL quand il est null, ce qui doublait
 * le temps de chargement a froid.
 */
function buildPropertiesQuery(fetchLimit, usage, status) {
  return `{
      getPropertiesByKeyWords(
        orderBy:{column:NUO,order:DESC},
        limit:${fetchLimit},
        usage:${parseInt(usage)},
        statut:${parseInt(status)}
      ) {
        nuo, titre, usage, cout_mensuel, cout_vente, surface, piece, wc_douche_interne, garage,
        visuels { uri },
        badge_propriete { badge { badge_name } },
        quartier { denomination, minus_denomination },
        ville { denomination },
        offre { denomination },
        categorie_propriete { denomination }
      }
    }`;
}

async function handleAds(query, res) {
  try {
    const requestedLimit = sanitizeRequestLimit(query.limit);
    const usage = sanitizeNumericParam(query.usage, 1);
    const status = sanitizeNumericParam(query.status, 1);
    const adsPool = await getAdsPoolWithCache(
      requestedLimit,
      usage,
      status,
      (fetchLimit) => loadAdsPoolFromApi(fetchLimit, usage, status)
    );
    const shuffled = shuffleArray(adsPool).slice(0, requestedLimit);
    console.log('[Proxy] Annonces servies:', shuffled.length, '/', adsPool.length, 'en cache/pool');

    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
    res.writeHead(200);
    res.end(JSON.stringify({ ads: shuffled, count: shuffled.length, redirectBase: IMMOASK_URL }));

  } catch (error) {
    console.error('[Proxy] Error:', error.message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message, ads: [] }));
  }
}

function buildDesc(p) {
  const parts = [];
  if (p.piece) parts.push(`${p.piece} piece(s)`);
  if (p.surface) parts.push(`${p.surface} m²`);
  return parts.join(' - ');
}

// Demarre le serveur
const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`[Widget Proxy] Running on http://localhost:${PORT}`);
  console.log(`[Widget Proxy] Ads endpoint: http://localhost:${PORT}/api/ads`);
  prewarmAdsPools().catch((error) => {
    console.warn('[Proxy] Echec prechauffage initial:', error.message);
  });
  schedulePrewarm();
});
