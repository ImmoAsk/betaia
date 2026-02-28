export function filterTriggerStyles() {
  return `
    .aw-filter-menu-wrap {
      position: relative;
      flex: 0 0 auto;
    }

    .aw-filter-trigger {
      appearance: none;
      border: 1px solid var(--aw-border);
      background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0) 55%), var(--aw-background-alt);
      border-radius: 999px;
      width: 26px;
      height: 26px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(4px);
    }

    .aw-filter-trigger:hover {
      border-color: var(--aw-accent);
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
    }

    .aw-filter-trigger:focus {
      outline: 2px solid var(--aw-accent);
      outline-offset: 2px;
    }

    .aw-filter-icon {
      width: 14px;
      height: 14px;
      color: var(--aw-text);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .aw-filter-icon svg {
      width: 13px;
      height: 13px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      display: block;
    }

    .aw-filter-tooltip {
      position: absolute;
      top: 50%;
      left: calc(100% + 8px);
      transform: translateY(-50%) translateX(-4px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.14s ease, transform 0.14s ease;
      background: var(--aw-text);
      color: var(--aw-background);
      border-radius: 7px;
      padding: 3px 7px;
      font-size: 9px;
      line-height: 1;
      font-weight: 600;
      white-space: nowrap;
      z-index: 28;
    }

    .aw-filter-tooltip::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -4px;
      transform: translateY(-50%);
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: 4px solid var(--aw-text);
    }

    .aw-filter-menu-wrap:hover .aw-filter-tooltip,
    .aw-filter-trigger:focus + .aw-filter-tooltip {
      opacity: 0.95;
      transform: translateY(-50%) translateX(0);
    }
  `;
}
