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
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--aw-border);
      background: var(--aw-background-alt);
      color: var(--aw-text);
      text-decoration: none;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .aw-cta-btn:focus { outline: 2px solid var(--aw-accent); outline-offset: 1px; }
    .aw-cta-btn:hover { filter: brightness(0.98); }

    .aw-cta-btn--magazine {
      border-color: var(--aw-accent);
      color: var(--aw-accent);
      background: var(--aw-background);
    }

    .aw-cta-btn--app {
      border-color: var(--aw-accent);
      background: var(--aw-accent);
      color: #ffffff;
    }
  `;
}
