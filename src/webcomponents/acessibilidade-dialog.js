import { LitElement, html, css } from 'lit'
import { acessibilidadeService } from '../services/acessibilidade-service.js'

export class AcessibilidadeDialog extends LitElement {
  static properties = {
    aberto: { type: Boolean, reflect: true },
    _prefs: { state: true },
  }

  static styles = css`
    :host {
      display: none;
    }

    :host([aberto]) {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 1000;
    }

    .scrim {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(2px);
    }

    .dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 520px;
      max-height: 85vh;
      overflow-y: auto;
      background: var(--md-sys-color-surface, #fff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      border-radius: 20px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .cabecalho {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h2 {
      margin: 0;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .grupo {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .opcoes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 8px;
    }

    button.opcao {
      padding: 10px 8px;
      border-radius: 10px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      background: var(--md-sys-color-surface, #fff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
    }

    button.opcao:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
    }

    button.opcao[aria-pressed='true'] {
      background: var(--md-sys-color-primary, #1f3a5f);
      color: var(--md-sys-color-on-primary, #fff);
      border-color: var(--md-sys-color-primary, #1f3a5f);
      font-weight: 600;
    }

    .rodape {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .btn-fechar {
      background: var(--md-sys-color-primary, #1f3a5f);
      color: var(--md-sys-color-on-primary, #fff);
      border: none;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-reset {
      background: transparent;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      color: var(--md-sys-color-on-surface, #1d1b20);
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.85rem;
    }
  `

  constructor() {
    super()
    this.aberto = false
    this._prefs = acessibilidadeService.preferencias
  }

  connectedCallback() {
    super.connectedCallback()
    this._ouvinteAbrir = () => {
      this.aberto = true
    }
    window.addEventListener('abrir-acessibilidade', this._ouvinteAbrir)

    this._ouvinte = () => {
      this._prefs = acessibilidadeService.preferencias
    }
    acessibilidadeService.addEventListener('change', this._ouvinte)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this._ouvinteAbrir) {
      window.removeEventListener('abrir-acessibilidade', this._ouvinteAbrir)
    }
    if (this._ouvinte) {
      acessibilidadeService.removeEventListener('change', this._ouvinte)
    }
  }

  fechar() {
    this.aberto = false
    this.dispatchEvent(new CustomEvent('fechar'))
  }

  setFonte(fonte) {
    acessibilidadeService.atualizar({ fonte })
  }

  setEscala(escala) {
    acessibilidadeService.atualizar({ escala })
  }

  setEspacamento(espacamento) {
    acessibilidadeService.atualizar({ espacamento })
  }

  setTema(temaLeitura) {
    acessibilidadeService.atualizar({ temaLeitura })
  }

  resetar() {
    acessibilidadeService.resetar()
  }

  render() {
    if (!this.aberto) return null

    return html`
      <div class="scrim" @click=${this.fechar}></div>
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-titulo">
        <div class="cabecalho">
          <h2 id="dialog-titulo">
            <md-icon>accessibility_new</md-icon>
            Acessibilidade & Leitura
          </h2>
          <button
            class="btn-reset"
            style="border:none; padding:4px;"
            aria-label="Fechar"
            @click=${this.fechar}
          >
            <md-icon>close</md-icon>
          </button>
        </div>

        <div class="grupo">
          <label>Tipografia / Família da Fonte:</label>
          <div class="opcoes-grid">
            <button
              class="opcao"
              aria-pressed=${this._prefs.fonte === 'padrao'}
              @click=${() => this.setFonte('padrao')}
            >
              Padrão
            </button>
            <button
              class="opcao"
              aria-pressed=${this._prefs.fonte === 'atkinson'}
              @click=${() => this.setFonte('atkinson')}
            >
              Atkinson Hyperlegible
            </button>
            <button
              class="opcao"
              aria-pressed=${this._prefs.fonte === 'opendyslexic'}
              @click=${() => this.setFonte('opendyslexic')}
            >
              OpenDyslexic
            </button>
            <button
              class="opcao"
              aria-pressed=${this._prefs.fonte === 'serif'}
              @click=${() => this.setFonte('serif')}
            >
              Serifada
            </button>
          </div>
        </div>

        <div class="grupo">
          <label>Tamanho do Texto:</label>
          <div class="opcoes-grid">
            ${[100, 115, 130, 145].map(
              (tam) => html`
                <button
                  class="opcao"
                  aria-pressed=${this._prefs.escala === tam}
                  @click=${() => this.setEscala(tam)}
                >
                  ${tam}%
                </button>
              `,
            )}
          </div>
        </div>

        <div class="grupo">
          <label>Espaçamento entre Linhas:</label>
          <div class="opcoes-grid">
            <button
              class="opcao"
              aria-pressed=${this._prefs.espacamento === 'normal'}
              @click=${() => this.setEspacamento('normal')}
            >
              Normal (1.6)
            </button>
            <button
              class="opcao"
              aria-pressed=${this._prefs.espacamento === 'amplo'}
              @click=${() => this.setEspacamento('amplo')}
            >
              Amplo (1.9)
            </button>
            <button
              class="opcao"
              aria-pressed=${this._prefs.espacamento === 'extra'}
              @click=${() => this.setEspacamento('extra')}
            >
              Extra (2.3)
            </button>
          </div>
        </div>

        <div class="grupo">
          <label>Contraste e Cores de Fundo:</label>
          <div class="opcoes-grid">
            <button
              class="opcao"
              aria-pressed=${this._prefs.temaLeitura === 'padrao'}
              @click=${() => this.setTema('padrao')}
            >
              Padrão
            </button>
            <button
              class="opcao"
              aria-pressed=${this._prefs.temaLeitura === 'alto-contraste-amarelo'}
              @click=${() => this.setTema('alto-contraste-amarelo')}
              style="background:#000; color:#ffff00;"
            >
              Preto & Amarelo
            </button>
            <button
              class="opcao"
              aria-pressed=${this._prefs.temaLeitura === 'alto-contraste-branco'}
              @click=${() => this.setTema('alto-contraste-branco')}
              style="background:#000; color:#fff;"
            >
              Preto & Branco
            </button>
            <button
              class="opcao"
              aria-pressed=${this._prefs.temaLeitura === 'sepia'}
              @click=${() => this.setTema('sepia')}
              style="background:#fbf0d9; color:#433422;"
            >
              Sépia
            </button>
          </div>
        </div>

        <div class="rodape">
          <button class="btn-reset" @click=${this.resetar}>Restaurar padrões</button>
          <button class="btn-fechar" @click=${this.fechar}>Concluído</button>
        </div>
      </div>
    `
  }
}

customElements.define('acessibilidade-dialog', AcessibilidadeDialog)
