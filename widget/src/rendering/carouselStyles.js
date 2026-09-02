/**
 * Styles du carousel compact
 * @module rendering/carouselStyles
 */

/**
 * Genere les styles pour le carousel compact
 * @returns {string} CSS du carousel
 */
export function generateCarouselStyles() {
  return `
    .aw-carousel {
      position: relative;
      overflow: hidden;
      padding: 6px;
      width: 100%;
    }
    
    .aw-carousel-track {
      display: flex;
      transition: transform 0.3s ease;
      gap: 6px;
    }
    
    .aw-carousel-slide {
      flex-shrink: 0;
      width: calc(33.333% - 4px);
    }
    
    @container (max-width: 300px) {
      .aw-carousel-slide { width: 100%; }
      .aw-carousel-btn { width: 24px; height: 24px; }
      .aw-carousel-btn svg { width: 12px; height: 12px; }
    }
    
    @container (min-width: 301px) and (max-width: 500px) {
      .aw-carousel-slide { width: calc(50% - 3px); }
    }
    
    @container (min-width: 501px) {
      .aw-carousel-slide { width: calc(33.333% - 4px); }
    }
    
    @supports not (container-type: inline-size) {
      @media (max-width: 400px) {
        .aw-carousel-slide { width: 100%; }
      }
      @media (min-width: 401px) and (max-width: 600px) {
        .aw-carousel-slide { width: calc(50% - 3px); }
      }
    }
    
    .aw-carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 50%;
      background: var(--aw-background);
      color: var(--aw-text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 4px var(--aw-shadow);
      z-index: 10;
      transition: opacity 0.2s ease;
      padding: 0;
    }
    
    .aw-carousel-btn:hover { opacity: 0.8; }
    
    .aw-carousel-btn--prev { left: 2px; }
    .aw-carousel-btn--next { right: 2px; }
    
    .aw-carousel-btn:disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
    
    .aw-carousel-btn svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }
    
    .aw-carousel-dots {
      display: flex;
      justify-content: center;
      gap: 4px;
      margin-top: 6px;
    }
    
    .aw-carousel-dot {
      width: 5px;
      height: 5px;
      border: none;
      border-radius: 50%;
      background: var(--aw-border);
      cursor: pointer;
      padding: 0;
      transition: background 0.2s ease;
    }
    
    .aw-carousel-dot--active {
      background: var(--aw-accent);
    }
  `;
}
