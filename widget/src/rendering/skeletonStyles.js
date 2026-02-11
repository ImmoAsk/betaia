/**
 * Styles des skeletons de chargement
 * @module rendering/skeletonStyles
 */

/**
 * Genere les styles pour les skeletons
 * @returns {string} CSS des skeletons
 */
export function generateSkeletonStyles() {
  return `
    .aw-skeleton-card {
      background: var(--aw-background);
      border: 1px solid var(--aw-border);
      border-radius: 6px;
      overflow: hidden;
    }
    
    .aw-skeleton-image {
      width: 100%;
      padding-bottom: 50%;
      background: linear-gradient(90deg, 
        var(--aw-background-alt) 25%, 
        var(--aw-border) 50%, 
        var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
    }
    
    .aw-skeleton-body {
      padding: 6px;
    }
    
    .aw-skeleton-line {
      height: 10px;
      margin-bottom: 4px;
      border-radius: 3px;
      background: linear-gradient(90deg, 
        var(--aw-background-alt) 25%, 
        var(--aw-border) 50%, 
        var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
    }
    
    .aw-skeleton-line--short { width: 60%; }
    .aw-skeleton-line--medium { width: 80%; }
    .aw-skeleton-line--long { width: 100%; }
    
    .aw-skeleton-price {
      width: 40%;
      height: 12px;
      margin-top: 4px;
      border-radius: 3px;
      background: linear-gradient(90deg, 
        var(--aw-background-alt) 25%, 
        var(--aw-border) 50%, 
        var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
    }
    
    @keyframes aw-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
}

/**
 * Cree le HTML d'un skeleton de carte
 * @returns {string} HTML du skeleton
 */
export function createSkeletonCardHTML() {
  return `
    <div class="aw-skeleton-card">
      <div class="aw-skeleton-image"></div>
      <div class="aw-skeleton-body">
        <div class="aw-skeleton-line aw-skeleton-line--long"></div>
        <div class="aw-skeleton-price"></div>
      </div>
    </div>
  `;
}

/**
 * Cree le HTML d'un skeleton de liste
 * @returns {string} HTML du skeleton liste
 */
export function createSkeletonListHTML() {
  return `
    <div class="aw-skeleton-card" style="display:flex;height:56px;">
      <div style="width:56px;height:100%;background:var(--aw-background-alt);"></div>
      <div style="flex:1;padding:6px 8px;">
        <div class="aw-skeleton-line aw-skeleton-line--long"></div>
        <div class="aw-skeleton-line aw-skeleton-line--short"></div>
      </div>
    </div>
  `;
}
