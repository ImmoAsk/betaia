export function ctaStyles() {
  return `
    .aw-cta-row {
      display: flex;
      flex-direction: row;
      gap: 8px;
      padding: 8px;
      border-top: 1px solid var(--aw-border);
      background: var(--aw-background);
      position: sticky;
      bottom: 0;
      z-index: 2;
    }

    .aw-cta-btn {
      flex: 1 1 0;
      min-width: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 5px 7px;
      border-radius: 8px;
      border: 1px solid var(--aw-border);
      background: var(--aw-background-alt);
      color: var(--aw-text);
      text-decoration: none;
      font-size: 9px;
      font-weight: 600;
      line-height: 1.15;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease, color 0.16s ease, transform 0.16s ease;
    }

    .aw-cta-btn:hover { filter: brightness(0.97); }
    .aw-cta-btn:active { transform: translateY(1px); }

    .aw-cta-btn:focus-visible {
      outline: 3px solid #0b2f66;
      outline-offset: 2px;
      box-shadow: 0 0 0 2px #ffffff;
    }

    .aw-cta-btn--magazine {
      border-color: var(--aw-accent);
      color: var(--aw-accent);
      background: var(--aw-background);
    }

    .aw-cta-btn--app {
      border-color: var(--aw-accent);
      background: var(--aw-accent);
      color: #ffffff;
      font-size: 9.5px;
    }

    @container (max-width: 460px) {
      .aw-cta-row {
        gap: 5px;
        padding: 5px;
      }

      .aw-cta-btn {
        min-height: 30px;
        padding: 5px 6px;
        font-size: 8px;
        line-height: 1.15;
        font-weight: 600;
      }

      .aw-cta-btn--app {
        font-size: 8.5px;
      }
    }

    @container (max-width: 250px) {
      .aw-cta-row {
        gap: 4px;
        padding: 4px;
      }

      .aw-cta-btn {
        min-height: 28px;
        padding: 4px 5px;
        font-size: 8px;
      }
    }

    .aw-container--vertical .aw-cta-row {
      gap: 4px;
      padding: 4px;
    }

    .aw-container--vertical .aw-cta-btn {
      min-height: 28px;
      padding: 4px 6px;
      font-size: 8px;
      line-height: 1.1;
      font-weight: 600;
    }

    .aw-container--vertical .aw-cta-btn--app {
      font-size: 8.5px;
    }

    @media (prefers-reduced-motion: reduce) {
      .aw-cta-btn,
      .aw-cta-btn:hover,
      .aw-cta-btn:active {
        transition: none;
        transform: none;
      }
    }
  `;
}
