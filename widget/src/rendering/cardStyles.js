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
      background: #ffffff;
      border: none;
      border-radius: 12px;
      overflow: hidden;
      transition: box-shadow 0.15s ease, transform 0.15s ease;
      cursor: pointer;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      box-shadow: 0 2px 16px rgba(16, 24, 40, 0.08);
      position: relative;
    }

    .aw-card:hover {
      box-shadow: 0 8px 24px rgba(16, 24, 40, 0.12);
      transform: translateY(-2px);
    }

    .aw-card--horizontal {
      flex-direction: row;
    }

    .aw-card--horizontal .aw-ad-link {
      display: grid;
      grid-template-columns: minmax(120px, 40%) 1fr;
      align-items: stretch;
      width: 100%;
    }
    
    .aw-card-image {
      position: relative;
      width: 100%;
      padding-bottom: 56%;
      background: #eef1f4;
      overflow: hidden;
      flex-shrink: 0;
    }

    .aw-card--horizontal .aw-card-image {
      height: 100%;
      min-height: 160px;
      padding-bottom: 0;
    }
    
    .aw-card-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.2s ease, transform 0.25s ease;
    }

    .aw-card:hover .aw-card-image img.loaded {
      transform: scale(1.02);
    }
    
    .aw-card-image img.loading { opacity: 0; }
    .aw-card-image img.loaded { opacity: 1; }
    .aw-card-image img.error { opacity: 0.5; }

    .aw-card-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
    }

    .aw-card-badge {
      display: inline-flex;
      align-items: center;
      border-radius: 6px;
      background: #3b82f6;
      color: #fff;
      font-size: 11px;
      line-height: 1;
      font-weight: 600;
      padding: 5px 10px;
      letter-spacing: 0.02em;
    }
    
    .aw-card-body {
      padding: 10px 12px 8px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      position: relative;
      gap: 3px;
    }

    .aw-card--horizontal .aw-card-body {
      padding: 14px 16px 12px;
      justify-content: center;
      gap: 4px;
    }

    .aw-card-menu {
      display: none;
    }

    .aw-card-category {
      color: #3b82f6;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .aw-card--horizontal .aw-card-category {
      font-size: 11px;
    }

    .aw-card-title {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--aw-text);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-word;
    }

    .aw-card--horizontal .aw-card-title {
      font-size: 15px;
      line-height: 1.35;
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

    .aw-card-meta-row {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      color: #8f8f9b;
    }

    .aw-card-meta-icon {
      width: 15px;
      height: 15px;
      color: #9aa0aa;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .aw-card-meta-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
    
    .aw-card-footer {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: auto;
      padding-top: 6px;
      min-width: 0;
      border-top: 1px solid rgba(17, 24, 39, 0.08);
    }

    .aw-card--horizontal .aw-card-footer {
      padding-top: 10px;
    }

    .aw-card-price {
      font-size: 13px;
      font-weight: 700;
      color: var(--aw-text);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .aw-card--horizontal .aw-card-price {
      font-size: 15px;
    }

    .aw-card-location {
      font-size: 11px;
      color: #8f8f9b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      min-width: 0;
    }

    .aw-card--horizontal .aw-card-location {
      font-size: 13px;
    }

    .aw-card-amenities {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 10px;
      min-width: 0;
    }

    .aw-card-amenity {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #6b7280;
      min-width: 0;
    }

    .aw-card-amenity-value {
      font-size: 11px;
      font-weight: 500;
      color: #6b7280;
    }

    .aw-card--horizontal .aw-card-amenity-value {
      font-size: 13px;
    }

    .aw-card-amenity-icon {
      width: 15px;
      height: 15px;
      color: #9aa0aa;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .aw-card-amenity-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
    
    /* Compact pour petits espaces */
    @container (max-width: 200px) {
      .aw-card {
        border-radius: 10px;
      }
      .aw-card-body { padding: 8px 10px 6px; gap: 2px; }
      .aw-card-title { font-size: 11px; }
      .aw-card-category { font-size: 8px; }
      .aw-card-price { font-size: 11px; }
      .aw-card-location { font-size: 9px; }
      .aw-card-amenity-value { font-size: 9px; }
      .aw-card-amenity-icon { width: 13px; height: 13px; }
    }

    @container (max-width: 260px) {
      .aw-card--horizontal .aw-ad-link {
        grid-template-columns: 1fr;
      }

      .aw-card--horizontal .aw-card-image {
        min-height: 0;
        height: auto;
        padding-bottom: 52%;
      }
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
