/**
 * Utilitaires DOM securises
 * @module utils/dom
 */

/**
 * Echappe les caracteres HTML pour prevenir XSS
 * @param {string} str - Chaine a echapper
 * @returns {string} Chaine echappee
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;'
  };
  return str.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Cree un element DOM de maniere securisee
 * @param {string} tag - Nom de la balise
 * @param {Object} attrs - Attributs a appliquer
 * @param {string|Node[]} children - Contenu enfant
 * @returns {HTMLElement} Element cree
 */
export function createElement(tag, attrs = {}, children = null) {
  const el = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (value == null || key.startsWith('on')) return;
    if (key === 'className') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key === 'textContent') {
      el.textContent = value;
    } else {
      el.setAttribute(key, String(value));
    }
  });

  if (children) {
    if (typeof children === 'string') {
      el.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Node) el.appendChild(child);
      });
    }
  }

  return el;
}

/**
 * Requete animationFrame avec fallback
 * @param {Function} callback - Fonction a executer
 * @returns {number} ID de la frame
 */
export function requestFrame(callback) {
  return (window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame ||
    (cb => setTimeout(cb, 16)))(callback);
}

/**
 * Annule une frame demandee
 * @param {number} id - ID de la frame
 */
export function cancelFrame(id) {
  (window.cancelAnimationFrame || 
    window.webkitCancelAnimationFrame ||
    clearTimeout)(id);
}
