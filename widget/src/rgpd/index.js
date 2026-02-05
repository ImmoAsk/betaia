/**
 * Index des exports du module rgpd
 * @module rgpd
 */

export { checkConsentCookie, setConsentCookie, removeConsentCookie, isDoNotTrackEnabled, isGlobalPrivacyControlEnabled, determineTrackingPermissions } from './consentManager.js';
export { anonymizeIp, anonymizeUserAgent, hashSensitiveData, anonymizeUrl, anonymizeContext } from './dataAnonymizer.js';
export { createRGPDService } from './rgpdService.js';
