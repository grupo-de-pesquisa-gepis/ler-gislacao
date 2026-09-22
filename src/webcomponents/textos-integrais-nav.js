import { LitElement, html, css } from 'lit'
import { carregarIndice } from '../services/dados-service.js'

export class TextosIntegraisNav extends LitElement {
  static properties = {
    _categorias: { state: true },
    _erro: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      padding: 4px 0 8px;
    }

    .categoria-bloco {
      margin-bottom: 4px;
    }

    .categoria-titulo {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px 4px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--md-sys-color-primary, #1f3a5f);
    }

    a.item-norma {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px 8px 24px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      text-decoration: none;
      font-size: 0.88rem;
      line-height: 1.3;
      border-radius: 6px;
      transition: background 0.15s;
    }

    a.item-norma:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
    }

    .sigla-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      white-space: nowrap;
    }

    .estado {
      padding: 12px 16px;
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  `

  constructor() {
    super()
    this._categorias = null
    this._erro = null
  }

  async connectedCallback() {
    super.connectedCallback()
    try {
      const indice = await carregarIndice()
      // Agrupa por categoria preservando a ordem oficial
      const mapa = new Map()
      const ordemCategorias = [
        'Constituição Federal',
        'Leis Federais',
        'Decretos Presidenciais',
        'Resoluções CNE/MEC',
      ]

      for (const cat of ordemCategorias) {
        mapa.set(cat, [])
      }

      for (const norma of indice) {
        const cat = norma.categoria || 'Outras Normas'
        if (!mapa.has(cat)) mapa.set(cat, [])
        mapa.get(cat).push(norma)
      }

      this._categorias = Array.from(mapa.entries())
        .filter(([_, normas]) => normas.length > 0)
        .map(([categoria, normas]) => ({ categoria, normas }))
    } catch (e) {
      this._erro = e.message
    }
  }

  _iconePorCategoria(categoria) {
    switch (categoria) {
      case 'Constituição Federal':
        return 'gavel'
      case 'Leis Federais':
        return 'description'
      case 'Decretos Presidenciais':
        return 'account_balance'
      case 'Resoluções CNE/MEC':
        return 'article'
      default:
        return 'menu_book'
    }
  }

  render() {
    if (this._erro) {
      return html`<p class="estado">Não foi possível carregar os textos integrais.</p>`
    }
    if (!this._categorias) {
      return html`<p class="estado">Carregando textos integrais…</p>`
    }

    return html`
      ${this._categorias.map(
        ({ categoria, normas }) => html`
          <div class="categoria-bloco">
            <div class="categoria-titulo">
              <md-icon style="font-size: 1.05rem;">${this._iconePorCategoria(categoria)}</md-icon>
              <span>${categoria}</span>
            </div>
            ${normas.map(
              (norma) => html`
                <a
                  class="item-norma"
                  href="#/norma/${norma.caminho}"
                  title="Abrir texto integral de: ${norma.nome}"
                >
                  <span class="sigla-badge">${norma.sigla ?? norma.ano}</span>
                  <span>${norma.nome}</span>
                </a>
              `,
            )}
          </div>
        `,
      )}
    `
  }
}

customElements.define('textos-integrais-nav', TextosIntegraisNav)
