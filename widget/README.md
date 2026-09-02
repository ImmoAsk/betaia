# Widget Annonces - Architecture Modulaire

## Structure des dossiers

```
widget/
├── src/
│   ├── core/           # Configuration, etat, constantes
│   ├── adapters/       # Detection theme, espace, device
│   ├── tracking/       # Analytics, events, queue
│   ├── security/       # Anti-fraude, sanitization
│   ├── rgpd/           # Conformite RGPD
│   ├── rendering/      # Affichage annonces, layouts
│   ├── rotation/       # Algorithme rotation intelligente
│   ├── api/            # Communication serveur
│   └── utils/          # Utilitaires partages
├── build/              # Scripts de build
└── dist/               # Bundle final (widget.js)
```

## Integration

```html
<div id="annonces-widget"></div>
<script async src="https://tonsite.com/widget.js" data-id="CLIENT_ID"></script>
```

## Options

- `data-id` : CLIENT_ID unique (obligatoire)
- `data-max-ads` : Nombre max annonces (1-10)
- `data-theme` : "light" | "dark" | "auto"
- `data-layout` : "card" | "list" | "grid" | "carousel" | "auto"
- `data-no-tracking` : Desactive le tracking

## API Publique

- `window.__AnnoncesWidget__.refresh()` : Recharge les annonces
- `window.__AnnoncesWidget__.getStats()` : Stats locales
- `window.__AnnoncesWidget__.giveConsent()` : Active tracking
- `window.__AnnoncesWidget__.revokeConsent()` : Desactive tracking

## Build

```bash
npm run build:widget
```
