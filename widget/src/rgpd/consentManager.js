/**
 * Gestionnaire de consentement RGPD
 * @module rgpd/consentManager
 */

import { COOKIES } from '../core/constants.js';

/**
 * Verifie si le cookie de consentement existe
 * @returns {boolean} Consentement donne
 */
export function checkConsentCookie() {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === COOKIES.CONSENT && value === 'true') {
        return true;
      }
    }
  } catch (e) {
    // Ignore les erreurs d'acces aux cookies
  }
  return false;
}

/**
 * Definit le cookie de consentement
 * @param {boolean} consent - Valeur du consentement
 * @param {number} days - Duree en jours (defaut 365)
 */
export function setConsentCookie(consent, days = 365) {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    const sameSite = 'SameSite=Strict';
    const secure = location.protocol === 'https:' ? 'Secure' : '';
    
    document.cookie = `${COOKIES.CONSENT}=${consent};${expires};path=/;${sameSite};${secure}`;
  } catch (e) {
    // Ignore les erreurs d'ecriture de cookies
  }
}

/**
 * Supprime le cookie de consentement
 */
export function removeConsentCookie() {
  try {
    document.cookie = `${COOKIES.CONSENT}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  } catch (e) {
    // Ignore les erreurs
  }
}

/**
 * Verifie si Do Not Track est active
 * @returns {boolean} DNT active
 */
export function isDoNotTrackEnabled() {
  return navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    navigator.msDoNotTrack === '1';
}

/**
 * Verifie si Global Privacy Control est active
 * @returns {boolean} GPC active
 */
export function isGlobalPrivacyControlEnabled() {
  return navigator.globalPrivacyControl === true;
}

/**
 * Determine si le tracking est autorise selon RGPD
 * @param {boolean} noTrackingAttr - Attribut data-no-tracking present
 * @returns {Object} Configuration RGPD
 */
export function determineTrackingPermissions(noTrackingAttr) {
  const consentGiven = checkConsentCookie();
  const dntEnabled = isDoNotTrackEnabled();
  const gpcEnabled = isGlobalPrivacyControlEnabled();
  
  return {
    consentGiven,
    respectDNT: dntEnabled,
    respectGPC: gpcEnabled,
    anonymizeData: !consentGiven,
    trackingEnabled: !noTrackingAttr && !dntEnabled && !gpcEnabled
  };
}
