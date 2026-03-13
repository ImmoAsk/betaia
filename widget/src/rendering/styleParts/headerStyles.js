export function headerStyles() {
  return `
    .aw-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      padding: 4px 6px;
      font-size: 8px;
      color: var(--aw-text-muted);
      border-bottom: 1px solid var(--aw-border);
    }

    .aw-header-left {
      min-width: 0;
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .aw-header-label {
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
      opacity: 0.72;
    }

    .aw-header-brand {
      font-weight: 600;
      opacity: 1;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      min-height: 14px;
      min-width: 0;
      flex: 0 0 auto;
    }

    .aw-header-brand-logo {
      display: block;
      height: 14px;
      width: auto;
      max-width: 84px;
      object-fit: contain;
    }
  `;
}
