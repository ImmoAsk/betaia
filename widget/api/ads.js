const http = require('http');
const https = require('https');
const url = require('url');

const API_BASE = process.env.API_BASE_URL;
const IMAGE_BASE = process.env.IMAGE_BASE_URL;
const IMMOASK_URL = process.env.IMMOASK_URL || 'https://www.immoask.com';

const ADS_RESPONSE_CACHE_TTL_MS = 30 * 1000;
const MIN_FETCH_POOL_SIZE = 24;
const MAX_FETCH_POOL_SIZE = 90;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

if (!API_BASE || !IMAGE_BASE) {
  console.error('[Widget API] ERREUR: API_BASE_URL et IMAGE_BASE_URL requises.');
}

const adsResponseCache = new Map();
const inFlightAdsRequests = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toSafeInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function sanitizePositiveInt(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sanitizeRequestLimit(value) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 6;
  return Math.min(Math.max(parsed, 1), 30);
}

function sanitizeNumericParam(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || '').replace(/\/+$/, '');
}

function toNormalForm(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function replaceSpacesWithAny(inputString, anyThing) {
  return String(inputString || '').replace(/ /g, anyThing);
}

function buildPropertiesQuery(fetchLimit, usage, status) {
  return `{
    getPropertiesByKeyWords(
      orderBy:{column:NUO,order:DESC},
      limit:${fetchLimit},
      usage:${parseInt(usage, 10)},
      statut:${parseInt(status, 10)}
    ) {
      nuo, titre, usage, cout_mensuel, cout_vente, surface, piece, wc_douche_interne, garage,
      visuels { uri },
      badge_propriete { badge { badge_name } },
      quartier { denomination, minus_denomination },
      ville { denomination },
      offre { denomination },
      categorie_propriete { denomination },
      pays { code }
    }
  }`;
}

function buildImageUrl(uri) {
  const safeUri = String(uri || '').trim();
  if (!safeUri) return '';
  if (/^https?:\/\//i.test(safeUri)) return safeUri;
  const base = normalizeBaseUrl(IMAGE_BASE);
  return `${base}/${safeUri.replace(/^\/+/, '')}`;
}

function isValidImageUri(uri) {
  if (!uri || typeof uri !== 'string') return false;
  if (uri.length < 5) return false;
  const ext = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
  const lower = uri.toLowerCase();
  return ext.some((item) => lower.includes(item));
}

function pickBestImageUrl(visuels) {
  if (!Array.isArray(visuels) || visuels.length === 0) return '';
  const first = visuels.map((visual) => visual?.uri).find(isValidImageUri);
  return first ? buildImageUrl(first) : '';
}

function buildPropertyFullPath(property) {
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
  const quarterRaw = property?.quartier?.minus_denomination || property?.quartier?.denomination || '';
  const quarterSlug = String(quarterRaw || '').toLowerCase();
  const nuo = property?.nuo ? String(property.nuo) : '';

  if (!propertyTypeSlug || !townSlug || !quarterSlug || !nuo) {
    return `/${country}/catalog/${nuo}`.replace(/\/+$/, '');
  }

  return `/${country}/${category}/${propertyTypeSlug}/${townSlug}/${quarterSlug}/${nuo}`;
}

function buildPropertyFullUrl(property) {
  return `${normalizeBaseUrl(IMMOASK_URL)}${buildPropertyFullPath(property)}`;
}

function buildAdFromProperty(property) {
  return {
    id: property.nuo,
    title: buildPropertyDisplayTitle(property),
    description: buildDesc(property),
    price: property.cout_mensuel || property.cout_vente || 0,
    currency: 'XOF',
    imageUrl: pickBestImageUrl(property.visuels),
    linkUrl: buildPropertyFullUrl(property),
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

function buildUsageLabel(usage) {
  if (typeof usage === 'string' && usage.trim()) return usage.trim().toUpperCase();
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

function buildDesc(p) {
  const parts = [];
  if (p.piece) parts.push(`${p.piece} piece(s)`);
  if (p.surface) parts.push(`${p.surface} m²`);
  return parts.join(' - ');
}

function extractBadgeLabel(p) {
  const badgeName = p?.badge_propriete?.[0]?.badge?.badge_name;
  if (typeof badgeName === 'string' && badgeName.trim()) return badgeName.trim();
  return '';
}

function writeCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
}

function parseNumberRange(value, fallback, min, max) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  if (typeof min === 'number') {
    return Math.max(min, Math.min(parsed, typeof max === 'number' ? max : parsed));
  }
  return parsed;
}

function buildAdsCacheKey(usage, status) {
  return `${parseNumericParam(usage, 1)}:${parseNumericParam(status, 1)}`;
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

function setCachedAdsPool(key, ads) {
  adsResponseCache.set(key, { ads, ts: Date.now() });
}

function fetchWithRetry(targetUrl, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const doAttempt = (attempt) => {
      const req = client.get(targetUrl, { timeout: 15000 }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, data });
        });
      });

      req.on('error', async (error) => {
        if (attempt < retries) {
          await sleep(RETRY_DELAY * attempt);
          doAttempt(attempt + 1);
          return;
        }
        reject(error);
      });

      req.on('timeout', async () => {
        req.destroy();
        if (attempt < retries) {
          await sleep(RETRY_DELAY * attempt);
          doAttempt(attempt + 1);
          return;
        }
        reject(new Error('Request timeout'));
      });
    };

    doAttempt(1);
  });
}

function loadAdsPoolFromApi(fetchLimit, usage, status) {
  const graphQuery = buildPropertiesQuery(fetchLimit, usage, status);
  const apiUrl = `${API_BASE}?query=${encodeURIComponent(graphQuery)}`;
  return fetchWithRetry(apiUrl)
    .then((response) => {
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

      return normalizedAds;
    });
}

function loadAndCacheAdsPool(cacheKey, fetchPoolSize, usage, status) {
  const activeRequest = inFlightAdsRequests.get(cacheKey);
  if (activeRequest && activeRequest.fetchLimit >= fetchPoolSize) {
    return activeRequest.promise;
  }

  const loadPromise = loadAdsPoolFromApi(fetchPoolSize, usage, status)
    .then((ads) => {
      setCachedAdsPool(cacheKey, ads);
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

function getAdsPoolWithCache(requestedLimit, usage, status) {
  const cacheKey = buildAdsCacheKey(usage, status);
  const fetchPoolSize = computeFetchPoolSize(requestedLimit);
  const cachedAds = getCachedAdsPool(cacheKey, requestedLimit);
  if (cachedAds) return Promise.resolve(cachedAds);
  return loadAndCacheAdsPool(cacheKey, fetchPoolSize, usage, status);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function handleAds(query, res) {
  try {
    const requestedLimit = sanitizeRequestLimit(query.limit);
    const usage = sanitizeNumericParam(query.usage, 1);
    const status = sanitizeNumericParam(query.status, 1);

    const adsPool = await getAdsPoolWithCache(requestedLimit, usage, status);
    const shuffled = shuffleArray(adsPool).slice(0, requestedLimit);

    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
    res.statusCode = 200;
    res.end(JSON.stringify({ ads: shuffled, count: shuffled.length, redirectBase: IMMOASK_URL }));
  } catch (error) {
    console.error('[Widget API] Error:', error.message);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message, ads: [] }));
  }
}

function parseNumericParam(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = async (req, res) => {
  writeCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (!API_BASE || !IMAGE_BASE) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'SERVER_CONFIG_ERROR', ads: [] }));
    return;
  }

  const parsed = url.parse(req.url || '', true);
  const pathname = (parsed.pathname || '/').replace(/\/+$/, '');
  if (pathname !== '' && pathname !== '/' && pathname !== '/api/ads') {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found', ads: [] }));
    return;
  }

  await handleAds(parsed.query || {}, res);
};
