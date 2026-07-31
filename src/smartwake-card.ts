import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";

/* SmartWAKE Card v2 — design "carte réveil"
 * En-tête statut + toggle, grande heure + compte à rebours,
 * pastilles de jours, chips contextuelles, footer réglages,
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

const MODE_DAYS: Record<string, string[]> = {
  tous: DAYS.map(([d]) => d),
  semaine: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
  weekend: ["samedi", "dimanche"],
};

const STATUS_LABEL: Record<string, string> = {
  idle: "En attente",
  prewake: "Préparation en cours",
  ringing: "Ça sonne",
  snoozed: "Snooze",
  done: "Terminé",
};

class SmartwakeCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: SmartwakeCardConfig;
  @state() private _now: number = Date.now();

  private _tick?: number;

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
    return 4;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._tick = window.setInterval(() => (this._now = Date.now()), 30_000);
  }

  disconnectedCallback(): void {
    if (this._tick) window.clearInterval(this._tick);
    super.disconnectedCallback();
  }

  /* ---------- Résolution des entités ---------- */

  private get _base(): string {
    return this._config.entity
      .replace(/^switch\./, "")
      .replace(/_actif$/, "");
  }

  private _st(entityId: string): HassEntity | undefined {
    return this.hass?.states[entityId];
  }

  private _e(domain: string, suffix: string): HassEntity | undefined {
    return this._st(`${domain}.${this._base}_${suffix}`);
  }

  /* ---------- Données dérivées ---------- */

  private get _statut(): string {
    return this._e("sensor", "statut")?.state ?? "idle";
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
    const attr = sel.attributes.jours_actifs ?? sel.attributes.days;
    if (Array.isArray(attr)) return attr.map((d) => String(d).toLowerCase());
    const mode = sel.state.toLowerCase();
    return MODE_DAYS[mode] ?? null;
  }

  private _countdown(): string | null {
    const next = this._e("sensor", "prochain_reveil")?.state;
    if (!next || next === "unknown" || next === "unavailable") return null;
    const target = new Date(next).getTime();
    if (isNaN(target)) return null;
    const d = Math.max(0, Math.round((target - this._now) / 1000));
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    if (h >= 48) return `dans ${Math.round(h / 24)} jours`;
    return h > 0 ? `dans ${h} h ${String(m).padStart(2, "0")} min` : `dans ${m} min`;
  }

  private _subtitle(): string {
    const s = this._statut;
    if (s === "ringing") {
      const n = this._e("sensor", "snooze_count")?.state ?? "0";
      return n !== "0" ? `Snooze utilisés : ${n}` : "Debout !";
    }
    if (s === "snoozed") {
      const min = this._e("number", "snooze_min")?.state;
      return min ? `Re-sonne dans ${parseInt(min)} min` : "Snooze en cours";
    }
    if (s === "prewake") return "La maison se prépare";
    if (!this._isOn) return "Désactivé";
    const parts: string[] = [];
    if (this._e("binary_sensor", "sonne_aujourd_hui")?.state === "on") {
      parts.push("Sonne aujourd'hui");
    } else {
      parts.push("Inactif aujourd'hui");
    }
    if (this._e("binary_sensor", "jour_ferie")?.state === "on") parts.push("férié");
    if (this._e("binary_sensor", "vacances_scolaires")?.state === "on")
      parts.push("vacances sco");
    return parts.join(" · ");
  }

  /* ---------- Actions ---------- */

  private _svc(service: string): void {
    this.hass.callService(
      "smartwake",
      service,
      {},
      { entity_id: this._config.entity }
    );
  }

  private _toggle(): void {
    this.hass.callService(
      "switch",
      this._isOn ? "turn_off" : "turn_on",
      {},
      { entity_id: this._config.entity }
    );
  }

  private _pressButton(suffix: string): void {
    const btn = this._e("button", suffix);
    if (btn) {
      this.hass.callService("button", "press", {}, { entity_id: btn.entity_id });
    }
  }

  private _moreInfo(entityId?: string): void {
    if (!entityId) return;
    const ev = new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId },
    });
    this.dispatchEvent(ev);
  }

  /* ---------- Rendu ---------- */

  render(): TemplateResult {
    if (!this._config || !this.hass) return html``;
    if (!this._st(this._config.entity)) {
      return html`<ha-card class="card">
        <div class="err">Entité introuvable : ${this._config.entity}</div>
      </ha-card>`;
    }
    const ringing = this._statut === "ringing";
    return ringing ? this._renderRinging() : this._renderNormal();
  }

  private _renderNormal(): TemplateResult {
    const on = this._isOn;
    const countdown = this._countdown();
    return html`
      <ha-card class="card ${on ? "" : "dim"}">
        <div class="header">
          <div class="id">
            <div class="badge ${on ? "amber" : "off"}">
              <ha-icon icon="mdi:alarm"></ha-icon>
            </div>
            <div class="titles">
              <div class="name">${this._config.name ?? "SmartWAKE"}</div>
              <div class="sub">${this._subtitle()}</div>
            </div>
          </div>
          <ha-switch .checked=${on} @change=${this._toggle}></ha-switch>
        </div>

        <div
          class="time"
          @click=${() => this._moreInfo(this._e("time", "heure")?.entity_id)}
        >
          <span class="big">${this._heure}</span>
          ${on && countdown ? html`<span class="cd">${countdown}</span>` : nothing}
        </div>

        ${this._renderDays()}
        ${this._config.show_context ? this._renderChips() : nothing}
        ${this._renderQuickActions()}
        ${this._config.show_settings ? this._renderFooter() : nothing}
      </ha-card>
    `;
  }

  private _renderDays(): TemplateResult {
    const active = this._activeDays();
    const sel = this._e("select", "jours");
    return html`
      <div class="days" @click=${() => this._moreInfo(sel?.entity_id)}>
        ${DAYS.map(([day, label]) => {
          const isOn = active ? active.includes(day) : false;
          return html`<div class="day ${isOn ? "on" : ""}">${label}</div>`;
        })}
        ${!active && sel
          ? html`<span class="mode">${sel.state}</span>`
          : nothing}
      </div>
    `;
  }

  private _renderChips(): TemplateResult {
    const chip = (
      suffix: string,
      icon: string,
      label: string
    ): TemplateResult | typeof nothing => {
      const ent = this._e("binary_sensor", suffix);
      if (!ent) return nothing;
      const on = ent.state === "on";
      return html`<div
        class="chip ${on ? "teal" : ""}"
        @click=${() => this._moreInfo(ent.entity_id)}
      >
        <ha-icon icon="${icon}"></ha-icon>${label}
      </div>`;
    };
    return html`
      <div class="chips">
        ${chip("jour_ferie", "mdi:calendar-remove", "Férié")}
        ${chip("weekend", "mdi:glass-cocktail", "Weekend")}
        ${chip("vacances_scolaires", "mdi:beach", "Vacances sco")}
      </div>
    `;
  }

  private _renderQuickActions(): TemplateResult {
    return html`
      <div class="chips">
        <div class="chip act" @click=${() => this._pressButton("sauter_prochain")}>
          <ha-icon icon="mdi:skip-next"></ha-icon>Skip 1×
        </div>
        <div class="chip act" @click=${() => this._pressButton("declencher")}>
          <ha-icon icon="mdi:play"></ha-icon>Test
        </div>
        ${this._config.show_stats ? this._renderStats() : nothing}
      </div>
    `;
  }

  private _renderStats(): TemplateResult | typeof nothing {
    const n = this._e("sensor", "snooze_count")?.state;
    if (n === undefined) return nothing;
    return html`<div class="chip stat">
      <ha-icon icon="mdi:alarm-snooze"></ha-icon>${n} snooze
    </div>`;
  }

  private _renderFooter(): TemplateResult {
    const num = (suffix: string): string | null => {
      const e = this._e("number", suffix);
      return e ? String(parseInt(e.state)) : null;
    };
    const chauffe = num("pre_chauffage_min");
    const aube = num("aube_min");
    const vol = this._e("number", "volume_final")?.state;
    return html`
      <div class="footer">
        <div class="specs">
          ${vol !== undefined
            ? html`<span
                @click=${() =>
                  this._moreInfo(this._e("number", "volume_final")?.entity_id)}
                ><ha-icon icon="mdi:music"></ha-icon>${Math.round(
                  parseFloat(vol) * 100
                )} %</span>`
            : nothing}
          ${chauffe
            ? html`<span
                @click=${() =>
                  this._moreInfo(
                    this._e("number", "pre_chauffage_min")?.entity_id
                  )}
                ><ha-icon icon="mdi:fire"></ha-icon>−${chauffe} min</span>`
            : nothing}
          ${aube
            ? html`<span
                @click=${() =>
                  this._moreInfo(this._e("number", "aube_min")?.entity_id)}
                ><ha-icon icon="mdi:weather-sunset-up"></ha-icon>${aube}
                min</span>`
            : nothing}
        </div>
        <ha-icon
          class="chev"
          icon="mdi:chevron-right"
          @click=${() => this._moreInfo(this._config.entity)}
        ></ha-icon>
      </div>
    `;
  }

  private _renderRinging(): TemplateResult {
    const snoozeMin = this._e("number", "snooze_min")?.state;
    const escaladeMin = this._e("number", "escalade_min")?.state;
    return html`
      <ha-card class="card ringing">
        <div class="header">
          <div class="id">
            <div class="badge solid">
              <ha-icon icon="mdi:bell-ring"></ha-icon>
            </div>
            <div class="titles">
              <div class="name ring-name">Ça sonne</div>
              <div class="sub">${this._subtitle()}</div>
            </div>
          </div>
        </div>

        <div class="time"><span class="big">${this._heure}</span></div>

        <div class="actions">
          <button class="btn snooze" @click=${() => this._svc("snooze")}>
            <ha-icon icon="mdi:alarm-snooze"></ha-icon>
            <span>Snooze${snoozeMin ? ` ${parseInt(snoozeMin)} min` : ""}</span>
          </button>
          <button class="btn stop" @click=${() => this._svc("stop")}>
            <ha-icon icon="mdi:alarm-off"></ha-icon>
            <span>Stop</span>
          </button>
        </div>

        ${escaladeMin
          ? html`<div class="footer esc">
              <ha-icon icon="mdi:progress-clock"></ha-icon>
              Escalade après ${parseInt(escaladeMin)} min · lumières 100 % +
              volume max
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
      color: var(--error-color);
      font-size: 13px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .id {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .badge.amber {
      background: var(--sw-amber-bg);
      color: var(--sw-amber);
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
    .days {
      display: flex;
      gap: 6px;
      align-items: center;
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
      text-transform: capitalize;
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
    .chip.stat {
      cursor: default;
      margin-left: auto;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--divider-color);
      padding-top: 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .specs {
      display: flex;
      gap: 14px;
    }
    .specs span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
    .specs ha-icon,
    .footer ha-icon {
      --mdc-icon-size: 14px;
    }
    .chev {
      cursor: pointer;
      --mdc-icon-size: 16px;
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
    "Carte réveil pour SmartWAKE : heure, jours, contexte, snooze/stop.",
  preview: true,
});