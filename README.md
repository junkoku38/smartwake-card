# SmartWAKE Card

Carte Lovelace custom pour l'intégration [SmartWAKE](https://github.com/junkoku38/smartwake).

**v3.2** — éditeur visuel de configuration, panneau de réglages éditable et
anneau de progression du pré-réveil. Alignée sur les entités de l'intégration
SmartWAKE 2.5.7.

## Design

### État normal
- **En-tête** : pastille ambre + nom + sous-titre de statut ("Sonne aujourd'hui · férié", "Préparation · 12 min avant sonnerie"...) + toggle d'activation
- **Anneau de progression** autour de l'icône pendant la phase `prewake`, doublé d'une **barre de progression** avec pourcentage, minutes restantes et rappel des durées d'aube / pré-chauffage
- **Heure** en 44 px avec compte à rebours ("dans 8 h 12 min"), déduite de
  `sensor.<nom>_prochain_reveil` afin de refléter l'heure réellement planifiée
- **Jours** : 7 pastilles rondes L Ma Me J V S D, actives en ambre (tap → sélecteur de jours).
  En mode `par_jour`, l'heure de chaque jour est affichée sous sa pastille
- **Chips d'état annulables** : « Mode vacances » et « Prochain sauté » apparaissent
  quand ils sont actifs et se désactivent d'un clic
- **Chips contextuelles** : Férié / Weekend / Vacances sco / En cours (vertes quand actives)
- **Actions rapides** : Skip 1× · Test · Reset · compteur de snoozes (`utilisés/max`)
- **Footer réglages** : volume final · luminosité max · pré-chauffage · aube · café (tap → réglage)
- **Statistiques** : réveils / snoozes / stops cumulés + date du dernier réveil

### Panneau de réglages

Le chevron en bas à droite déplie un panneau qui permet de **modifier les
paramètres directement depuis la carte**, sans passer par les fiches
*more-info* :

| Réglage | Contrôle |
|---|---|
| Heure | champ `time` + boutons −5 / +5 min |
| Jours | 4 boutons : Tous / Lundi-vendredi / Samedi-dimanche / Personnalisé |
| Mode d'heure | Heure unique / Par jour |
| Mode vacances, Sauter le prochain | interrupteurs |
| Durée snooze, Snooze max | steppers −/+ |
| Aube, Pré-chauffage, Durée éclairage, Escalade, Café avant | steppers −/+ |
| Luminosité max, Volume initial, Volume final | steppers −/+ affichés en % |

Les steppers respectent le `step`, le `min` et le `max` déclarés par chaque
entité `number` et se désactivent aux bornes.

> **Requiert SmartWAKE ≥ 2.10.0.** Les entités `mode_heure`, `mode_vacances`,
> `saut_du_prochain` et les heures par jour n'existent qu'à partir de 2.7.0, et
> les versions antérieures à 2.10.0 comportent plusieurs bugs bloquants
> (réglages non modifiables, réveil désarmé par toute modification, heures par
> jour sonnant tous les jours). Les éléments correspondants sont simplement
> masqués si l'intégration est plus ancienne.

Le rafraîchissement passe automatiquement de 30 s à 5 s pendant le `prewake`
pour une progression fluide.

### État sonnerie (`statut = ringing`)
La carte se transforme : bordure ambre pulsée, deux gros boutons tactiles
**Snooze** (`smartwake.snooze`) et **Stop** (`smartwake.stop`), le nombre de
snoozes restants, et le rappel de l'escalade à venir. Le bouton Snooze se
désactive automatiquement quand `max_snooze` est atteint. Pensée pour un doigt
endormi à 6 h 45.

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

La carte fournit un **éditeur visuel** : *Ajouter une carte → SmartWAKE Card*
propose directement un formulaire (sélecteur de réveil filtré sur l'intégration
SmartWAKE, nom, et interrupteurs d'affichage). Le YAML reste disponible via
*Afficher l'éditeur de code*.

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
| `show_settings` | bool   | true      | Afficher le footer réglages et le panneau d'édition|

Toutes les autres entités sont **résolues automatiquement** — aucune
configuration supplémentaire.

La résolution passe par l'**appareil** auquel appartient le switch : la carte
lit le registre d'entités, retient celles du même appareil, et identifie chacune
par son suffixe. Elle reste donc correcte même si vous renommez les `entity_id`
dans Home Assistant, ce qui casserait une simple déduction de préfixe. Si le
registre n'est pas accessible (versions anciennes de HA), la carte retombe sur
la déduction depuis `switch.<préfixe>_actif`.

### Entités lues

Pour un réveil nommé `reveil` :

```yaml
switch.reveil_actif                     # toggle d'activation
time.reveil_heure                       # heure affichée
select.reveil_jours                     # tous | semaine | weekend | personnalise
sensor.reveil_statut                    # idle|prewake|ringing|snoozed|done|inactif
sensor.reveil_prochain_reveil           # compte à rebours + progression prewake
sensor.reveil_snooze_utilises           # compteur de snoozes
sensor.reveil_declenchements_total      # statistiques
sensor.reveil_snoozes_total
sensor.reveil_stops_total
sensor.reveil_dernier_reveil
binary_sensor.reveil_sonne_aujourd_hui  # sous-titre
binary_sensor.reveil_reveil_en_cours    # chip « En cours »
binary_sensor.reveil_jour_ferie
binary_sensor.reveil_weekend
binary_sensor.reveil_vacances_scolaires
number.reveil_snooze_min                # libellé du bouton Snooze
number.reveil_max_snooze                # snoozes restants
number.reveil_aube_min                  # progression prewake + footer
number.reveil_pre_chauffage_min         # progression prewake + footer
number.reveil_escalade_min              # rappel d'escalade
number.reveil_volume_final              # footer
number.reveil_luminosite_max            # footer
number.reveil_cafe_avant_min            # footer
```

Chaque élément est cliquable et ouvre la fiche *more-info* de l'entité
correspondante. Les entités absentes sont simplement masquées.

Les entités **écrites** par la carte via le panneau de réglages :
`time.set_value` sur l'heure, `select.select_option` sur les jours,
`number.set_value` sur les 10 paramètres numériques.

> Le mode `personnalise` du sélecteur de jours ne peut pas être détaillé :
> l'intégration n'expose pas la liste `jours_perso`. La carte affiche alors le
> libellé « Personnalisé » à côté des pastilles.

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

| `sensor.<nom>_statut` | Rendu                                                         |
| --------------------- | ------------------------------------------------------------- |
| `idle`                | Carte normale                                                 |
| `prewake`             | Anneau + barre de progression, liseré ambre à gauche           |
| `ringing`             | Carte sonnerie (bordure pulsée, Snooze / Stop)                 |
| `snoozed`             | Pastille verte, sous-titre "Re-sonne dans X min"              |
| `done`                | Carte normale                                                 |
| `inactif`             | Carte grisée, sous-titre "Désactivé"                          |

## Heure affichée et heure de référence

L'intégration peut planifier un réveil à une heure différente de
`time.<nom>_heure` dans deux cas :

| Mécanisme | Option de l'intégration |
| --- | --- |
| Heures différentes selon le jour | `mode_heure: par_jour` + `heure_lundi`… |
| Décalage selon le premier rendez-vous | `adaptatif_agenda` |

La carte affiche donc l'heure issue de `sensor.<nom>_prochain_reveil`, qui est
la seule source fiable. Lorsqu'elle diffère de `time.<nom>_heure`, la mention
**« ajustée depuis HH:MM »** apparaît sous le compte à rebours, et le panneau de
réglages renomme le champ en *Heure de référence*.

> L'agenda adaptatif n'est exposé par aucune entité : elles se configurent
> uniquement dans les options de l'intégration. La carte ne peut ni les lire ni
> les modifier, elle en constate seulement l'effet.

## Calcul de la progression du pré-réveil

L'intégration démarre la phase `prewake` à `H − max(pre_chauffage_min, aube_min)`.
La carte reproduit ce calcul :

```
total   = max(number.<nom>_aube_min, number.<nom>_pre_chauffage_min)
début   = sensor.<nom>_prochain_reveil − total
progrès = (maintenant − début) / (prochain_reveil − début)
```

Si les deux durées valent 0, ni l'anneau ni la barre ne sont affichés.

## Développement

```bash
npm install
npm run build          # bundle → dist/smartwake-card.js
npm run build:release  # build + copie du bundle à la racine (requis par HACS)
```

Le bundle doit être versionné à la racine (`smartwake-card.js`) car `hacs.json`
utilise `content_in_root: true`.

## Licence

MIT