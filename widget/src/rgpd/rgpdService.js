/**
 * Service RGPD principal
 * @module rgpd/rgpdService
 */

import { 
  checkConsentCookie, 
  setConsentCookie, 
  removeConsentCookie,
  determineTrackingPermissions 
} from './consentManager.js';
import { anonymizeContext } from './dataAnonymizer.js';
import { removeItem } from '../utils/storage.js';
import { STORAGE_KEYS } from '../core/constants.js';

/**
 * Cree le service RGPD
 * @param {boolean} noTrackingAttr - Attribut data-no-tracking present
 * @returns {Object} Service RGPD
 */
export function createRGPDService(noTrackingAttr) {
  let permissions = determineTrackingPermissions(noTrackingAttr);
  const listeners = new Set();

  /**
   * Recupere les permissions actuelles
   * @returns {Object} Permissions RGPD
   */
  function getPermissions() {
    return { ...permissions };
  }

  /**
   * Enregistre le consentement de l'utilisateur
   */
  function giveConsent() {
    setConsentCookie(true);
    permissions = {
      ...permissions,
      consentGiven: true,
      anonymizeData: false,
      trackingEnabled: !noTrackingAttr
    };
    notifyListeners();
  }

  /**
   * Revoque le consentement de l'utilisateur
   */
  function revokeConsent() {
    removeConsentCookie();
    clearUserData();
    permissions = {
      ...permissions,
      consentGiven: false,
      anonymizeData: true,
      trackingEnabled: false
    };
    notifyListeners();
  }

  /**
   * Nettoie toutes les donnees utilisateur
   */
  function clearUserData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      removeItem(key);
    });
  }

  /**
   * Prepare les donnees pour envoi selon les permissions
   * @param {Object} context - Contexte de tracking
   * @returns {Object} Contexte prepare
   */
  function prepareDataForSending(context) {
    if (permissions.anonymizeData) {
      return anonymizeContext(context);
    }
    return context;
  }

  /**
   * Verifie si le tracking est autorise
   * @returns {boolean} Tracking autorise
   */
  function isTrackingAllowed() {
    return permissions.trackingEnabled && 
      !permissions.respectDNT && 
      !permissions.respectGPC;
  }

  /**
   * Abonne un callback aux changements de permissions
   * @param {Function} callback - Callback a appeler
   * @returns {Function} Fonction de desabonnement
   */
  function onPermissionsChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  /**
   * Notifie les listeners des changements
   */
  function notifyListeners() {
    listeners.forEach(callback => {
      try {
        callback(permissions);
      } catch (e) {
        // Ignore les erreurs des callbacks
      }
    });
  }

  /**
   * Recupere le statut de consentement
   * @returns {Object} Statut de consentement
   */
  function getConsentStatus() {
    return {
      consentGiven: permissions.consentGiven,
      dntEnabled: permissions.respectDNT,
      gpcEnabled: permissions.respectGPC,
      trackingActive: isTrackingAllowed()
    };
  }

  return Object.freeze({
    getPermissions,
    giveConsent,
    revokeConsent,
    clearUserData,
    prepareDataForSending,
    isTrackingAllowed,
    onPermissionsChange,
    getConsentStatus
  });
}
