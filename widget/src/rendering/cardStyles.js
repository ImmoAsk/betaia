/**
 * Styles des cartes d'annonces - Design compact pub
 * @module rendering/cardStyles
 */

/**
 * Genere les styles pour les mini-cartes
 * @returns {string} CSS des cartes
 */
export function generateCardStyles() {
  return `
    .aw-card {
      background: var(--aw-background);
      border: 1px solid var(--aw-border);
      border-radius: 4px;
      overflow: hidden;
      transition: box-shadow 0.15s ease;
      cursor: pointer;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    
    .aw-card:hover {
      box-shadow: 0 2px 6px var(--aw-shadow);
    }
    
    .aw-card-image {
      position: relative;
      width: 100%;
      padding-bottom: 45%;
      background: var(--aw-background-alt);
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .aw-card-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.2s ease;
    }
    
    .aw-card-image img.loading { opacity: 0; }
    .aw-card-image img.loaded { opacity: 1; }
    .aw-card-image img.error { opacity: 0.5; }
    
    .aw-card-body {
      padding: 4px 6px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }
    
    .aw-card-title {
      margin: 0 0 1px;
      font-size: 10px;
      font-weight: 600;
      color: var(--aw-text);
      line-height: 1.2;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-word;
    }
    
    .aw-card-description {
      margin: 0;
      font-size: 9px;
      color: var(--aw-text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-word;
    }
    
    .aw-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 1px;
      min-width: 0;
    }
    
    .aw-card-price {
      font-size: 10px;
      font-weight: 700;
      color: var(--aw-accent);
      white-space: nowrap;
      flex-shrink: 0;
    }
    
    .aw-card-location {
      font-size: 8px;
      color: var(--aw-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80px;
      min-width: 0;
    }
    
    /* Ultra compact pour petits espaces */
    @container (max-width: 200px) {
      .aw-card-body { padding: 4px 6px; }
      .aw-card-title { font-size: 10px; }
      .aw-card-price { font-size: 10px; }
      .aw-card-description { display: none; }
      .aw-card-location { display: none; }
    }
  `;
}

/**
 * Genere les styles pour les cartes en mode liste compact
 * @returns {string} CSS des cartes liste
 */
export function generateListCardStyles() {
  return `
    .aw-list-card {
      display: flex;
      background: var(--aw-background);
      border: 1px solid var(--aw-border);
      border-radius: 3px;
      overflow: hidden;
      transition: box-shadow 0.15s ease;
      width: 100%;
      height: 44px;
      min-width: 0;
      max-width: 100%;
      box-sizing: border-box;
    }
    
    .aw-list-card:hover {
      box-shadow: 0 1px 4px var(--aw-shadow);
    }
    
    .aw-list-card-image {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      background: var(--aw-background-alt);
      overflow: hidden;
    }
    
    .aw-list-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.2s ease;
    }
    
    .aw-list-card-image img.loading { opacity: 0; }
    .aw-list-card-image img.loaded { opacity: 1; }
    
    .aw-list-card-content {
      flex: 1;
      padding: 3px 6px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
      gap: 1px;
    }
    
    .aw-list-card-title {
      margin: 0;
      font-size: 10px;
      font-weight: 600;
      color: var(--aw-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .aw-list-card-price {
      font-size: 10px;
      font-weight: 700;
      color: var(--aw-accent);
    }
    
    @container (max-width: 200px) {
      .aw-list-card { height: 36px; }
      .aw-list-card-image { width: 36px; height: 36px; }
      .aw-list-card-title { font-size: 9px; }
      .aw-list-card-price { font-size: 9px; }
    }
  `;
}
