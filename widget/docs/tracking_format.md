# Format des donnees de tracking

## Structure du payload

```json
{
  "v": "1.0",
  "ctx": {
    "cid": "CLIENT_ID",
    "sid": "session-uuid",
    "fp": "fingerprint-hash",
    "device": "desktop|mobile|tablet",
    "browser": "Chrome",
    "browserVer": "90.0",
    "os": "Windows",
    "sw": 1920,
    "sh": 1080,
    "vw": 1200,
    "vh": 800,
    "pr": 1,
    "lang": "fr-FR",
    "tz": "Europe/Paris",
    "ref": "/page-origine",
    "url": "/page-actuelle"
  },
  "events": [
    {
      "id": "evt-short-id",
      "type": "impression|click|hover|view_duration|scroll_depth|rotation",
      "ts": 1738748400000,
      "aid": "annonce-id",
      ...
    }
  ]
}
```

## Types d'evenements

### impression
```json
{
  "id": "abc123",
  "type": "impression",
  "ts": 1738748400000,
  "aid": "ad-001",
  "vr": 0.75
}
```
- `vr` : ratio de visibilite (0.0 a 1.0)

### click
```json
{
  "id": "def456",
  "type": "click",
  "ts": 1738748401000,
  "aid": "ad-001",
  "pos": {"x": 150, "y": 80}
}
```
- `pos` : position du clic dans l'annonce

### hover
```json
{
  "id": "ghi789",
  "type": "hover",
  "ts": 1738748402000,
  "aid": "ad-001",
  "dur": 2500
}
```
- `dur` : duree du survol en ms

### view_duration
```json
{
  "id": "jkl012",
  "type": "view_duration",
  "ts": 1738748403000,
  "aid": "ad-001",
  "dur": 15000
}
```
- `dur` : duree d'affichage visible en ms

### scroll_depth
```json
{
  "id": "mno345",
  "type": "scroll_depth",
  "ts": 1738748404000,
  "aid": "ad-001",
  "depth": 0.85
}
```
- `depth` : profondeur de scroll (0.0 a 1.0)

### rotation
```json
{
  "id": "pqr678",
  "type": "rotation",
  "ts": 1738748405000,
  "from": "ad-001,ad-002",
  "to": "ad-003,ad-004",
  "reason": "idle|return|scroll_past"
}
```

## Endpoint API

### POST /api/tracking

Recoit les evenements de tracking.

**Headers:**
- Content-Type: application/json

**Body:** Payload JSON (voir structure ci-dessus)

**Response:** 
- 200 OK : Evenements recus
- 400 Bad Request : Payload invalide
- 429 Too Many Requests : Rate limit depasse

## Optimisations

1. **Batch** : Evenements groupes par 10 ou toutes les 5s
2. **Compression** : Cles courtes (aid, ts, dur, vr)
3. **Deduplication** : ID unique par evenement
4. **Fallback** : sendBeacon pour fermeture page
