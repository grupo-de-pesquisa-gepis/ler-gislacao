import { LitElement, css, html } from 'lit'
import { carregarIndice, carregarNorma, divisoesDoSumario } from '../services/dados-service.js'

export class SumarioNormas extends LitElement {
  static properties = {
    _normas: { state: true },
    _erro: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      padding: 4px 0 16px;
    }

    .norma-item {
      margin-bottom: 8px;
    }

    .norma-titulo {
      font-weight: 600;
      display: block;
      padding: 10px 16px;
      color: var(--md-sys-color-primary, #1f3a5f);
      text-decoration: none;
      font-size: 0.95rem;
      border-radius: 8px;
      transition: background 0.15s;
    }

    .norma-titulo:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
    }

    a.divisao {
      display: block;
      padding: 6px 16px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      text-decoration: none;
      font-size: 0.85rem;
      line-height: 1.3;
      border-radius: 6px;
    }

    a.divisao:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
    }

    a.divisao[data-nivel='1'] {
      padding-left: 28px;
    }
    a.divisao[data-nivel='2'] {
      padding-left: 40px;
    }
    a.divisao[data-nivel='3'] {
      padding-left: 52px;
    }

    .rubrica {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 0.8rem;
    }

    .estado {
      padding: 12px 16px;
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  `

  constructor() {
    super()
    this._normas = null
    this._erro = null
  }

  async connectedCallback() {
    super.connectedCallback()
    try {
      const indice = await carregarIndice()
      this._normas = await Promise.all(
        indice.map(async (entrada) => {
          const { estrutura } = await carregarNorma(entrada.caminho)
          return { ...entrada, divisoes: divisoesDoSumario(estrutura) }
        }),
      )
    } catch (erro) {
      this._erro = erro.message
    }
  }

  render() {
    if (this._erro) {
      return html`<p class="estado">Não foi possível carregar o sumário.</p>`
    }
    if (!this._normas) {
      return html`<p class="estado">Carregando sumário…</p>`
    }
    if (this._normas.length === 0) {
      return html`<p class="estado">Nenhuma norma disponível.</p>`
    }

    return html`
      ${this._normas.map(
        (norma) => html`
          <div class="norma-item">
            <a class="norma-titulo" href="#/norma/${norma.caminho}">${norma.nome}</a>
            ${norma.divisoes.map(
              (div) => html`
                <a
                  class="divisao"
                  href="#/norma/${norma.caminho}?ir=${div.ancora}"
                  data-nivel=${div.nivel}
                >
                  ${div.rotulo}${div.rubrica ? html` <span class="rubrica">— ${div.rubrica}</span>` : ''}
                </a>
              `,
            )}
          </div>
        `,
      )}
    `
  }
}

customElements.define('sumario-normas', SumarioNormas)
