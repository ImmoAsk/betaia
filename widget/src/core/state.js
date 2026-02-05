/**
 * Gestionnaire d'etat central du widget (Pattern Singleton + Observer)
 * @module core/state
 */

/**
 * Cree un store d'etat observable
 * @returns {Object} Store avec methodes get, set, subscribe
 */
export function createStore() {
  let state = {
    initialized: false,
    loading: false,
    error: null,
    ads: [],
    visibleAds: [],
    currentLayout: null,
    currentTheme: null,
    containerWidth: 0,
    containerHeight: 0,
    sessionId: null,
    consentGiven: false,
    trackingEnabled: true
  };

  const listeners = new Set();

  /**
   * Recupere l'etat actuel
   * @returns {Object} Copie de l'etat
   */
  function getState() {
    return { ...state };
  }

  /**
   * Met a jour l'etat partiellement
   * @param {Object} partial - Proprietes a mettre a jour
   */
  function setState(partial) {
    const prevState = state;
    state = { ...state, ...partial };
    notifyListeners(prevState, state);
  }

  /**
   * Abonne un callback aux changements d'etat
   * @param {Function} listener - Callback (prevState, newState) => void
   * @returns {Function} Fonction de desabonnement
   */
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  /**
   * Notifie tous les listeners d'un changement
   * @param {Object} prevState - Etat precedent
   * @param {Object} newState - Nouvel etat
   */
  function notifyListeners(prevState, newState) {
    listeners.forEach(listener => {
      try {
        listener(prevState, newState);
      } catch (err) {
        console.error('[AnnoncesWidget] Erreur listener:', err);
      }
    });
  }

  /**
   * Reinitialise l'etat
   */
  function reset() {
    setState({
      loading: false,
      error: null,
      ads: [],
      visibleAds: []
    });
  }

  return Object.freeze({
    getState,
    setState,
    subscribe,
    reset
  });
}

// Instance singleton du store
let storeInstance = null;

/**
 * Recupere l'instance unique du store
 * @returns {Object} Store singleton
 */
export function getStore() {
  if (!storeInstance) {
    storeInstance = createStore();
  }
  return storeInstance;
}
