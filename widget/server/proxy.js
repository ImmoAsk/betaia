/**
 * Serveur proxy pour le widget d'annonces
 * Contourne les restrictions CORS
 */

require('dotenv').config();

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3500;
const API_BASE = process.env.API_BASE_URL;
const IMAGE_BASE = process.env.IMAGE_BASE_URL;

if (!API_BASE || !IMAGE_BASE) {
  console.error('[Proxy] ERREUR: Variables API_BASE_URL et IMAGE_BASE_URL requises dans .env');
  process.exit(1);
}

/**
 * Fetch avec promesse
 */
function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;
    
    client.get(targetUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
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
    
    const response = await fetchUrl(apiUrl);
    console.log('[Proxy] API Status:', response.status);
    console.log('[Proxy] API Data (100 chars):', response.data.substring(0, 100));
    
    if (response.status !== 200) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = JSON.parse(response.data);
    const properties = json.data?.getPropertiesByKeyWords || [];

    // Normalise pour le widget
    const ads = properties.map(p => ({
      id: p.nuo,
      title: p.titre || 'Propriete',
      description: buildDesc(p),
      price: p.cout_mensuel || p.cout_vente || 0,
      currency: 'XOF',
      imageUrl: p.visuels?.[0]?.uri ? IMAGE_BASE + p.visuels[0].uri : '',
      linkUrl: `https://betaia.com/tg/catalog/${p.nuo}`,
      location: [p.quartier?.denomination, p.ville?.denomination].filter(Boolean).join(', '),
      category: p.categorie_propriete?.denomination || ''
    }));

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
  if (p.surface) parts.push(`${p.surface} m2`);
  return parts.join(' - ');
}

// Demarre le serveur
const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`[Widget Proxy] Running on http://localhost:${PORT}`);
  console.log(`[Widget Proxy] Ads endpoint: http://localhost:${PORT}/api/ads`);
});
