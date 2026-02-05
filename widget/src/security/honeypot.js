/**
 * Honeypot invisible pour detection de bots
 * @module security/honeypot
 */

import { createElement } from '../utils/dom.js';

/**
 * Cree un honeypot invisible
 * @param {Function} onTrigger - Callback si bot detecte
 * @returns {Object} Honeypot avec element et methodes
 */
export function createHoneypot(onTrigger) {
  let triggered = false;
  
  // Styles pour rendre le honeypot invisible aux humains
  const honeypotStyles = {
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    width: '1px',
    height: '1px',
    opacity: '0',
    pointerEvents: 'auto',
    overflow: 'hidden',
    tabIndex: '-1'
  };

  /**
   * Cree l'element honeypot
   * @returns {HTMLElement} Element honeypot
   */
  function createHoneypotElement() {
    const container = createElement('div', {
      className: 'aw-hp-container',
      style: honeypotStyles,
      'aria-hidden': 'true'
    });

    // Lien invisible
    const link = createElement('a', {
      href: '#aw-special-offer',
      className: 'aw-hp-link'
    }, 'Offre speciale');

    // Input invisible
    const input = createElement('input', {
      type: 'text',
      name: 'aw_phone',
      className: 'aw-hp-input',
      tabIndex: '-1',
      autocomplete: 'off'
    });

    // Listeners de detection
    link.addEventListener('click', handleTrigger);
    link.addEventListener('focus', handleTrigger);
    input.addEventListener('input', handleTrigger);
    input.addEventListener('focus', handleTrigger);

    container.appendChild(link);
    container.appendChild(input);

    return container;
  }

  /**
   * Gere le declenchement du honeypot
   * @param {Event} event - Evenement declencheur
   */
  function handleTrigger(event) {
    event.preventDefault();
    
    if (!triggered) {
      triggered = true;
      onTrigger({
        type: 'honeypot_triggered',
        element: event.target.className,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Verifie si le honeypot a ete declenche
   * @returns {boolean} Etat du honeypot
   */
  function isTriggered() {
    return triggered;
  }

  /**
   * Reinitialise le honeypot
   */
  function reset() {
    triggered = false;
  }

  return Object.freeze({
    createElement: createHoneypotElement,
    isTriggered,
    reset
  });
}
