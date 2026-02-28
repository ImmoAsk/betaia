export function generateGridLayoutStyles(columns) {
  return `
    .aw-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 4px;
      padding: 4px;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }

    @container (max-width: 250px) {
      .aw-grid { grid-template-columns: 1fr; gap: 4px; padding: 4px; }
    }

    @container (min-width: 251px) and (max-width: 450px) {
      .aw-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
    }

    @container (min-width: 451px) and (max-width: 700px) {
      .aw-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @container (min-width: 701px) {
      .aw-grid { grid-template-columns: repeat(${Math.min(columns, 4)}, 1fr); }
    }

    @supports not (container-type: inline-size) {
      @media (max-width: 350px) {
        .aw-grid { grid-template-columns: 1fr; }
      }
    }
  `;
}

export function generateListLayoutStyles() {
  return `
    .aw-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 3px;
    }
  `;
}
