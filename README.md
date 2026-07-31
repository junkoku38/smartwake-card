# SmartWAKE Card

Carte Lovelace custom pour l'intégration [SmartWAKE](https://github.com/junkoku38/smartwake).

## Installation

### Via HACS (Frontend)

1. *HACS → Frontend → Custom repositories*
2. URL : `https://github.com/junkoku38/smartwake-card`
3. Category : **Dashboard (Lovelace)**
4. Install → recharger les ressources frontend

### Manuellement

Copiez `dist/smartwake-card.js` dans `/config/www/` et ajoutez-le dans vos ressources :
```yaml
resources:
  - url: /local/smartwake-card.js
    type: module
```

## Configuration

```yaml
type: custom:smartwake-card
entity: switch.reveil_actif
name: Mon réveil
show_stats: true
show_context: true
```

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `entity` | string | requis | Entity ID du switch SmartWAKE |
| `name` | string | SmartWAKE | Nom affiché |
| `show_stats` | bool | true | Afficher les statistiques |
| `show_context` | bool | true | Afficher les sondes contextuelles |

## Fonctionnalités

- En-tête compact avec heure + toggle + statut
- Chips de jours actifs (L Ma Me J V S D)
- Sondes contextuelles (weekend, férié, vacances sco)
- Boutons d'action (Snooze, Stop, Skip, Test)
- Statistiques (déclenchements, snoozes, stops)
- Style compact style Mushroom