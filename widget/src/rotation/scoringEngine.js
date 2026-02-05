/**
 * Algorithme de scoring des annonces
 * @module rotation/scoringEngine
 */

/**
 * Calcule le score d'engagement d'une annonce
 * @param {Object} metrics - Metriques de l'annonce
 * @returns {number} Score d'engagement (0-100)
 */
export function calculateEngagementScore(metrics) {
  const {
    viewTime = 0,
    hoverDuration = 0,
    scrollDepth = 0,
    clicked = false,
    impressions = 0
  } = metrics;

  // Poids des facteurs
  const weights = {
    viewTime: 0.25,
    hoverDuration: 0.30,
    scrollDepth: 0.25,
    clicked: 0.20
  };

  // Normalisation du temps de vue (max 30s = score max)
  const viewTimeScore = Math.min(viewTime / 30000, 1) * 100;
  
  // Normalisation du hover (max 10s = score max)
  const hoverScore = Math.min(hoverDuration / 10000, 1) * 100;
  
  // Scroll depth deja normalise (0-1)
  const scrollScore = scrollDepth * 100;
  
  // Bonus pour clic
  const clickScore = clicked ? 100 : 0;

  // Score pondere
  const score = (
    viewTimeScore * weights.viewTime +
    hoverScore * weights.hoverDuration +
    scrollScore * weights.scrollDepth +
    clickScore * weights.clicked
  );

  return Math.round(score * 100) / 100;
}

/**
 * Calcule le score de priorite pour la rotation
 * @param {Object} ad - Annonce avec metriques
 * @param {Object} context - Contexte de rotation
 * @returns {number} Score de priorite
 */
export function calculateRotationPriority(ad, context) {
  const { viewedAds = [], lastRotation = 0 } = context;
  
  let score = 50; // Score de base
  
  // Penalite si deja vue recemment
  if (viewedAds.includes(ad.id)) {
    const recency = viewedAds.indexOf(ad.id);
    score -= (viewedAds.length - recency) * 10;
  }
  
  // Bonus si jamais affichee
  if (!ad.impressions || ad.impressions === 0) {
    score += 20;
  }
  
  // Ajustement par performance globale
  if (ad.ctr && ad.ctr > 0) {
    score += ad.ctr * 100; // CTR en pourcentage booste le score
  }
  
  // Facteur aleatoire pour diversite (10%)
  score += (Math.random() - 0.5) * 10;
  
  return Math.max(0, Math.round(score));
}

/**
 * Trie les annonces par score de priorite
 * @param {Object[]} ads - Liste des annonces
 * @param {Object} context - Contexte de rotation
 * @returns {Object[]} Annonces triees
 */
export function sortAdsByPriority(ads, context) {
  return [...ads]
    .map(ad => ({
      ...ad,
      priority: calculateRotationPriority(ad, context)
    }))
    .sort((a, b) => b.priority - a.priority);
}
