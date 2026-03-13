export function responsiveStyles() {
  return `
    @container (max-width: 280px) {
      .aw-cta-row {
        gap: 4px;
        padding: 4px;
      }

      .aw-cta-btn {
        min-height: 30px;
        font-size: 8px;
        padding: 5px 6px;
        line-height: 1.1;
      }
    }
  `;
}
