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

interface HomeAssistant {
  states: Record<string, HassEntity>;
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

  private _tick?: number;
  private _tickMs = 0;

  static getStubConfig(): Partial<SmartwakeCardConfig> {
    return { entity: "switch.reveil_actif", name: "Réveil" };
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

  private _e(domain: string, suffix: string): HassEntity | undefined {
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

  private get _heure(): string {
    const t = this._e("time", "heure")?.state ?? "--:--";
    return t.substring(0, 5);
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
          ${on && countdown ? html`<span class="cd">${countdown}</span>` : nothing}
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

  private _renderDays(): TemplateResult {
    const sel = this._e("select", "jours");
    const active = this._activeDays();
    const mode = sel?.state.toLowerCase() ?? "";
    return html`
      <div class="days" @click=${() => this._moreInfo(sel?.entity_id)}>
        ${DAYS.map(
          ([day, label]) => html`<div class="day ${active?.includes(day) ? "on" : ""}">${label}</div>`
        )}
        ${!active && sel
          ? html`<span class="mode">${MODE_LABEL[mode] ?? sel.state}</span>`
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
    return html`
      <div class="chips">
        ${chip("jour_ferie", "mdi:calendar-remove", "Férié")}
        ${chip("weekend", "mdi:calendar-weekend", "Weekend")}
        ${chip("vacances_scolaires", "mdi:school", "Vacances sco")}
        ${chip("reveil_en_cours", "mdi:alarm-bell", "En cours")}
      </div>
    `;
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
        <ha-icon class="chev" icon="mdi:chevron-right" @click=${() => this._moreInfo(this._config.entity)}></ha-icon>
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
      --mdc-icon-size: 16px;
      flex: none;
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
