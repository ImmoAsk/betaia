export function filterPanelStyles() {
  return `
    .aw-filter-chip {
      appearance: none;
      border: 1px solid var(--aw-border);
      background: var(--aw-background-alt);
      color: var(--aw-text-muted);
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 8px;
      line-height: 1;
      text-align: center;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 22px;
      white-space: nowrap;
      font-weight: 700;
      letter-spacing: 0.02em;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
      transition: transform 0.14s ease, box-shadow 0.14s ease, border-color 0.14s ease, color 0.14s ease, background-color 0.14s ease;
    }

    .aw-filter-chip:hover {
      transform: translateY(-1px);
      color: var(--aw-accent);
      border-color: var(--aw-accent);
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
    }

    .aw-filter-chip.is-active {
      color: #fff;
      border-color: var(--aw-accent);
      background: var(--aw-accent);
      box-shadow: 0 6px 14px rgba(37, 99, 235, 0.22);
    }

    .aw-filter-chip:focus-visible {
      outline: 3px solid #0b2f66;
      outline-offset: 2px;
      box-shadow: 0 0 0 2px #ffffff;
    }

    .aw-filter-chip:active {
      transform: translateY(1px);
    }

    @container (max-width: 460px) {
      .aw-filter-chip {
        padding: 4px 7px;
        font-size: 7px;
        line-height: 1.1;
        min-height: 24px;
      }
    }

    .aw-container--vertical .aw-filter-chip {
      padding: 3px 6px;
      font-size: 7px;
      line-height: 1.05;
      min-height: 22px;
    }

    @media (prefers-reduced-motion: reduce) {
      .aw-filter-chip,
      .aw-filter-chip:hover,
      .aw-filter-chip:active {
        transition: none;
        transform: none;
      }
    }
  `;
}
