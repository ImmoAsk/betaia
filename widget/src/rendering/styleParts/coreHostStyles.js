export function coreHostStyles(vars) {
  return `
    :host {
      ${vars}
      display: block;
      width: 100%;
      max-width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      box-sizing: border-box;
      container-type: inline-size;
    }

    *, *::before, *::after { box-sizing: inherit; margin: 0; padding: 0; }

    .aw-container {
      width: 100%;
      max-width: 100%;
      background: var(--aw-background);
      color: var(--aw-text);
      border-radius: 4px;
      overflow: hidden;
      container-type: inline-size;
      border: 1px solid var(--aw-border);
      box-sizing: border-box;
    }

    .aw-loading { padding: 10px; text-align: center; font-size: 11px; }
    .aw-error { padding: 10px; text-align: center; color: var(--aw-error); font-size: 11px; }

    .aw-skeleton {
      background: linear-gradient(90deg, var(--aw-background-alt) 25%, var(--aw-border) 50%, var(--aw-background-alt) 75%);
      background-size: 200% 100%;
      animation: aw-shimmer 1.5s infinite;
      border-radius: 3px;
    }

    @keyframes aw-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .aw-ad-link {
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .aw-ad-link:focus {
      outline: 2px solid var(--aw-accent);
      outline-offset: 1px;
    }
  `;
}
