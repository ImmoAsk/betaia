/**
 * Collecteur de contexte de session
 * @module tracking/contextCollector
 */

import { generateUUID, simpleHash } from '../utils/uuid.js';
import { 
  detectDeviceType, 
  getBrowserInfo, 
  getOSInfo, 
  getScreenInfo 
} from '../adapters/deviceDetector.js';
import { getItem, setItem } from '../utils/storage.js';
import { STORAGE_KEYS } from '../core/constants.js';

/**
 * Genere ou recupere l'ID de session
 * @returns {string} Session ID
 */
export function getSessionId() {
  let sessionData = getItem(STORAGE_KEYS.SESSION_DATA);
  
  if (!sessionData || !sessionData.sid) {
    sessionData = {
      sid: generateUUID(),
      started: Date.now()
    };
    setItem(STORAGE_KEYS.SESSION_DATA, sessionData);
  }
  
  return sessionData.sid;
}

/**
 * Genere un fingerprint leger de l'utilisateur
 * @returns {string} Fingerprint hash
 */
export function generateFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform || 'unknown'
  ];
  
  return simpleHash(components.join('|'));
}

/**
 * Collecte le contexte complet de la session
 * @param {string} clientId - ID du client
 * @returns {Object} Contexte de session
 */
export function collectSessionContext(clientId) {
  const browserInfo = getBrowserInfo();
  const screenInfo = getScreenInfo();
  
  return {
    cid: clientId,
    sid: getSessionId(),
    fp: generateFingerprint(),
    device: detectDeviceType(),
    browser: browserInfo.name,
    browserVer: browserInfo.version,
    os: getOSInfo(),
    sw: screenInfo.screenWidth,
    sh: screenInfo.screenHeight,
    vw: screenInfo.viewportWidth,
    vh: screenInfo.viewportHeight,
    pr: screenInfo.pixelRatio,
    lang: navigator.language || 'unknown',
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    ref: document.referrer || null,
    url: getAnonymizedUrl()
  };
}

/**
 * Recupere l'URL courante de maniere anonymisee
 * @returns {string|null} URL anonymisee
 */
function getAnonymizedUrl() {
  try {
    const url = new URL(window.location.href);
    // Supprime les parametres sensibles
    url.searchParams.delete('token');
    url.searchParams.delete('key');
    url.searchParams.delete('auth');
    url.searchParams.delete('password');
    url.searchParams.delete('email');
    return url.pathname + url.search;
  } catch (e) {
    return null;
  }
}
