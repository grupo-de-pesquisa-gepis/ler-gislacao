import { LitElement, html, css } from 'lit'
import { estudoService } from '../services/estudo-service.js'
import { CORES_GRIFO, corGrifo } from '../grifos.js'

export class GrifosView extends LitElement {
  static properties = {
    _grifos: { state: true },
    _filtroCor: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 20px 80px;
      font-family: var(--leitura-font-family, inherit);
    }

    h1 {
      margin: 0 0 8px;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .subtitulo {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      margin: 0 0 24px;
      font-size: 0.95rem;
    }

    .barra-acoes {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .filtro-cores {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .chip-cor {
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      background: var(--md-sys-color-surface, #fff);
      font-size: 0.8rem;
      cursor: pointer;
    }

    .chip-cor[aria-pressed='true'] {
      background: var(--md-sys-color-primary, #1f3a5f);
      color: var(--md-sys-color-on-primary, #fff);
    }

    .btn-exportar {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 20px;
      background: var(--md-sys-color-primary, #1f3a5f);
      color: var(--md-sys-color-on-primary, #fff);
      border: none;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.85rem;
    }

    .grifo-card {
      padding: 16px;
      border-radius: 12px;
      background: var(--md-sys-color-surface, #fff);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .grifo-topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    .grifo-cor-tag {
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .grifo-texto {
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .grifo-nota {
      font-size: 0.9rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      padding: 8px 12px;
      border-radius: 8px;
      border-left: 3px solid var(--md-sys-color-primary, #1f3a5f);
    }

    .vazio {
      text-align: center;
      padding: 48px 16px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  `

  constructor() {
    super()
    this._grifos = []
    this._filtroCor = ''
  }

  connectedCallback() {
    super.connectedCallback()
    this._carregar()
  }

  _carregar() {
    this._grifos = estudoService.listarGrifos()
  }

  _remover(grupoId) {
    if (confirm('Deseja realmente remover este destaque?')) {
      estudoService.removerGrupo(grupoId)
      this._carregar()
    }
  }

  _exportarMarkdown() {
    if (this._grifos.length === 0) return

    let md = `# Meus Grifos e Notas Pedagógicas - Ler-gislação\n\n`
    md += `*Exportado em: ${new Date().toLocaleDateString('pt-BR')}*\n\n`

    for (const g of this._grifos) {
      const cor = corGrifo(g.cor)
      md += `### ${g.norma}\n`
      md += `> "${g.texto}"\n\n`
      if (g.nota) {
        md += `**Anotação:** ${g.nota}\n\n`
      }
      md += `---\n\n`
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meus-grifos-ler-gislacao-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  render() {
    const filtrados = this._filtroCor
      ? this._grifos.filter((g) => g.cor === this._filtroCor)
      : this._grifos

    return html`
      <h1>Meus Grifos e Anotações</h1>
      <p class="subtitulo">
        Trechos destacados e notas pedagógicas salvas durante o seu estudo (armazenados localmente no
        seu navegador).
      </p>

      <div class="barra-acoes">
        <div class="filtro-cores">
          <button
            class="chip-cor"
            aria-pressed=${this._filtroCor === ''}
            @click=${() => (this._filtroCor = '')}
          >
            Todas as cores
          </button>
          ${CORES_GRIFO.map(
            (c) => html`
              <button
                class="chip-cor"
                aria-pressed=${this._filtroCor === c.id}
                @click=${() => (this._filtroCor = c.id)}
              >
                ${c.nome}
              </button>
            `,
          )}
        </div>

        ${this._grifos.length > 0
          ? html`
              <button class="btn-exportar" @click=${this._exportarMarkdown}>
                <md-icon style="font-size:1.1rem;">download</md-icon>
                Exportar para Markdown
              </button>
            `
          : ''}
      </div>

      ${filtrados.length === 0
        ? html`
            <div class="vazio">
              <md-icon style="font-size:3rem; opacity:0.4;">format_ink_highlighter</md-icon>
              <p>Você ainda não possui grifos salvos nesta categoria.</p>
              <p style="font-size:0.85rem;">
                Ao ler uma norma, selecione qualquer trecho para grifá-lo ou adicionar anotações pedagógicas.
              </p>
            </div>
          `
        : html`
            <div class="lista-grifos">
              ${filtrados.map((g) => {
                const cor = corGrifo(g.cor)
                return html`
                  <div class="grifo-card">
                    <div class="grifo-topo">
                      <span
                        class="grifo-cor-tag"
                        style="background: ${cor.fundo}; color: #000;"
                      >
                        ${cor.rotuloPadrao}
                      </span>
                      <button
                        style="background:transparent; border:none; cursor:pointer; color:red;"
                        title="Remover grifo"
                        @click=${() => this._remover(g.grupoId)}
                      >
                        <md-icon style="font-size:1.1rem;">delete</md-icon>
                      </button>
                    </div>

                    <div
                      class="grifo-texto"
                      style="background: ${cor.fundo}; color: #000;"
                    >
                      "${g.texto}"
                    </div>

                    ${g.nota ? html`<div class="grifo-nota">${g.nota}</div>` : ''}
                  </div>
                `
              })}
            </div>
          `}
    `
  }
}

customElements.define('grifos-view', GrifosView)
