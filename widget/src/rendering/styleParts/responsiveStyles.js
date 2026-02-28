export function responsiveStyles() {
  return `
    @container (max-width: 280px) {
      .aw-filter-trigger {
        width: 24px;
        height: 24px;
      }

      .aw-filter-panel {
        min-width: 138px;
        max-width: 170px;
        left: 0;
      }

      .aw-filter-item {
        font-size: 10px;
        padding: 6px 8px;
      }

      .aw-cta-row {
        gap: 6px;
        padding: 6px;
      }

      .aw-cta-btn {
        font-size: 10px;
        padding: 7px 8px;
      }
    }
  `;
}
