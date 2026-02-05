/**
 * Styles du carousel
 * @module rendering/carouselStyles
 */

/**
 * Genere les styles pour le carousel
 * @returns {string} CSS du carousel
 */
export function generateCarouselStyles() {
  return `
    .aw-carousel {
      position: relative;
      overflow: hidden;
      padding: 16px;
    }
    
    .aw-carousel-track {
      display: flex;
      transition: transform 0.3s ease;
      gap: 16px;
    }
    
    .aw-carousel-slide {
      flex-shrink: 0;
      width: calc(33.333% - 11px);
    }
    
    @media (max-width: 900px) {
      .aw-carousel-slide {
        width: calc(50% - 8px);
      }
    }
    
    @media (max-width: 600px) {
      .aw-carousel-slide {
        width: 100%;
      }
    }
    
    .aw-carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: var(--aw-background);
      color: var(--aw-text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px var(--aw-shadow);
      z-index: 10;
      transition: background 0.2s ease;
    }
    
    .aw-carousel-btn:hover {
      background: var(--aw-background-alt);
    }
    
    .aw-carousel-btn:focus {
      outline: 2px solid var(--aw-accent);
      outline-offset: 2px;
    }
    
    .aw-carousel-btn--prev {
      left: 8px;
    }
    
    .aw-carousel-btn--next {
      right: 8px;
    }
    
    .aw-carousel-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .aw-carousel-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
    
    .aw-carousel-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
    }
    
    .aw-carousel-dot {
      width: 8px;
      height: 8px;
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
    
    .aw-carousel-dot:focus {
      outline: 2px solid var(--aw-accent);
      outline-offset: 2px;
    }
  `;
}
