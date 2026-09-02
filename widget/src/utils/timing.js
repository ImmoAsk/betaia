/**
 * Utilitaires de timing (debounce, throttle)
 * @module utils/timing
 */

/**
 * Cree une fonction debounced
 * @param {Function} fn - Fonction a debouncer
 * @param {number} delay - Delai en ms
 * @returns {Function} Fonction debounced avec methode cancel
 */
export function debounce(fn, delay) {
  let timeoutId = null;

  function debounced(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Cree une fonction throttled
 * @param {Function} fn - Fonction a throttler
 * @param {number} limit - Intervalle minimum en ms
 * @returns {Function} Fonction throttled
 */
export function throttle(fn, limit) {
  let lastCall = 0;
  let timeoutId = null;

  function throttled(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttled;
}

/**
 * Attend un delai specifique
 * @param {number} ms - Delai en millisecondes
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute une fonction avec timeout
 * @param {Function} fn - Fonction a executer
 * @param {number} timeout - Timeout en ms
 * @returns {Promise<any>} Resultat ou erreur timeout
 */
export function withTimeout(fn, timeout) {
  return Promise.race([
    fn(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}
