import { LIMITS } from '../core/constants.js';
import { withTimeout } from '../utils/timing.js';

const DEFAULT_FETCH_LIMIT_FROM_BUILD =
  (typeof __AW_DEFAULT_MAX_ADS__ !== 'undefined' && !isNaN(parseInt(__AW_DEFAULT_MAX_ADS__, 10)))
    ? parseInt(__AW_DEFAULT_MAX_ADS__, 10)
    : 6;
const REQUEST_CONFIG = Object.freeze({ timeoutMs: 15000, maxRetries: 3, retryDelayMs: 1000 });
const RESPONSE_CACHE_TTL_MS = 15 * 1000;
const ADS_CLIENT_DEFAULT_USAGE = 1;
const ALLOWED_USAGE_VALUES = new Set([1, 3, 5, 7]);
const adsResponseCache = new Map();
const inFlightRequests = new Map();

function sanitizeLimit(value) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return DEFAULT_FETCH_LIMIT_FROM_BUILD;
  return Math.min(Math.max(parsed, LIMITS.MIN_ADS), LIMITS.MAX_ADS);
}

function sanitizeUsage(value) {
  const parsed = parseInt(value, 10);
  return ALLOWED_USAGE_VALUES.has(parsed) ? parsed : ADS_CLIENT_DEFAULT_USAGE;
}

function filterAds(rawAds) {
  const seenIds = new Set();
  return rawAds.filter((ad) => {
    const id = String(ad?.id || '').trim();
    if (!id || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });
}

function getCachedAds(requestUrl) {
  const cached = adsResponseCache.get(requestUrl);
  if (!cached) return null;
  if (Date.now() - cached.ts > RESPONSE_CACHE_TTL_MS) {
    adsResponseCache.delete(requestUrl);
    return null;
  }
  return cached.ads;
}

function setCachedAds(requestUrl, ads) {
  adsResponseCache.set(requestUrl, { ads, ts: Date.now() });
}

function createDebugLogger(debug) {
  return (...args) => { if (debug) console.log(...args); };
}

function buildRequestUrl(proxyUrl, limit, usage) {
  const params = new URLSearchParams({
    limit: String(sanitizeLimit(limit)),
    usage: String(sanitizeUsage(usage)),
    status: '1'
  });
  return `${proxyUrl}?${params.toString()}`;
}

export function createAdsClient(baseUrl, options = {}) {
  const debugLog = createDebugLogger(options.debug === true);
  const proxyUrl = `${baseUrl}/api/ads`;

  async function fetchAds(limit = DEFAULT_FETCH_LIMIT_FROM_BUILD, usage = ADS_CLIENT_DEFAULT_USAGE) {
    const requestUrl = buildRequestUrl(proxyUrl, limit, usage);
    debugLog('[AnnoncesWidget] URL Proxy:', requestUrl);
    const cachedAds = getCachedAds(requestUrl);
    if (cachedAds) return filterAds(cachedAds);
    if (inFlightRequests.has(requestUrl)) {
      return filterAds(await inFlightRequests.get(requestUrl));
    }

    const requestPromise = (async () => {
      for (let attempt = 1; attempt <= REQUEST_CONFIG.maxRetries; attempt++) {
        try {
          const response = await withTimeout(
            () => fetch(requestUrl, { method: 'GET', headers: { Accept: 'application/json' }, credentials: 'omit' }),
            REQUEST_CONFIG.timeoutMs
          );
          debugLog('[AnnoncesWidget] Response status:', response.status);
          if (!response.ok) throw new Error(`API error: ${response.status}`);
          const json = await response.json();
          const ads = Array.isArray(json.ads) ? json.ads : [];
          debugLog('[AnnoncesWidget] Annonces recues:', ads.length);
          setCachedAds(requestUrl, ads);
          return ads;
        } catch (error) {
          console.warn(`[AnnoncesWidget] Tentative ${attempt}/${REQUEST_CONFIG.maxRetries} echouee:`, error.message);
          if (attempt < REQUEST_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, REQUEST_CONFIG.retryDelayMs * attempt));
            continue;
          }
          console.error('[AnnoncesWidget] Toutes les tentatives echouees');
          throw error;
        }
      }
      return [];
    })();

    inFlightRequests.set(requestUrl, requestPromise);
    try {
      return filterAds(await requestPromise);
    } finally {
      if (inFlightRequests.get(requestUrl) === requestPromise) {
        inFlightRequests.delete(requestUrl);
      }
    }
  }

  async function prefetchAds(limit = DEFAULT_FETCH_LIMIT_FROM_BUILD, usage = ADS_CLIENT_DEFAULT_USAGE) {
    try {
      return await fetchAds(limit, usage);
    } catch (error) {
      console.warn('[AnnoncesWidget] Prefetch echoue:', error.message);
      return [];
    }
  }

  return Object.freeze({ fetchAds, prefetchAds });
}
