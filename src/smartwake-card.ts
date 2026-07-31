import { LitElement, html, css, nothing, TemplateResult, svg } from "lit";
import { property, state } from "lit/decorators.js";

/* SmartWAKE Card v3 — aligné sur l'intégration smartwake 2.4.0
 * Anneau de progression pendant la phase prewake (aube / pré-chauffage),
 * en-tête statut + toggle, grande heure + compte à rebours,
 * pastilles de jours, chips contextuelles, footer réglages, stats,
 * état sonnerie plein cadre avec Snooze / Stop.
 */

interface SmartwakeCardConfig {
  type: string;
  entity: string; // switch.<nom>_actif
  name?: string;
  show_stats?: boolean;
  show_context?: boolean;
  show_settings?: boolean;
}

interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

/* Entrée du registre d'entités exposée au frontend */
interface HassRegistryEntry {
  entity_id: string;
  device_id?: string | null;
  platform?: string;
}

interface HomeAssistant {
  states: Record<string, HassEntity>;
  /* Absent sur les versions anciennes : la carte retombe alors sur la
   * déduction de préfixe. */
  entities?: Record<string, HassRegistryEntry>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, any>,
    target?: Record<string, any>
  ) => Promise<any>;
}

const DAYS: Array<[string, string]> = [
  ["lundi", "L"],
  ["mardi", "Ma"],
  ["mercredi", "Me"],
  ["jeudi", "J"],
  ["vendredi", "V"],
  ["samedi", "S"],
  ["dimanche", "D"],
];

/* Options réelles du select : tous | semaine | weekend | personnalise */
const MODE_DAYS: Record<string, string[]> = {
  tous: DAYS.map(([d]) => d),
  semaine: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
  weekend: ["samedi", "dimanche"],
};

const MODE_LABEL: Record<string, string> = {
  tous: "Tous les jours",
  semaine: "Lundi au vendredi",
  weekend: "Samedi et dimanche",
  personnalise: "Personnalisé",
};

/* Valeurs réelles du sensor de statut (device_class enum) */
const STATUS_LABEL: Record<string, string> = {
  idle: "En attente",
  prewake: "La maison se prépare",
  ringing: "Ça sonne",
  snoozed: "Snooze",
  done: "Terminé",
  inactif: "Désactivé",
};

const RING_R = 19;
const RING_C = 2 * Math.PI * RING_R;

class SmartwakeCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: SmartwakeCardConfig;
  @state() private _now: number = Date.now();
  @state() private _open = false;

  private _tick?: number;
  private _tickMs = 0;

  static getStubConfig(): Partial<SmartwakeCardConfig> {
    return { entity: "switch.reveil_actif", name: "Réveil" };
  }

  /* Éditeur visuel dans l'UI Lovelace */
  static getConfigElement(): HTMLElement {
    return document.createElement("smartwake-card-editor");
  }

  setConfig(config: SmartwakeCardConfig): void {
    if (!config.entity || !config.entity.startsWith("switch.")) {
      throw new Error(
        "smartwake-card : « entity » doit être le switch SmartWAKE (switch.<nom>_actif)"
      );
    }
    this._config = {
      show_stats: true,
      show_context: true,
      show_settings: true,
      ...config,
    };
  }

  getCardSize(): number {
    return 5;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._startTick(30_000);
  }

  disconnectedCallback(): void {
    if (this._tick) window.clearInterval(this._tick);
    this._tick = undefined;
    this._tickMs = 0;
    super.disconnectedCallback();
  }

  private _startTick(ms: number): void {
    if (this._tick) window.clearInterval(this._tick);
    this._tickMs = ms;
    this._tick = window.setInterval(() => (this._now = Date.now()), ms);
  }

  /* Rafraîchissement accéléré pendant le prewake pour une progression fluide */
  protected updated(): void {
    if (!this._config || !this.hass || !this._tick) return;
    const wanted = this._statut === "prewake" ? 5_000 : 30_000;
    if (wanted !== this._tickMs) this._startTick(wanted);
  }

  /* ---------- Résolution des entités ---------- */

  private get _base(): string {
    return this._config.entity.replace(/^switch\./, "").replace(/_actif$/, "");
  }

  private _st(entityId: string): HassEntity | undefined {
    return this.hass?.states[entityId];
  }

  /* Entités du même appareil, groupées par domaine.
   *
   * La déduction du préfixe depuis `switch.<prefixe>_actif` suppose que tous
   * les entity_id partagent ce préfixe. Or ils sont produits par le slugify de
   * Home Assistant sur « nom du réveil + nom de l'entité », et le nom du réveil
   * accepte désormais accents et tirets : la déduction peut donc échouer.
   * Passer par l'appareil est fiable quel que soit le nom.
   */
  private _famille: Record<string, string[]> | null = null;
  private _familleClef = "";

  private _entitesDeLAppareil(): Record<string, string[]> | null {
    const registre = this.hass?.entities;
    const deviceId = registre?.[this._config.entity]?.device_id;
    if (!registre || !deviceId) return null;

    const clef = `${deviceId}|${Object.keys(registre).length}`;
    if (this._famille && this._familleClef === clef) return this._famille;

    const parDomaine: Record<string, string[]> = {};
    for (const [entityId, entree] of Object.entries(registre)) {
      if (entree?.device_id !== deviceId) continue;
      const domaine = entityId.slice(0, entityId.indexOf("."));
      (parDomaine[domaine] ??= []).push(entityId);
    }
    // Le plus court d'abord : « _heure » ne doit pas capter « _heure_lundi »
    for (const liste of Object.values(parDomaine)) {
      liste.sort((a, b) => a.length - b.length);
    }

    this._famille = parDomaine;
    this._familleClef = clef;
    return parDomaine;
  }

  private _e(domain: string, suffix: string): HassEntity | undefined {
    const candidats = this._entitesDeLAppareil()?.[domain];
    if (candidats) {
      const cible = candidats.find((id) => id.endsWith(`_${suffix}`));
      if (cible) return this._st(cible);
    }
    // Repli : déduction du préfixe depuis l'entité configurée
    return this._st(`${domain}.${this._base}_${suffix}`);
  }

  private _num(suffix: string): number | null {
    const e = this._e("number", suffix);
    if (!e) return null;
    const v = parseFloat(e.state);
    return isNaN(v) ? null : v;
  }

  private _isOnBs(suffix: string): boolean {
    return this._e("binary_sensor", suffix)?.state === "on";
  }

  /* ---------- Données dérivées ---------- */

  private get _statut(): string {
    return this._e("sensor", "statut")?.state ?? "inactif";
  }

  private get _isOn(): boolean {
    return this._st(this._config.entity)?.state === "on";
  }

  /* Heure de référence configurée (time.heure) */
  private get _heureConfig(): string {
    const t = this._e("time", "heure")?.state ?? "--:--";
    return t.substring(0, 5);
  }

  /* Heure réellement planifiée, déduite de sensor.prochain_reveil.
   * Peut différer de time.heure dans trois cas gérés par l'intégration :
   * mode_heure = par_jour, agenda adaptatif. */
  private get _heureEffective(): string | null {
    const ts = this._nextTs();
    if (ts === null) return null;
    const d = new Date(ts);
    return (
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0")
    );
  }

  /* L'heure affichée est celle qui sonnera réellement */
  private get _heure(): string {
    return this._heureEffective ?? this._heureConfig;
  }

  private get _heureAjustee(): boolean {
    const eff = this._heureEffective;
    return eff !== null && eff !== this._heureConfig;
  }

  private _activeDays(): string[] | null {
    const sel = this._e("select", "jours");
    if (!sel) return null;
    return MODE_DAYS[sel.state.toLowerCase()] ?? null;
  }

  private _nextTs(): number | null {
    const next = this._e("sensor", "prochain_reveil")?.state;
    if (!next || next === "unknown" || next === "unavailable") return null;
    const t = new Date(next).getTime();
    return isNaN(t) ? null : t;
  }

  private _countdown(): string | null {
    const target = this._nextTs();
    if (target === null) return null;
    const d = Math.max(0, Math.round((target - this._now) / 1000));
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    if (h >= 48) return `dans ${Math.round(h / 24)} jours`;
    return h > 0
      ? `dans ${h} h ${String(m).padStart(2, "0")} min`
      : `dans ${m} min`;
  }

  /* Le prewake démarre à H − max(pré-chauffage, aube) — cf. coordinator */
  private _prewake(): { pct: number; reste: number; total: number } | null {
    if (this._statut !== "prewake") return null;
    const target = this._nextTs();
    if (target === null) return null;
    const total = Math.max(this._num("aube_min") ?? 0, this._num("pre_chauffage_min") ?? 0);
    if (total <= 0) return null;
    const start = target - total * 60_000;
    const span = target - start;
    const pct = Math.min(1, Math.max(0, (this._now - start) / span));
    const reste = Math.max(0, Math.ceil((target - this._now) / 60_000));
    return { pct, reste, total };
  }

  private _snoozeInfo(): { used: number; max: number | null } {
    const used = parseInt(this._e("sensor", "snooze_utilises")?.state ?? "0");
    return { used: isNaN(used) ? 0 : used, max: this._num("max_snooze") };
  }

  private _subtitle(): string {
    const s = this._statut;

    if (s === "ringing") {
      const { used, max } = this._snoozeInfo();
      if (used > 0) return `Snooze ${used}${max !== null ? `/${max}` : ""} utilisé${used > 1 ? "s" : ""}`;
      return "Debout !";
    }
    if (s === "snoozed") {
      const min = this._num("snooze_min");
      return min !== null ? `Re-sonne dans ${min} min` : "Snooze en cours";
    }
    if (s === "prewake") {
      const p = this._prewake();
      return p ? `Préparation · ${p.reste} min avant sonnerie` : STATUS_LABEL.prewake;
    }
    if (!this._isOn || s === "inactif") return "Désactivé";

    const parts: string[] = [];
    parts.push(this._isOnBs("sonne_aujourd_hui") ? "Sonne aujourd'hui" : "Inactif aujourd'hui");
    if (this._isOnBs("jour_ferie")) parts.push("férié");
    if (this._isOnBs("vacances_scolaires")) parts.push("vacances sco");
    return parts.join(" · ");
  }

  /* ---------- Actions ---------- */

  private _svc(service: string): void {
    this.hass.callService("smartwake", service, {
      entity_id: [this._config.entity],
    });
  }

  private _toggle(): void {
    this.hass.callService("switch", this._isOn ? "turn_off" : "turn_on", {
      entity_id: this._config.entity,
    });
  }

  /* ---------- Écritures ---------- */

  private _setHeure(value: string): void {
    const ent = this._e("time", "heure");
    if (!ent || !/^\d{2}:\d{2}/.test(value)) return;
    this.hass.callService("time", "set_value", {
      entity_id: ent.entity_id,
      time: value.length === 5 ? `${value}:00` : value,
    });
  }

  /* Décale l'heure de référence de N minutes (peut être négatif) */
  private _shiftHeure(deltaMin: number): void {
    const cur = this._heureConfig;
    const [h, m] = cur.split(":").map((n) => parseInt(n));
    if (isNaN(h) || isNaN(m)) return;
    let total = (h * 60 + m + deltaMin) % 1440;
    if (total < 0) total += 1440;
    const nh = String(Math.floor(total / 60)).padStart(2, "0");
    const nm = String(total % 60).padStart(2, "0");
    this._setHeure(`${nh}:${nm}`);
  }

  private _setJours(mode: string): void {
    const ent = this._e("select", "jours");
    if (!ent) return;
    this.hass.callService("select", "select_option", {
      entity_id: ent.entity_id,
      option: mode,
    });
  }

  private _setNumber(suffix: string, value: number): void {
    const ent = this._e("number", suffix);
    if (!ent) return;
    const min = parseFloat(ent.attributes.min ?? "0");
    const max = parseFloat(ent.attributes.max ?? "100");
    const clamped = Math.min(max, Math.max(min, value));
    this.hass.callService("number", "set_value", {
      entity_id: ent.entity_id,
      value: clamped,
    });
  }

  private _stepNumber(suffix: string, dir: number): void {
    const ent = this._e("number", suffix);
    const cur = this._num(suffix);
    if (!ent || cur === null) return;
    const step = parseFloat(ent.attributes.step ?? "1") || 1;
    const next = cur + dir * step;
    /* Évite les artefacts de flottants sur les steps à 0.01 */
    this._setNumber(suffix, Math.round(next * 100) / 100);
  }

  private _moreInfo(entityId?: string): void {
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId },
      })
    );
  }

  /* ---------- Rendu ---------- */

  render(): TemplateResult {
    if (!this._config || !this.hass) return html``;
    if (!this._st(this._config.entity)) {
      return html`<ha-card class="card">
        <div class="err">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          Entité introuvable : ${this._config.entity}
        </div>
      </ha-card>`;
    }
    return this._statut === "ringing" ? this._renderRinging() : this._renderNormal();
  }

  private _renderNormal(): TemplateResult {
    const on = this._isOn;
    const statut = this._statut;
    const prewake = this._prewake();
    const countdown = this._countdown();

    return html`
      <ha-card class="card ${on ? "" : "dim"} ${statut === "prewake" ? "prewake" : ""}">
        <div class="header">
          <div class="id">
            <div class="badge-wrap">
              <div class="badge ${on ? (statut === "snoozed" ? "snooze" : "amber") : "off"}">
                <ha-icon
                  icon=${statut === "snoozed" ? "mdi:alarm-snooze" : on ? "mdi:alarm" : "mdi:alarm-off"}
                ></ha-icon>
              </div>
              ${prewake ? this._renderRing(prewake.pct) : nothing}
            </div>
            <div class="titles">
              <div class="name">${this._config.name ?? "SmartWAKE"}</div>
              <div class="sub">${this._subtitle()}</div>
            </div>
          </div>
          <ha-switch .checked=${on} @change=${this._toggle}></ha-switch>
        </div>

        <div class="time" @click=${() => this._moreInfo(this._e("time", "heure")?.entity_id)}>
          <span class="big">${this._heure}</span>
          <div class="time-meta">
            ${on && countdown ? html`<span class="cd">${countdown}</span>` : nothing}
            ${on && this._heureAjustee
              ? html`<span
                  class="adj"
                  title="L'heure planifiée diffère de l'heure de référence (${this
                    ._heureConfig}) : heures par jour ou agenda adaptatif."
                >
                  <ha-icon icon="mdi:calendar-sync"></ha-icon>ajustée depuis
                  ${this._heureConfig}
                </span>`
              : nothing}
          </div>
        </div>

        ${prewake ? this._renderPrewakeBar(prewake) : nothing}
        ${this._renderDays()}
        ${this._config.show_context ? this._renderChips() : nothing}
        ${this._renderQuickActions()}
        ${this._config.show_settings ? this._renderFooter() : nothing}
        ${this._config.show_stats ? this._renderStats() : nothing}
      </ha-card>
    `;
  }

  private _renderRing(pct: number): TemplateResult {
    return html`
      <svg class="ring" viewBox="0 0 44 44" aria-hidden="true">
        ${svg`
          <circle class="ring-bg" cx="22" cy="22" r=${RING_R}></circle>
          <circle
            class="ring-fg"
            cx="22" cy="22" r=${RING_R}
            stroke-dasharray=${RING_C}
            stroke-dashoffset=${RING_C * (1 - pct)}
          ></circle>
        `}
      </svg>
    `;
  }

  private _renderPrewakeBar(p: { pct: number; reste: number; total: number }): TemplateResult {
    const aube = this._num("aube_min");
    const chauffe = this._num("pre_chauffage_min");
    const legend: string[] = [];
    if (aube) legend.push(`aube ${aube} min`);
    if (chauffe) legend.push(`chauffe ${chauffe} min`);
    return html`
      <div class="prewake-block">
        <div class="bar"><div class="bar-fill" style="width:${(p.pct * 100).toFixed(1)}%"></div></div>
        <div class="bar-legend">
          <span>${Math.round(p.pct * 100)} % · ${p.reste} min restantes</span>
          ${legend.length ? html`<span>${legend.join(" · ")}</span>` : nothing}
        </div>
      </div>
    `;
  }

  /* Vrai si l'intégration utilise une heure distincte par jour */
  private get _parJour(): boolean {
    return this._e("select", "mode_heure")?.state === "par_jour";
  }

  /* Heure propre à un jour, si définie (time.<nom>_heure_lundi …) */
  private _heureDuJour(jour: string): string | null {
    const ent = this._e("time", `heure_${jour}`);
    if (!ent || ["unknown", "unavailable", ""].includes(ent.state)) return null;
    return ent.state.substring(0, 5);
  }

  private _renderDays(): TemplateResult {
    const sel = this._e("select", "jours");
    const active = this._activeDays();
    const mode = sel?.state.toLowerCase() ?? "";
    const parJour = this._parJour;

    return html`
      <div class="days ${parJour ? "with-hours" : ""}">
        ${DAYS.map(([day, label]) => {
          const on = active?.includes(day) ?? false;
          const heure = parJour ? this._heureDuJour(day) : null;
          const ent = parJour
            ? this._e("time", `heure_${day}`)?.entity_id
            : sel?.entity_id;
          return html`
            <div class="day-col" @click=${() => this._moreInfo(ent)}>
              <div class="day ${on ? "on" : ""}">${label}</div>
              ${parJour
                ? html`<span class="day-hour ${on ? "" : "off"}"
                    >${heure ?? this._heureConfig}</span
                  >`
                : nothing}
            </div>
          `;
        })}
        ${!active && sel
          ? html`<span class="mode" @click=${() => this._moreInfo(sel.entity_id)}
              >${MODE_LABEL[mode] ?? sel.state}</span
            >`
          : nothing}
      </div>
    `;
  }

  private _renderChips(): TemplateResult | typeof nothing {
    const chip = (suffix: string, icon: string, label: string) => {
      const ent = this._e("binary_sensor", suffix);
      if (!ent) return nothing;
      return html`<div
        class="chip ${ent.state === "on" ? "teal" : ""}"
        @click=${() => this._moreInfo(ent.entity_id)}
      >
        <ha-icon icon=${icon}></ha-icon>${label}
      </div>`;
    };
    /* Interrupteurs : la chip bascule l'état au clic */
    const bascule = (
      suffix: string,
      icon: string,
      label: string,
      couleur: string,
    ) => {
      const ent = this._e("switch", suffix);
      if (!ent) return nothing;
      const on = ent.state === "on";
      if (!on) return nothing; // n'affiche que si actif, pour rester compact
      return html`<div
        class="chip ${couleur}"
        title="Cliquer pour annuler"
        @click=${() => this._toggleSwitch(ent.entity_id)}
      >
        <ha-icon icon=${icon}></ha-icon>${label}
        <ha-icon class="chip-x" icon="mdi:close"></ha-icon>
      </div>`;
    };

    return html`
      <div class="chips">
        ${bascule("mode_vacances", "mdi:beach", "Mode vacances", "amber-chip")}
        ${bascule("saut_du_prochain", "mdi:skip-next", "Prochain sauté", "amber-chip")}
        ${chip("jour_ferie", "mdi:calendar-remove", "Férié")}
        ${chip("weekend", "mdi:calendar-weekend", "Weekend")}
        ${chip("vacances_scolaires", "mdi:school", "Vacances sco")}
        ${chip("reveil_en_cours", "mdi:alarm-bell", "En cours")}
      </div>
    `;
  }

  private _toggleSwitch(entityId: string): void {
    this.hass.callService("switch", "toggle", { entity_id: entityId });
  }

  private _renderInterrupteur(
    suffix: string,
    label: string
  ): TemplateResult | typeof nothing {
    const ent = this._e("switch", suffix);
    if (!ent) return nothing;
    return html`
      <div class="row">
        <span class="row-label" @click=${() => this._moreInfo(ent.entity_id)}>
          ${label}
        </span>
        <ha-switch
          .checked=${ent.state === "on"}
          @change=${() => this._toggleSwitch(ent.entity_id)}
        ></ha-switch>
      </div>
    `;
  }

  private _renderModeHeure(): TemplateResult | typeof nothing {
    const ent = this._e("select", "mode_heure");
    if (!ent) return nothing;
    const courant = ent.state;
    const options: Array<[string, string]> = [
      ["unique", "Heure unique"],
      ["par_jour", "Par jour"],
    ];
    return html`
      <div class="row wrap">
        <span class="row-label" @click=${() => this._moreInfo(ent.entity_id)}>
          Mode d'heure
        </span>
        <div class="modes">
          ${options.map(
            ([val, lab]) => html`<button
              class="mode-btn ${courant === val ? "sel" : ""}"
              @click=${() => this._setSelect(ent.entity_id, val)}
            >
              ${lab}
            </button>`
          )}
        </div>
      </div>
      ${courant === "par_jour"
        ? html`<div class="hint">
            Chaque jour utilise l'heure de sa pastille ci-dessus. Un jour sans
            heure définie retombe sur l'heure de référence.
          </div>`
        : nothing}
    `;
  }

  private _setSelect(entityId: string, option: string): void {
    this.hass.callService("select", "select_option", {
      entity_id: entityId,
      option,
    });
  }

  private _renderQuickActions(): TemplateResult {
    const { used, max } = this._snoozeInfo();
    return html`
      <div class="chips">
        <div class="chip act" @click=${() => this._svc("sauter_prochain")}>
          <ha-icon icon="mdi:skip-next"></ha-icon>Skip 1×
        </div>
        <div class="chip act" @click=${() => this._svc("declencher")}>
          <ha-icon icon="mdi:bell-ring"></ha-icon>Test
        </div>
        <div class="chip act" @click=${() => this._svc("reset")}>
          <ha-icon icon="mdi:restart"></ha-icon>Reset
        </div>
        ${used > 0
          ? html`<div class="chip stat-chip">
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>${used}${max !== null ? `/${max}` : ""}
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderFooter(): TemplateResult | typeof nothing {
    const spec = (
      suffix: string,
      icon: string,
      fmt: (v: number) => string
    ): TemplateResult | typeof nothing => {
      const v = this._num(suffix);
      if (v === null) return nothing;
      return html`<span @click=${() => this._moreInfo(this._e("number", suffix)?.entity_id)}>
        <ha-icon icon=${icon}></ha-icon>${fmt(v)}
      </span>`;
    };
    return html`
      <div class="footer">
        <div class="specs">
          ${spec("volume_final", "mdi:volume-high", (v) => `${Math.round(v * 100)} %`)}
          ${spec("luminosite_max", "mdi:brightness-5", (v) => `${Math.round((v / 255) * 100)} %`)}
          ${spec("pre_chauffage_min", "mdi:radiator", (v) => `−${v} min`)}
          ${spec("aube_min", "mdi:weather-sunset-up", (v) => `${v} min`)}
          ${spec("cafe_avant_min", "mdi:coffee", (v) => `${v} min`)}
        </div>
        <ha-icon
          class="chev ${this._open ? "open" : ""}"
          icon="mdi:chevron-down"
          title="Régler"
          @click=${() => (this._open = !this._open)}
        ></ha-icon>
      </div>
      ${this._open ? this._renderSettings() : nothing}
    `;
  }

  /* Panneau de réglages éditable */
  private _renderSettings(): TemplateResult {
    const sel = this._e("select", "jours");
    const mode = sel?.state.toLowerCase() ?? "";

    const stepper = (
      suffix: string,
      label: string,
      fmt: (v: number) => string
    ): TemplateResult | typeof nothing => {
      const v = this._num(suffix);
      if (v === null) return nothing;
      const ent = this._e("number", suffix)!;
      const min = parseFloat(ent.attributes.min ?? "0");
      const max = parseFloat(ent.attributes.max ?? "100");
      return html`
        <div class="row">
          <span class="row-label" @click=${() => this._moreInfo(ent.entity_id)}>${label}</span>
          <div class="stepper">
            <button ?disabled=${v <= min} @click=${() => this._stepNumber(suffix, -1)}>
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <span class="row-val">${fmt(v)}</span>
            <button ?disabled=${v >= max} @click=${() => this._stepNumber(suffix, 1)}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        </div>
      `;
    };

    return html`
      <div class="settings">
        <div class="row">
          <span class="row-label">
            ${this._heureAjustee ? "Heure de référence" : "Heure"}
          </span>
          <div class="stepper">
            <button @click=${() => this._shiftHeure(-5)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <input
              class="time-input"
              type="time"
              .value=${this._heureConfig}
              @change=${(e: Event) => this._setHeure((e.target as HTMLInputElement).value)}
            />
            <button @click=${() => this._shiftHeure(5)}><ha-icon icon="mdi:plus"></ha-icon></button>
          </div>
        </div>
        ${this._heureAjustee
          ? html`<div class="hint">
              Le prochain réveil est planifié à ${this._heureEffective}. Les heures
              par jour et l'agenda adaptatif se configurent dans les options de
              l'intégration.
            </div>`
          : nothing}

        ${sel
          ? html`<div class="row wrap">
              <span class="row-label">Jours</span>
              <div class="modes">
                <!-- « Personnalisé » est volontairement absent : il suppose une
                     liste de jours qu'aucune entité n'expose, et l'appliquer
                     depuis la carte désactiverait le réveil sans le dire. -->
                ${["tous", "semaine", "weekend"].map(
                  (m) => html`<button
                    class="mode-btn ${mode === m ? "sel" : ""}"
                    @click=${() => this._setJours(m)}
                  >
                    ${MODE_LABEL[m]}
                  </button>`
                )}
                ${mode === "personnalise"
                  ? html`<span class="mode-btn sel lecture">
                      ${MODE_LABEL.personnalise}
                    </span>`
                  : nothing}
              </div>
            </div>`
          : nothing}
        ${mode === "personnalise"
          ? html`<div class="hint">
              Les jours personnalisés se choisissent dans les options de
              l'intégration.
            </div>`
          : nothing}

        ${this._renderModeHeure()}
        ${this._renderInterrupteur("mode_vacances", "Mode vacances")}
        ${this._renderInterrupteur("saut_du_prochain", "Sauter le prochain")}

        ${stepper("snooze_min", "Durée snooze", (v) => `${v} min`)}
        ${stepper("max_snooze", "Snooze max", (v) => `${v}`)}
        ${stepper("aube_min", "Aube", (v) => `${v} min`)}
        ${stepper("pre_chauffage_min", "Pré-chauffage", (v) => `${v} min`)}
        ${stepper("duree_eclairage_min", "Durée éclairage", (v) => `${v} min`)}
        ${stepper("luminosite_max", "Luminosité max", (v) => `${Math.round((v / 255) * 100)} %`)}
        ${stepper("escalade_min", "Escalade", (v) => `${v} min`)}
        ${stepper("volume_initial", "Volume initial", (v) => `${Math.round(v * 100)} %`)}
        ${stepper("volume_final", "Volume final", (v) => `${Math.round(v * 100)} %`)}
        ${stepper("cafe_avant_min", "Café avant", (v) => `${v} min`)}

        <div class="row">
          <span class="row-label">Fiche complète</span>
          <button class="mode-btn" @click=${() => this._moreInfo(this._config.entity)}>
            Ouvrir
          </button>
        </div>
      </div>
    `;
  }

  private _renderStats(): TemplateResult | typeof nothing {
    const cell = (suffix: string, label: string): TemplateResult | typeof nothing => {
      const e = this._e("sensor", suffix);
      if (!e) return nothing;
      return html`<div class="stat" @click=${() => this._moreInfo(e.entity_id)}>
        <div class="stat-v">${e.state}</div>
        <div class="stat-l">${label}</div>
      </div>`;
    };
    const dernier = this._e("sensor", "dernier_reveil");
    let dernierTxt: string | null = null;
    if (dernier && !["unknown", "unavailable", ""].includes(dernier.state)) {
      const d = new Date(dernier.state);
      if (!isNaN(d.getTime())) {
        dernierTxt =
          d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) +
          " à " +
          d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      }
    }
    return html`
      <div class="stats">
        ${cell("declenchements_total", "Réveils")}
        ${cell("snoozes_total", "Snoozes")}
        ${cell("stops_total", "Stops")}
      </div>
      ${dernierTxt
        ? html`<div class="last" @click=${() => this._moreInfo(dernier?.entity_id)}>
            <ha-icon icon="mdi:history"></ha-icon>Dernier réveil : ${dernierTxt}
          </div>`
        : nothing}
    `;
  }

  private _renderRinging(): TemplateResult {
    const snoozeMin = this._num("snooze_min");
    const escaladeMin = this._num("escalade_min");
    const { used, max } = this._snoozeInfo();
    const snoozeLeft = max === null ? null : Math.max(0, max - used);
    const canSnooze = snoozeLeft === null || snoozeLeft > 0;

    return html`
      <ha-card class="card ringing">
        <div class="header">
          <div class="id">
            <div class="badge-wrap">
              <div class="badge solid"><ha-icon icon="mdi:bell-ring"></ha-icon></div>
            </div>
            <div class="titles">
              <div class="name ring-name">Ça sonne</div>
              <div class="sub">${this._subtitle()}</div>
            </div>
          </div>
        </div>

        <div class="time"><span class="big">${this._heure}</span></div>

        <div class="actions">
          <button class="btn snooze" ?disabled=${!canSnooze} @click=${() => this._svc("snooze")}>
            <ha-icon icon="mdi:alarm-snooze"></ha-icon>
            <span>
              ${canSnooze
                ? `Snooze${snoozeMin !== null ? ` ${snoozeMin} min` : ""}`
                : "Plus de snooze"}
            </span>
          </button>
          <button class="btn stop" @click=${() => this._svc("stop")}>
            <ha-icon icon="mdi:alarm-off"></ha-icon>
            <span>Stop</span>
          </button>
        </div>

        ${snoozeLeft !== null && canSnooze
          ? html`<div class="ring-hint">${snoozeLeft} snooze${snoozeLeft > 1 ? "s" : ""} restant${snoozeLeft > 1 ? "s" : ""}</div>`
          : nothing}

        ${escaladeMin !== null
          ? html`<div class="footer esc">
              <ha-icon icon="mdi:progress-clock"></ha-icon>
              Escalade après ${escaladeMin} min · lumières + volume max
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  /* ---------- Styles ---------- */

  static styles = css`
    :host {
      --sw-amber: #ef9f27;
      --sw-amber-bg: rgba(239, 159, 39, 0.16);
      --sw-amber-text: #b87514;
      --sw-teal-bg: rgba(29, 158, 117, 0.15);
      --sw-teal-text: var(--success-color, #0f6e56);
      --sw-red-bg: rgba(226, 75, 74, 0.12);
      --sw-red-text: var(--error-color, #a32d2d);
    }
    .card {
      padding: 18px 20px;
      border-radius: var(--ha-card-border-radius, 12px);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card.dim .big,
    .card.dim .days,
    .card.dim .chips {
      opacity: 0.55;
    }
    .err {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--error-color);
      font-size: 13px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .id {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .badge-wrap {
      position: relative;
      width: 36px;
      height: 36px;
      flex: none;
    }
    .badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .badge.amber {
      background: var(--sw-amber-bg);
      color: var(--sw-amber);
    }
    .badge.snooze {
      background: var(--sw-teal-bg);
      color: var(--sw-teal-text);
    }
    .badge.off {
      background: var(--secondary-background-color);
      color: var(--disabled-text-color);
    }
    .badge.solid {
      background: var(--sw-amber);
      color: #fff;
    }
    .badge ha-icon {
      --mdc-icon-size: 20px;
    }
    /* Anneau de progression prewake */
    .ring {
      position: absolute;
      inset: -4px;
      width: 44px;
      height: 44px;
      transform: rotate(-90deg);
      pointer-events: none;
    }
    .ring circle {
      fill: none;
      stroke-width: 3;
    }
    .ring-bg {
      stroke: var(--sw-amber-bg);
    }
    .ring-fg {
      stroke: var(--sw-amber);
      stroke-linecap: round;
      transition: stroke-dashoffset 0.6s linear;
    }
    .titles {
      min-width: 0;
    }

    .name {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .ring-name {
      color: var(--sw-amber-text);
    }
    .sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .time {
      display: flex;
      align-items: baseline;
      gap: 10px;
      cursor: pointer;
    }
    .big {
      font-size: 44px;
      font-weight: 600;
      letter-spacing: -1px;
      line-height: 1;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .cd {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .time-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .adj {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--sw-amber-text);
      cursor: help;
    }
    .adj ha-icon {
      --mdc-icon-size: 13px;
    }
    /* Barre de progression prewake */
    .prewake-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .bar {
      height: 6px;
      border-radius: 3px;
      background: var(--secondary-background-color);
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 3px;
      background: var(--sw-amber);
      transition: width 0.6s linear;
    }
    .bar-legend {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .days {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
      cursor: pointer;
    }
    .days.with-hours {
      align-items: flex-start;
    }
    .day-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }
    .day-hour {
      font-size: 10px;
      font-variant-numeric: tabular-nums;
      color: var(--sw-amber-text);
    }
    .day-hour.off {
      color: var(--disabled-text-color);
    }
    .amber-chip {
      background: var(--sw-amber-bg);
      color: var(--sw-amber-text);
      font-weight: 600;
    }
    .chip-x {
      --mdc-icon-size: 12px;
      opacity: 0.7;
    }
    .day {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      background: var(--secondary-background-color);
      color: var(--disabled-text-color);
      transition: background 0.15s ease;
    }
    .day.on {
      background: var(--sw-amber-bg);
      color: var(--sw-amber-text);
      font-weight: 600;
    }
    .mode {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-left: 4px;
    }
    .chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      padding: 5px 10px;
      border-radius: 14px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      cursor: pointer;
      user-select: none;
    }
    .chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .chip.teal {
      background: var(--sw-teal-bg);
      color: var(--sw-teal-text);
    }
    .chip.act:active {
      transform: scale(0.96);
    }
    .chip.stat-chip {
      cursor: default;
      margin-left: auto;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .specs {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .specs span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
    .specs ha-icon,
    .footer ha-icon,
    .last ha-icon {
      --mdc-icon-size: 14px;
    }
    .chev {
      cursor: pointer;
      --mdc-icon-size: 18px;
      flex: none;
      transition: transform 0.2s ease;
    }
    .chev.open {
      transform: rotate(180deg);
      color: var(--sw-amber);
    }
    /* Panneau de réglages */
    .settings {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 4px 0 2px;
      animation: sw-slide 0.18s ease;
    }
    @keyframes sw-slide {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 34px;
    }
    .row.wrap {
      flex-wrap: wrap;
    }
    .row-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .stepper {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .stepper button,
    .mode-btn {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
      cursor: pointer;
      border-radius: 8px;
    }
    .stepper button {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .stepper button ha-icon {
      --mdc-icon-size: 16px;
    }
    .stepper button:active {
      background: var(--sw-amber-bg);
    }
    .stepper button[disabled] {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .row-val {
      min-width: 58px;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
    }
    .time-input {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      border-radius: 8px;
      padding: 4px 6px;
      text-align: center;
      width: 84px;
    }
    .modes {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .mode-btn {
      font-size: 11px;
      padding: 6px 9px;
      color: var(--secondary-text-color);
    }
    .mode-btn.lecture {
      cursor: default;
    }
    .mode-btn.sel {
      background: var(--sw-amber-bg);
      color: var(--sw-amber-text);
      font-weight: 600;
    }
    .hint {
      font-size: 11px;
      line-height: 1.35;
      color: var(--secondary-text-color);
      padding: 2px 0 6px;
    }
    /* Statistiques */
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 10px;
    }
    .stat {
      text-align: center;
      padding: 6px 4px;
      border-radius: 10px;
      background: var(--secondary-background-color);
      cursor: pointer;
    }
    .stat-v {
      font-size: 17px;
      font-weight: 600;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .stat-l {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
    }
    .last {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    /* --- État sonnerie --- */
    .card.ringing {
      border: 2px solid var(--sw-amber);
      animation: sw-pulse 2s infinite;
    }
    @keyframes sw-pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 rgba(239, 159, 39, 0.35);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(239, 159, 39, 0);
      }
    }
    .card.prewake {
      border-left: 3px solid var(--sw-amber);
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .btn {
      border: none;
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: transform 0.1s ease;
    }
    .btn:active {
      transform: scale(0.97);
    }
    .btn[disabled] {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .btn ha-icon {
      --mdc-icon-size: 24px;
    }
    .btn.snooze {
      background: var(--secondary-background-color);
      color: var(--sw-amber-text);
    }
    .btn.stop {
      background: var(--sw-red-bg);
      color: var(--sw-red-text);
    }
    .ring-hint {
      text-align: center;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .footer.esc {
      justify-content: flex-start;
      gap: 6px;
    }
  `;
}

customElements.define("smartwake-card", SmartwakeCard);

/* ---------------------------------------------------------------
 * Éditeur visuel de configuration
 * ------------------------------------------------------------- */

const EDITOR_SCHEMA = [
  {
    name: "entity",
    required: true,
    selector: { entity: { integration: "smartwake", domain: "switch" } },
  },
  { name: "name", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "show_context", selector: { boolean: {} } },
      { name: "show_settings", selector: { boolean: {} } },
      { name: "show_stats", selector: { boolean: {} } },
    ],
  },
];

const EDITOR_LABELS: Record<string, string> = {
  entity: "Réveil (switch SmartWAKE)",
  name: "Nom affiché",
  show_context: "Chips contextuelles",
  show_settings: "Réglages",
  show_stats: "Statistiques",
};

const EDITOR_HELPERS: Record<string, string> = {
  name: "Laisser vide pour utiliser « SmartWAKE »",
  show_context: "Férié, weekend, vacances scolaires, réveil en cours",
  show_settings: "Footer et panneau d'édition des paramètres",
  show_stats: "Compteurs cumulés et date du dernier réveil",
};

class SmartwakeCardEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: SmartwakeCardConfig;

  setConfig(config: SmartwakeCardConfig): void {
    this._config = {
      show_stats: true,
      show_context: true,
      show_settings: true,
      ...config,
    };
  }

  private _label = (schema: { name: string }): string =>
    EDITOR_LABELS[schema.name] ?? schema.name;

  private _helper = (schema: { name: string }): string =>
    EDITOR_HELPERS[schema.name] ?? "";

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const config = { ...ev.detail.value };
    /* Un nom vide doit disparaître de la config plutôt que d'être stocké */
    if (config.name === "") delete config.name;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }

  render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${EDITOR_SCHEMA}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  static styles = css`
    ha-form {
      display: block;
    }
  `;
}

customElements.define("smartwake-card-editor", SmartwakeCardEditor);

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "smartwake-card",
  name: "SmartWAKE Card",
  description:
    "Carte réveil pour SmartWAKE : heure, jours, contexte, progression du pré-réveil, snooze/stop.",
  preview: true,
});
