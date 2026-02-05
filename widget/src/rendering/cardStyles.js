/**
 * Styles des cartes d'annonces
 * @module rendering/cardStyles
 */

/**
 * Genere les styles pour les cartes d'annonces
 * @returns {string} CSS des cartes
 */
export function generateCardStyles() {
  return `
    .aw-card {
      background: var(--aw-background);
      border: 1px solid var(--aw-border);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }
    
    .aw-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--aw-shadow);
    }
    
    .aw-card-image {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      background: var(--aw-background-alt);
      overflow: hidden;
    }
    
    .aw-card-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .aw-card-body {
      padding: 12px;
    }
    
    .aw-card-title {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--aw-text);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .aw-card-description {
      margin: 0 0 8px;
      font-size: 13px;
      color: var(--aw-text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .aw-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .aw-card-price {
      font-size: 18px;
      font-weight: 700;
      color: var(--aw-accent);
    }
    
    .aw-card-location {
      font-size: 12px;
      color: var(--aw-text-muted);
    }
  `;
}

/**
 * Genere les styles pour les cartes en mode liste
 * @returns {string} CSS des cartes liste
 */
export function generateListCardStyles() {
  return `
    .aw-list-card {
      display: flex;
      background: var(--aw-background);
      border: 1px solid var(--aw-border);
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.2s ease;
    }
    
    .aw-list-card:hover {
      box-shadow: 0 2px 8px var(--aw-shadow);
    }
    
    .aw-list-card-image {
      flex-shrink: 0;
      width: 120px;
      height: 90px;
      background: var(--aw-background-alt);
    }
    
    .aw-list-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .aw-list-card-content {
      flex: 1;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .aw-list-card-title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--aw-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .aw-list-card-price {
      font-size: 16px;
      font-weight: 700;
      color: var(--aw-accent);
    }
  `;
}
