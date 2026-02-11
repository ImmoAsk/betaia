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
async function handleAds(query, res) {
  try {
    const { limit = 6, usage = 1, status = 1 } = query;

    const graphQuery = `{
      getPropertiesByKeyWords(
        orderBy:{column:NUO,order:DESC},
        limit:${parseInt(limit)},
        usage:${parseInt(usage)},
        statut:${parseInt(status)}
      ) {
        nuo, titre, cout_mensuel, cout_vente, surface, piece,
        visuels { uri },
        quartier { denomination },
        ville { denomination },
        categorie_propriete { denomination }
      }
    }`;

    const apiUrl = `${API_BASE}?query=${encodeURIComponent(graphQuery)}`;
    console.log('[Proxy] Fetching:', apiUrl.substring(0, 100) + '...');
    
    const response = await fetchWithRetry(apiUrl);
    console.log('[Proxy] API Status:', response.status);
    
    if (response.status !== 200) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = JSON.parse(response.data);
    const properties = json.data?.getPropertiesByKeyWords || [];

    // Normalise pour le widget avec validation images
    const ads = properties.map(p => {
      // Cherche la premiere image valide
      let imageUrl = '';
      if (p.visuels && Array.isArray(p.visuels)) {
        const validVisuel = p.visuels.find(v => isValidImageUri(v?.uri));
        if (validVisuel) {
          imageUrl = IMAGE_BASE + validVisuel.uri;
        }
      }

      return {
        id: p.nuo,
        title: p.titre || 'Propriete',
        description: buildDesc(p),
        price: p.cout_mensuel || p.cout_vente || 0,
        currency: 'XOF',
        imageUrl,
        linkUrl: `https://betaia.com/tg/catalog/${p.nuo}`,
        location: [p.quartier?.denomination, p.ville?.denomination].filter(Boolean).join(', '),
        category: p.categorie_propriete?.denomination || ''
      };
    });

    console.log('[Proxy] Annonces traitees:', ads.length, 'avec images:', ads.filter(a => a.imageUrl).length);

    res.writeHead(200);
    res.end(JSON.stringify({ ads, count: ads.length }));

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
