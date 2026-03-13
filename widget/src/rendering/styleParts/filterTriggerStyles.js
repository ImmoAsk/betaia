export function filterTriggerStyles() {
  return `
    .aw-filter-bar {
      min-width: 0;
      max-width: 100%;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 0 1px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .aw-filter-bar::-webkit-scrollbar {
      display: none;
    }

    .aw-filter-bar::after {
      content: '';
      flex: 0 0 2px;
    }
  `;
}
