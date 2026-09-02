export function generateAdaptiveThemeStyles(siteColors) {
  if (!siteColors) return '';
  const overrides = [];
  if (siteColors.primary) {
    overrides.push(`--aw-accent: ${siteColors.primary};`);
    overrides.push(`--aw-button-bg: ${siteColors.primary};`);
  }
  if (siteColors.text) overrides.push(`--aw-text: ${siteColors.text};`);
  if (siteColors.background) overrides.push(`--aw-background: ${siteColors.background};`);
  if (siteColors.border) overrides.push(`--aw-border: ${siteColors.border};`);
  if (overrides.length === 0) return '';
  return `
    :host(.aw-adaptive) {
      ${overrides.join('\n      ')}
    }
  `;
}
