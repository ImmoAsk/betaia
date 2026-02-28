export function filterPanelStyles() {
  return `
    .aw-filter-panel {
      position: absolute;
      top: calc(100% + 7px);
      left: 0;
      min-width: 154px;
      max-width: 200px;
      display: grid;
      gap: 3px;
      padding: 6px;
      border-radius: 12px;
      border: 1px solid var(--aw-border);
      background: var(--aw-background);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08);
      opacity: 0;
      transform: translateY(-4px) scale(0.98);
      pointer-events: none;
      transition: opacity 0.16s ease, transform 0.16s ease;
      z-index: 29;
    }

    .aw-filter-menu-wrap.is-open .aw-filter-panel {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .aw-filter-item {
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--aw-text);
      border-radius: 8px;
      padding: 7px 9px;
      font-size: 11px;
      line-height: 1.2;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      transition: background-color 0.14s ease, color 0.14s ease;
      white-space: nowrap;
    }

    .aw-filter-item::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--aw-border);
      flex: 0 0 auto;
    }

    .aw-filter-item:hover { background: var(--aw-background-alt); }

    .aw-filter-item.is-active {
      background: var(--aw-background-alt);
      color: var(--aw-accent);
      font-weight: 700;
    }

    .aw-filter-item.is-active::before {
      background: var(--aw-accent);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
    }

    .aw-filter-item:focus {
      outline: 2px solid var(--aw-accent);
      outline-offset: 1px;
    }
  `;
}
