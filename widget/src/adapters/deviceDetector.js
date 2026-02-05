/**
 * Detecteur de type d'appareil et capacites
 * @module adapters/deviceDetector
 */

/**
 * Detecte le type d'appareil
 * @returns {string} 'mobile', 'tablet', ou 'desktop'
 */
export function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  
  // Detection mobile via user agent
  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTabletUA = /ipad|tablet|playbook|silk/i.test(ua);
  
  // Detection via taille d'ecran
  const isMobileSize = width < 768;
  const isTabletSize = width >= 768 && width < 1024;
  
  if (isTabletUA || (isMobileUA && isTabletSize)) {
    return 'tablet';
  }
  
  if (isMobileUA || isMobileSize) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Recupere les informations sur le navigateur
 * @returns {Object} {name, version}
 */
export function getBrowserInfo() {
  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = '0';
  
  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.split('Firefox/')[1]?.split(' ')[0] || '0';
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.split('Edg/')[1]?.split(' ')[0] || '0';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.split('Chrome/')[1]?.split(' ')[0] || '0';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.split('Version/')[1]?.split(' ')[0] || '0';
  }
  
  return { name, version };
}

/**
 * Recupere les informations sur le systeme d'exploitation
 * @returns {string} Nom du systeme
 */
export function getOSInfo() {
  const ua = navigator.userAgent;
  
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  
  return 'unknown';
}

/**
 * Recupere les dimensions de l'ecran et du viewport
 * @returns {Object} Dimensions
 */
export function getScreenInfo() {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}

/**
 * Verifie si l'appareil supporte le touch
 * @returns {boolean} Support tactile
 */
export function hasTouchSupport() {
  return 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
}
