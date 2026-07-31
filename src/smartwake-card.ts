import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface LovelaceCard {
  hass: any;
  config: any;
}

interface SmartWAKEConfig {
  entity: string;
  name?: string;
  show_stats?: boolean;
  show_context?: boolean;
  show_settings?: boolean;
}

const JOURS_LABELS = ["L", "Ma", "Me", "J", "V", "S", "D"];
const JOURS_MODES: Record<string, number[]> = {
  tous: [0, 1, 2, 3, 4, 5, 6],
  semaine: [0, 1, 2, 3, 4],
  weekend: [5, 6],
  lundi: [0],
  mardi: [1],
  mercredi: [2],
  jeudi: [3],
  vendredi: [4],
  samedi: [5],
  dimanche: [6],
};

const STATUT_LABELS: Record<string, string> = {
  idle: "💤 En attente",
  prewake: "🌅 Pré-réveil",
  ringing: "🔔 Sonnerie",
  snoozed: "😴 Snooze",
  done: "✅ Terminé",
  inactif: "⏹️ Inactif",
};

@customElement("smartwake-card")
export class SmartWAKECard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) hass: any;
  @state() private _config!: SmartWAKEConfig;

  static getStubConfig(): SmartWAKEConfig {
    return { entity: "switch.reveil_actif", show_stats: true, show_context: true };
  }

  setConfig(config: SmartWAKEConfig) {
    if (!config.entity) {
      throw new Error("entity est requis");
    }
    this._config = config;
  }

  getCardSize() {
    return 4;
  }

  private _getEntityBase(): string {
    const entity = this._config.entity;
    return entity.replace("switch.", "").replace("_actif", "");
  }

  private _state(entity: string): any {
    return this.hass?.states[entity]?.state;
  }

  private _attr(entity: string, key: string): any {
    return this.hass?.states[entity]?.attributes?.[key];
  }

  private _isActive(): boolean {
    return this._state(this._config.entity) === "on";
  }

  private _getJours(): number[] {
    const base = this._getEntityBase();
    const jours = this._state(`select.${base}_jours`) || "semaine";
    return JOURS_MODES[jours] || [0, 1, 2, 3, 4];
  }

  private _getHeure(): string {
    const base = this._getEntityBase();
    return (this._state(`time.${base}_heure`) || "07:00").slice(0, 5);
  }

  private _getStatut(): string {
    const base = this._getEntityBase();
    return this._state(`sensor.${base}_statut`) || "inactif";
  }

  private _getProchain(): string | null {
    const base = this._getEntityBase();
    const val = this._state(`sensor.${base}_prochain_reveil`);
    if (!val || val === "unknown" || val === "unavailable") return null;
    try {
      const d = new Date(val);
      return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) +
        " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return null;
    }
  }

  private _toggle() {
    this.hass.callService("switch", "toggle", { entity_id: this._config.entity });
  }

  private _callService(service: string) {
    const base = this._getEntityBase();
    this.hass.callService("smartwake", service, { entity_id: `switch.${base}_actif` });
  }

  private _isOn(entity: string): boolean {
    return this._state(entity) === "on";
  }

  static styles = css`
    :host {
      display: block;
    }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .header-icon {
      --mdc-icon-size: 40px;
      color: var(--state-active-color, #f5a623);
    }
    .header-icon.inactive {
      color: var(--disabled-text-color, #999);
    }
    .header-text {
      flex: 1;
    }
    .header-time {
      font-size: 2em;
      font-weight: 700;
      line-height: 1.1;
    }
    .header-status {
      font-size: 0.85em;
      opacity: 0.7;
    }
    .toggle {
      cursor: pointer;
    }
    .chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 0.8em;
      font-weight: 600;
      background: var(--chip-background-color, #f0f0f0);
    }
    .chip.on {
      background: var(--primary-color, #03a9f4);
      color: white;
    }
    .chip.context {
      font-size: 0.75em;
      opacity: 0.85;
    }
    .chip.context.on {
      background: var(--success-color, #4caf50);
    }
    .buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      border-radius: 12px;
      cursor: pointer;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #eee);
      font-size: 0.8em;
      font-weight: 600;
      transition: all 0.15s;
    }
    .btn:hover {
      background: var(--primary-color, #03a9f4);
      color: white;
    }
    .btn ha-icon {
      --mdc-icon-size: 24px;
    }
    .btn.danger:hover {
      background: var(--error-color, #f44336);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 8px;
    }
    .stat {
      text-align: center;
      padding: 8px;
      border-radius: 8px;
      background: var(--chip-background-color, #f5f5f5);
    }
    .stat-value {
      font-size: 1.5em;
      font-weight: 700;
    }
    .stat-label {
      font-size: 0.7em;
      opacity: 0.6;
      text-transform: uppercase;
    }
    .section-title {
      font-size: 0.75em;
      font-weight: 700;
      text-transform: uppercase;
      opacity: 0.5;
      margin-bottom: -4px;
    }
    .next-alarm {
      font-size: 0.85em;
      opacity: 0.7;
      text-align: center;
    }
  `;

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const base = this._getEntityBase();
    const active = this._isActive();
    const heure = this._getHeure();
    const statut = this._getStatut();
    const prochain = this._getProchain();
    const jours = this._getJours();

    return html`
      <ha-card class="card">
        <!-- En-tête -->
        <div class="header" @click=${() => this._toggle()}>
          <ha-icon
            class="header-icon ${active ? '' : 'inactive'}"
            icon=${active ? "mdi:alarm" : "mdi:alarm-off"}
          ></ha-icon>
          <div class="header-text">
            <div class="header-time">${heure}</div>
            <div class="header-status">
              ${this._config.name || "SmartWAKE"} — ${STATUT_LABELS[statut] || statut}
            </div>
          </div>
          <ha-switch
            class="toggle"
            .checked=${active}
            @click=${(e: Event) => { e.stopPropagation(); this._toggle(); }}
          ></ha-switch>
        </div>

        ${prochain ? html`<div class="next-alarm">⏰ Prochain : ${prochain}</div>` : nothing}

        <!-- Jours -->
        <div class="section-title">Jours</div>
        <div class="chips">
          ${JOURS_LABELS.map((label, i) => html`
            <span class="chip ${jours.includes(i) ? "on" : ""}">${label}</span>
          `)}
        </div>

        ${this._config.show_context ? html`
          <!-- Contexte -->
          <div class="section-title">Contexte</div>
          <div class="chips">
            <span class="chip context ${this._isOn(`binary_sensor.${base}_sonne_aujourd_hui`) ? "on" : ""}">
              ${this._isOn(`binary_sensor.${base}_sonne_aujourd_hui`) ? "✅ Sonne aujourd'hui" : "💤 Inactif"}
            </span>
            ${this._isOn(`binary_sensor.${base}_weekend`) ? html`<span class="chip context on">🏖️ Weekend</span>` : nothing}
            ${this._isOn(`binary_sensor.${base}_jour_ferie`) ? html`<span class="chip context on">🎉 Férié</span>` : nothing}
            ${this._isOn(`binary_sensor.${base}_vacances_scolaires`) ? html`<span class="chip context on">🏫 Vacances sco</span>` : nothing}
          </div>
        ` : nothing}

        <!-- Boutons d'action -->
        <div class="buttons">
          <div class="btn" @click=${() => this._callService("snooze")}>
            <ha-icon icon="mdi:alarm-snooze"></ha-icon>
            Snooze
          </div>
          <div class="btn danger" @click=${() => this._callService("stop")}>
            <ha-icon icon="mdi:alarm-off"></ha-icon>
            Stop
          </div>
          <div class="btn" @click=${() => this._callService("sauter_prochain")}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
            Skip
          </div>
          <div class="btn" @click=${() => this._callService("declencher")}>
            <ha-icon icon="mdi:bell-ring"></ha-icon>
            Test
          </div>
        </div>

        ${this._config.show_stats ? html`
          <!-- Statistiques -->
          <div class="section-title">Statistiques</div>
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${this._state(`sensor.${base}_total_declenchements`) || 0}</div>
              <div class="stat-label">Déclenchements</div>
            </div>
            <div class="stat">
              <div class="stat-value">${this._state(`sensor.${base}_total_snoozes`) || 0}</div>
              <div class="stat-label">Snoozes</div>
            </div>
            <div class="stat">
              <div class="stat-value">${this._state(`sensor.${base}_total_stops`) || 0}</div>
              <div class="stat-label">Stops</div>
            </div>
          </div>
        ` : nothing}
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "smartwake-card": SmartWAKECard;
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "smartwake-card",
  name: "SmartWAKE Card",
  description: "Carte de réveil progressif pour l'intégration SmartWAKE",
  preview: true,
});