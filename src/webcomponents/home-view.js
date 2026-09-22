import { LitElement, html, css } from 'lit'
import { carregarIndice, EIXOS_TEMATICOS } from '../services/dados-service.js'

export class HomeView extends LitElement {
  static properties = {
    _normas: { state: true },
    _carregando: { state: true },
    _erro: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 20px 80px;
      font-family: var(--leitura-font-family, inherit);
    }

    .hero {
      text-align: center;
      padding: 36px 20px;
      margin-bottom: 32px;
      background: linear-gradient(
        135deg,
        var(--md-sys-color-surface-variant, #e7e0ec) 0%,
        var(--md-sys-color-surface, #fff) 100%
      );
      border-radius: 20px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .hero-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .hero-logo-link {
      display: inline-block;
      transition: transform 0.2s ease;
      border-radius: 50%;
    }

    .hero-logo-link:hover {
      transform: scale(1.06);
    }

    .hero-logo {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background: #ffffff;
      padding: 3px;
      border: 2px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .hero-badge {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 4px 14px;
      border-radius: 999px;
      background: var(--md-sys-color-primary, #1f3a5f);
      color: var(--md-sys-color-on-primary, #ffffff);
    }

    .hero-org-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 18px;
    }

    .hero-org-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      background: var(--md-sys-color-surface, #fff);
      color: var(--md-sys-color-primary, #1f3a5f);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .hero-org-pill:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      border-color: var(--md-sys-color-primary, #1f3a5f);
    }

    h1 {
      margin: 8px 0 12px;
      font-size: clamp(1.8rem, 4vw, 2.4rem);
      color: var(--md-sys-color-on-surface, #1d1b20);
      line-height: 1.2;
    }

    .subtitulo {
      font-size: 1.1rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.5;
    }

    .secao-titulo {
      font-size: 1.3rem;
      margin: 36px 0 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .eixos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 32px;
    }

    .eixo-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: var(--md-sys-color-surface, #fff);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      border-radius: 12px;
      text-decoration: none;
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .eixo-card:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      border-color: var(--md-sys-color-primary, #1f3a5f);
      transform: translateY(-2px);
    }

    .normas-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .norma-card {
      padding: 20px;
      border-radius: 16px;
      background: var(--md-sys-color-surface, #fff);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: border-color 0.2s;
    }

    .norma-card:hover {
      border-color: var(--md-sys-color-primary, #1f3a5f);
    }

    .norma-topo {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .norma-nome {
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface, #1d1b20);
      margin: 0;
      text-decoration: none;
    }

    .norma-nome:hover {
      color: var(--md-sys-color-primary, #1f3a5f);
    }

    .norma-sigla {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      white-space: nowrap;
    }

    .norma-ementa {
      font-size: 0.9rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      line-height: 1.5;
      margin: 0;
    }

    .norma-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .tag {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .norma-acoes {
      margin-top: 12px;
      display: flex;
      justify-content: flex-end;
    }

    .btn-ler {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 20px;
      background: var(--md-sys-color-primary, #1f3a5f);
      color: var(--md-sys-color-on-primary, #fff);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .btn-ler:hover {
      opacity: 0.92;
    }

    .info-box {
      margin-top: 40px;
      padding: 16px 20px;
      border-radius: 12px;
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 0.9rem;
      line-height: 1.5;
    }
  `

  constructor() {
    super()
    this._normas = []
    this._carregando = true
    this._erro = null
  }

  async connectedCallback() {
    super.connectedCallback()
    try {
      this._normas = await carregarIndice()
    } catch (err) {
      this._erro = err.message
    } finally {
      this._carregando = false
    }
  }

  render() {
    return html`
      <div class="hero">
        <div class="hero-brand">
          <a
            href="https://github.com/grupo-de-pesquisa-gepis"
            target="_blank"
            rel="noopener noreferrer"
            title="Grupo de Pesquisa - GEPIS no GitHub"
            class="hero-logo-link"
          >
            <img src="./gepis-logo.png" alt="Logotipo do Grupo de Pesquisa GEPIS" class="hero-logo" />
          </a>
          <span class="hero-badge">GEPIS • Grupo de Estudo e Pesquisa sobre Inclusão Social</span>
        </div>
        <h1>Ler-gislação</h1>
        <p class="subtitulo">
          Ambiente de leitura, estudo comparativo e referência das normas e marcos legais da
          <strong>Educação Especial e Inclusiva</strong> no Brasil.
        </p>
        <div class="hero-org-bar">
          <a
            href="https://github.com/grupo-de-pesquisa-gepis"
            target="_blank"
            rel="noopener noreferrer"
            class="hero-org-pill"
          >
            <md-icon style="font-size: 1.1rem;">groups</md-icon>
            github.com/grupo-de-pesquisa-gepis
          </a>
          <a
            href="https://github.com/grupo-de-pesquisa-gepis/ler-gislacao"
            target="_blank"
            rel="noopener noreferrer"
            class="hero-org-pill"
          >
            <md-icon style="font-size: 1.1rem;">code</md-icon>
            Repositório Aberto
          </a>
        </div>
      </div>

      <h2 class="secao-titulo">
        <md-icon>category</md-icon>
        Eixos Temáticos
      </h2>
      <div class="eixos-grid" role="list">
        ${EIXOS_TEMATICOS.map(
          (eixo) => html`
            <div class="eixo-card" role="listitem">
              <md-icon>${eixo.icon}</md-icon>
              <span>${eixo.rotulo}</span>
            </div>
          `,
        )}
      </div>

      <h2 class="secao-titulo">
        <md-icon>menu_book</md-icon>
        Acervo Legislativo da Educação Inclusiva
      </h2>

      ${this._carregando
        ? html`<p>Carregando acervo legislativo…</p>`
        : this._erro
          ? html`<p style="color: red;">Erro ao carregar acervo: ${this._erro}</p>`
          : html`
              <div class="normas-grid">
                ${this._normas.map(
                  (norma) => html`
                    <article class="norma-card">
                      <div class="norma-topo">
                        <a class="norma-nome" href="#/norma/${norma.caminho}">${norma.nome}</a>
                        <span class="norma-sigla">${norma.sigla ?? norma.ano}</span>
                      </div>
                      ${norma.ementa ? html`<p class="norma-ementa">${norma.ementa}</p>` : ''}
                      <div class="norma-tags">
                        ${(norma.temas ?? []).map((t) => html`<span class="tag">${t}</span>`)}
                      </div>
                      <div class="norma-acoes">
                        <a class="btn-ler" href="#/norma/${norma.caminho}">
                          <md-icon style="font-size: 1.1rem;">arrow_forward</md-icon>
                          Ler norma
                        </a>
                      </div>
                    </article>
                  `,
                )}
              </div>
            `}

      <div class="info-box">
        <strong>Acessibilidade & Design Universal:</strong> Este aplicativo é desenvolvido em
        conformidade com as diretrizes da <strong>WCAG 2.2</strong> e <strong>eMAG</strong>,
        disponibilizando leitor de voz nativo (TTS), suporte a Libras, temas de alto contraste e fontes
        otimizadas para dislexia.
      </div>
    `
  }
}

customElements.define('home-view', HomeView)
