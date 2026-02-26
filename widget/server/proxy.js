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

if (!API_BASE || !IMAGE_BASE) {
  console.error('[Proxy] ERREUR: Variables API_BASE_URL et IMAGE_BASE_URL requises dans .env');
  process.exit(1);
}

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
 * Construit la query GraphQL des proprietes
 * On peut inclure/exclure `pays` pour contourner un bug backend
 * (certains enregistrements ont pays=null alors que le schema le declare non-null).
 */
function buildPropertiesQuery(fetchLimit, usage, status, includeCountry = true) {
  const countryFields = includeCountry ? '\n        pays { code },' : '';

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
        offre { denomination },${countryFields}
        categorie_propriete { denomination }
      }
    }`;
}

function hasPaysNonNullableError(graphqlJson) {
  if (!Array.isArray(graphqlJson?.errors)) return false;
  return graphqlJson.errors.some(err =>
    String(err?.debugMessage || err?.message || '').includes('Propriete.pays')
  );
}

async function handleAds(query, res) {
  try {
    const { limit = 6, usage = 1, status = 1 } = query;
    const requestedLimit = parseInt(limit);
    // Fetcher plus pour avoir de la marge apres filtrage
    const fetchLimit = Math.min(requestedLimit * 3, 90);

    let graphQuery = buildPropertiesQuery(fetchLimit, usage, status, true);
    let apiUrl = `${API_BASE}?query=${encodeURIComponent(graphQuery)}`;
    console.log('[Proxy] Fetching:', apiUrl.substring(0, 100) + '...');

    let response = await fetchWithRetry(apiUrl);
    console.log('[Proxy] API Status:', response.status);

    if (response.status !== 200) {
      throw new Error(`API error: ${response.status}`);
    }

    let json = JSON.parse(response.data);

    // Fallback: certains environnements cassent si `pays` est null sur un enregistrement
    if (hasPaysNonNullableError(json)) {
      console.warn('[Proxy] Fallback query sans `pays` (champ backend non-nullable casse sur valeurs nulles)');
      graphQuery = buildPropertiesQuery(fetchLimit, usage, status, false);
      apiUrl = `${API_BASE}?query=${encodeURIComponent(graphQuery)}`;
      response = await fetchWithRetry(apiUrl);

      if (response.status !== 200) {
        throw new Error(`API error (fallback): ${response.status}`);
      }

      json = JSON.parse(response.data);
    }

    const properties = json.data?.getPropertiesByKeyWords || [];

    // Normalise pour le widget avec validation images
    const seenImages = new Set();
    const ads = [];

    for (const p of properties) {
      // Cherche la premiere image valide
      let imageUrl = '';
      if (p.visuels && Array.isArray(p.visuels)) {
        const validVisuel = p.visuels.find(v => isValidImageUri(v?.uri));
        if (validVisuel) {
          imageUrl = IMAGE_BASE + validVisuel.uri;
        }
      }

      // Exclure les annonces sans image
      if (!imageUrl) continue;

      // Exclure les doublons d'images
      if (seenImages.has(imageUrl)) continue;
      seenImages.add(imageUrl);

      ads.push({
        id: p.nuo,
        title: buildPropertyDisplayTitle(p),
        description: buildDesc(p),
        price: p.cout_mensuel || p.cout_vente || 0,
        currency: 'XOF',
        imageUrl,
        linkUrl: getPropertyFullUrl(p),
        location: [p.quartier?.denomination, p.ville?.denomination].filter(Boolean).join(', '),
        category: buildUsageLabel(p.usage),
        propertyType: p.categorie_propriete?.denomination || '',
        offer: p.offre?.denomination || '',
        surface: toSafeInt(p.surface, 0),
        rooms: toSafeInt(p.piece, 0),
        bathrooms: toSafeInt(p.wc_douche_interne, 0),
        garage: toSafeInt(p.garage, 0),
        badgeLabel: extractBadgeLabel(p)
      });
    }

    // Melange aleatoire pour varier a chaque chargement
    const shuffled = shuffleArray(ads).slice(0, requestedLimit);

    console.log('[Proxy] Annonces traitees:', shuffled.length, '/', properties.length, 'brutes');

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
});
