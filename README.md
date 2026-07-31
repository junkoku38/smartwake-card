# SmartWAKE Card

Carte Lovelace custom pour l'intégration [SmartWAKE](https://github.com/junkoku38/smartwake).

**v2** — nouveau design : grande heure avec compte à rebours, pastilles de jours, chips contextuelles, et état sonnerie plein cadre avec Snooze / Stop.

## Design

### État normal
- **En-tête** : pastille ambre + nom + sous-titre de statut ("Sonne aujourd'hui · férié", "Mode vacances", "La maison se prépare"...) + toggle d'activation
- **Heure** en 44 px avec compte à rebours ("dans 8 h 12 min", calculé depuis `sensor.<nom>_prochain_reveil`, rafraîchi toutes les 30 s)
- **Jours** : 7 pastilles rondes L Ma Me J V S D, actives en ambre (tap → sélecteur de jours)
- **Chips contextuelles** : Férié / Weekend / Vacances sco (vertes quand actives)
- **Actions rapides** : Skip 1× · Test · compteur de snoozes
- **Footer réglages** : volume final · pré-chauffage · aube (tap → réglage)

### État sonnerie (`statut = ringing`)
La carte se transforme : bordure ambre pulsée, deux gros boutons tactiles
**Snooze** (`smartwake.snooze`) et **Stop** (`smartwake.stop`), et le rappel
de l'escalade à venir. Pensée pour un doigt endormi à 6 h 45.

La carte suit le thème Home Assistant (clair / sombre) ; seul l'accent ambre
`#EF9F27` est fixe.

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
name: Réveil semaine
```

| Option          | Type   | Défaut    | Description                                        |
| --------------- | ------ | --------- | -------------------------------------------------- |
| `entity`        | string | requis    | Le switch SmartWAKE (`switch.<nom>_actif`)         |
| `name`          | string | SmartWAKE | Nom affiché dans l'en-tête                         |
| `show_stats`    | bool   | true      | Afficher le compteur de snoozes                    |
| `show_context`  | bool   | true      | Afficher les chips Férié / Weekend / Vacances sco  |
| `show_settings` | bool   | true      | Afficher le footer réglages (volume, chauffe, aube)|

Toutes les autres entités (`time.<nom>_heure`, `select.<nom>_jours`,
`sensor.<nom>_statut`, `sensor.<nom>_prochain_reveil`, `number.*`,
`binary_sensor.*`, `button.*`) sont **résolues automatiquement** à partir du
préfixe du switch — aucune configuration supplémentaire.

### Multi-alarmes

Une carte par réveil, dans une vue *sections* à 2 colonnes :

```yaml
type: custom:smartwake-card
entity: switch.reveil_semaine_actif
name: Réveil semaine
---
type: custom:smartwake-card
entity: switch.reveil_weekend_actif
name: Réveil weekend
```

## Correspondance des statuts

| `sensor.<nom>_statut` | Rendu                                              |
| --------------------- | -------------------------------------------------- |
| `idle`                | Carte normale                                      |
| `prewake`             | Carte normale, sous-titre "La maison se prépare"   |
| `ringing`             | Carte sonnerie (bordure pulsée, Snooze / Stop)     |
| `snoozed`             | Carte normale, sous-titre "Re-sonne dans X min"    |
| `done`                | Carte normale                                      |

## Développement

```bash
npm install
npm run build   # bundle src/smartwake-card.ts → dist/smartwake-card.js
```

Le `select.<nom>_jours` est interprété ainsi : si l'attribut `jours_actifs`
(ou `days`) expose une liste, elle pilote les pastilles ; sinon les modes
`tous` / `semaine` / `weekend` sont mappés ; tout autre mode affiche son
libellé à côté des pastilles.

## Licence

MIT