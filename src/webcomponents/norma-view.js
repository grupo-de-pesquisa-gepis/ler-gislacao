import { LitElement, css, html, nothing } from 'lit'
import { carregarNorma, profundidade, versaoVigente, EIXOS_TEMATICOS } from '../services/dados-service.js'
import { estudoService } from '../services/estudo-service.js'
import { acessibilidadeService } from '../services/acessibilidade-service.js'
import {
  CORES_GRIFO,
  COR_TEXTO_GRIFO,
  ancorarGrifo,
  aparar,
  citacaoABNT,
  corGrifo,
  segmentarTexto,
} from '../grifos.js'

export class NormaView extends LitElement {
  static properties = {
    caminho: { type: String },
    ir: { type: String },
    _norma: { state: true },
    _estrutura: { state: true },
    _dispositivos: { state: true },
    _carregando: { state: true },
    _erro: { state: true },
    _filtroTema: { state: true },
    _filtroTexto: { state: true },
    _toast: { state: true },
    _artigoFalando: { state: true },
    _selecaoAtiva: { state: true },
    _grifos: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      max-width: 860px;
      margin: 0 auto;
      padding: 16px 20px 100px;
      font-family: var(--leitura-font-family, inherit);
      font-size: var(--leitura-font-scale, 1rem);
      line-height: var(--leitura-line-height, 1.6);
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .topo-norma {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .breadcrumb {
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .breadcrumb a {
      color: var(--md-sys-color-primary, #1f3a5f);
      text-decoration: none;
    }

    h1 {
      font-size: 1.6rem;
      margin: 0 0 12px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      line-height: 1.25;
    }

    .ementa {
      font-size: 0.95rem;
      font-style: italic;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      padding: 12px 16px;
      border-radius: 12px;
      border-left: 4px solid var(--md-sys-color-primary, #1f3a5f);
      margin: 12px 0;
    }

    .meta-norma {
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }

    .meta-norma a {
      color: var(--md-sys-color-primary, #1f3a5f);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* Barra de filtros e busca */
    .barra-ferramentas {
      position: sticky;
      top: 0;
      z-index: 20;
      background: var(--md-sys-color-surface, #fff);
      padding: 12px 0;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .linha-filtros {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .input-busca {
      flex: 1 1 200px;
      padding: 8px 14px;
      border-radius: 20px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-size: 0.9rem;
      outline: none;
    }

    .input-busca:focus {
      border-color: var(--md-sys-color-primary, #1f3a5f);
    }

    .select-tema {
      padding: 8px 12px;
      border-radius: 20px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      background: var(--md-sys-color-surface, #fff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-size: 0.85rem;
      outline: none;
    }

    /* Player TTS */
    .player-tts {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      border-radius: 12px;
      background: var(--md-sys-color-primary, #1f3a5f);
      color: var(--md-sys-color-on-primary, #fff);
      font-size: 0.85rem;
    }

    .btn-player {
      background: transparent;
      border: none;
      color: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      padding: 2px;
    }

    /* Lista de Artigos */
    .dispositivos-lista {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .disp-card {
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid transparent;
      transition: background 0.15s, border-color 0.15s;
      position: relative;
    }

    .disp-card:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      border-color: var(--md-sys-color-outline-variant, #cac4d0);
    }

    .disp-card.em-destaque {
      border-color: var(--md-sys-color-primary, #1f3a5f);
      background: var(--md-sys-color-surface-variant, #e7e0ec);
    }

    .disp-card.falando {
      border-left: 5px solid var(--md-sys-color-primary, #1f3a5f);
      background: var(--md-sys-color-surface-variant, #e7e0ec);
    }

    .disp-card[data-nivel='1'] {
      margin-left: 20px;
    }
    .disp-card[data-nivel='2'] {
      margin-left: 36px;
    }
    .disp-card[data-nivel='3'] {
      margin-left: 52px;
    }

    .disp-cabecalho {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      gap: 8px;
    }

    .disp-rotulo {
      font-weight: 700;
      color: var(--md-sys-color-primary, #1f3a5f);
      font-size: 0.95rem;
    }

    .disp-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tag-tema {
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 6px;
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-weight: 600;
    }

    .disp-acoes {
      display: flex;
      gap: 4px;
      opacity: 0.6;
      transition: opacity 0.15s;
    }

    .disp-card:hover .disp-acoes {
      opacity: 1;
    }

    .btn-acao {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      padding: 4px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
    }

    .btn-acao:hover {
      background: var(--md-sys-color-surface, #fff);
      color: var(--md-sys-color-primary, #1f3a5f);
    }

    .disp-texto {
      white-space: pre-wrap;
      word-break: break-word;
    }

    .busca-realce {
      background: #ffeb3b;
      color: #000;
      padding: 0 2px;
      border-radius: 2px;
      font-weight: 700;
    }

    .grifo-span {
      padding: 1px 2px;
      border-radius: 3px;
      color: #1c1b1f;
    }

    /* Barra de cores flutuante para grifos */
    .barra-grifo {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--md-sys-color-surface, #fff);
      padding: 8px 14px;
      border-radius: 30px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 100;
    }

    .btn-cor {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #323232;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 200;
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `

  constructor() {
    super()
    this.caminho = ''
    this.ir = ''
    this._norma = null
    this._estrutura = null
    this._dispositivos = null
    this._carregando = true
    this._erro = null
    this._filtroTema = ''
    this._filtroTexto = ''
    this._toast = null
    this._artigoFalando = null
    this._selecaoAtiva = null
    this._grifos = []
  }

  async updated(changedProperties) {
    if (changedProperties.has('caminho')) {
      await this._carregar()
    }
    if (changedProperties.has('ir') && this.ir && this._dispositivos) {
      this._rolarParaAncora(this.ir)
    }
  }

  async _carregar() {
    this._carregando = true
    this._erro = null
    try {
      const dados = await carregarNorma(this.caminho)
      this._norma = dados.norma
      this._estrutura = dados.estrutura
      this._dispositivos = dados.dispositivos
      this._grifos = estudoService.grifosDaNorma(this.caminho)
    } catch (err) {
      this._erro = err.message
    } finally {
      this._carregando = false
    }
  }

  _rolarParaAncora(id) {
    setTimeout(() => {
      const el = this.shadowRoot.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('em-destaque')
        setTimeout(() => el.classList.remove('em-destaque'), 2000)
      }
    }, 100)
  }

  _exibirToast(msg) {
    this._toast = msg
    setTimeout(() => {
      if (this._toast === msg) this._toast = null
    }, 3200)
  }

  _copiarCitacaoABNT(disp) {
    const porId = new Map(this._dispositivos.map((d) => [d.id, d]))
    const ref = citacaoABNT(this._norma, disp, porId)
    navigator.clipboard.writeText(ref)
    this._exibirToast('Citação ABNT NBR 6023 copiada!')
  }

  _ouvirDispositivo(disp) {
    const versao = versaoVigente(disp)
    const textoCompleto = `${disp.rotulo}. ${versao.texto}`
    this._artigoFalando = disp.id

    acessibilidadeService.falar(textoCompleto, {
      onEnd: () => {
        this._artigoFalando = null
      },
      onError: () => {
        this._artigoFalando = null
      },
    })
  }

  _pararVoz() {
    acessibilidadeService.parar()
    this._artigoFalando = null
  }

  _renderTextoComRealces(texto, dispId) {
    const termo = this._filtroTexto.trim().toLowerCase()
    if (!termo) {
      return texto
    }

    const partes = []
    let cursor = 0
    const textoMinusculo = texto.toLowerCase()

    while (cursor < texto.length) {
      const idx = textoMinusculo.indexOf(termo, cursor)
      if (idx === -1) {
        partes.push(texto.slice(cursor))
        break
      }
      if (idx > cursor) {
        partes.push(texto.slice(cursor, idx))
      }
      partes.push(html`<mark class="busca-realce">${texto.slice(idx, idx + termo.length)}</mark>`)
      cursor = idx + termo.length
    }

    return partes
  }

  render() {
    if (this._carregando) return html`<p>Carregando norma jurídica…</p>`
    if (this._erro) return html`<p style="color:red;">Erro ao carregar norma: ${this._erro}</p>`
    if (!this._norma) return null

    const porId = new Map(this._dispositivos.map((d) => [d.id, d]))

    // Aplicação dos filtros
    const termo = this._filtroTexto.trim().toLowerCase()
    const tema = this._filtroTema

    const filtrados = this._dispositivos.filter((d) => {
      if (tema && !(d.temas ?? []).includes(tema)) {
        return false
      }
      if (termo) {
        const texto = versaoVigente(d).texto.toLowerCase()
        const rotulo = d.rotulo.toLowerCase()
        if (!texto.includes(termo) && !rotulo.includes(termo)) {
          return false
        }
      }
      return true
    })

    return html`
      <header class="topo-norma">
        <nav class="breadcrumb" aria-label="Navegação estrutural">
          <a href="#/">Início</a>
          <span>›</span>
          <span>${this._norma.sigla ?? this._norma.nome}</span>
        </nav>

        <h1>${this._norma.nome}</h1>
        ${this._norma.ementa ? html`<div class="ementa">${this._norma.ementa}</div>` : ''}

        <div class="meta-norma">
          <span>Publicação: ${this._norma.dataPublicacao ?? 'Data não informada'}</span>
          ${this._norma.urlFonte
            ? html`
                <a href=${this._norma.urlFonte} target="_blank" rel="noopener">
                  <md-icon style="font-size:1rem;">open_in_new</md-icon>
                  Fonte Oficial (${this._norma.fonte})
                </a>
              `
            : ''}
        </div>
      </header>

      <!-- Barra de ferramentas e busca rápida -->
      <section class="barra-ferramentas" aria-label="Filtros e ferramentas">
        <div class="linha-filtros">
          <input
            type="search"
            class="input-busca"
            placeholder="Buscar termo na norma (ex.: matrícula, atendimento, Libras)..."
            .value=${this._filtroTexto}
            @input=${(e) => (this._filtroTexto = e.target.value)}
          />

          <select
            class="select-tema"
            aria-label="Filtrar por Eixo Temático"
            .value=${this._filtroTema}
            @change=${(e) => (this._filtroTema = e.target.value)}
          >
            <option value="">Todos os eixos temáticos</option>
            ${EIXOS_TEMATICOS.map((e) => html`<option value=${e.id}>${e.rotulo}</option>`)}
          </select>
        </div>

        ${this._artigoFalando
          ? html`
              <div class="player-tts" role="region" aria-label="Leitor de voz em execução">
                <md-icon>volume_up</md-icon>
                <span>Lendo dispositivo em voz alta...</span>
                <button class="btn-player" title="Parar leitura" @click=${this._pararVoz}>
                  <md-icon>stop</md-icon>
                </button>
              </div>
            `
          : ''}
      </section>

      <!-- Lista de Dispositivos -->
      <main class="dispositivos-lista">
        ${filtrados.length === 0
          ? html`<p style="padding: 24px; text-align: center;">Nenhum dispositivo encontrado para os filtros informados.</p>`
          : filtrados.map((disp) => {
              const versao = versaoVigente(disp)
              const nivel = profundidade(disp, porId)
              const estaFalando = this._artigoFalando === disp.id

              return html`
                <article
                  id=${disp.id}
                  class="disp-card ${estaFalando ? 'falando' : ''}"
                  data-nivel=${nivel}
                >
                  <div class="disp-cabecalho">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="disp-rotulo">${disp.rotulo}</span>
                      ${disp.rubrica ? html`<em style="font-size:0.85rem;">— ${disp.rubrica}</em>` : ''}
                    </div>

                    <div class="disp-acoes">
                      <button
                        class="btn-acao"
                        title="Ouvir este artigo em voz alta"
                        aria-label="Ouvir em voz alta"
                        @click=${() => this._ouvirDispositivo(disp)}
                      >
                        <md-icon style="font-size:1.15rem;">volume_up</md-icon>
                      </button>

                      <button
                        class="btn-acao"
                        title="Copiar referência formatada ABNT NBR 6023"
                        aria-label="Copiar citação ABNT"
                        @click=${() => this._copiarCitacaoABNT(disp)}
                      >
                        <md-icon style="font-size:1.15rem;">format_quote</md-icon>
                      </button>

                      <a
                        class="btn-acao"
                        title="Link direto para este dispositivo"
                        href="#/norma/${this.caminho}?ir=${disp.id}"
                      >
                        <md-icon style="font-size:1.15rem;">link</md-icon>
                      </a>
                    </div>
                  </div>

                  <div class="disp-texto">${this._renderTextoComRealces(versao.texto, disp.id)}</div>

                  ${(disp.temas ?? []).length > 0
                    ? html`
                        <div class="disp-tags" style="margin-top: 8px;">
                          ${disp.temas.map((t) => html`<span class="tag-tema">${t}</span>`)}
                        </div>
                      `
                    : ''}
                </article>
              `
            })}
      </main>

      ${this._toast ? html`<div class="toast" role="status">${this._toast}</div>` : nothing}
    `
  }
}

customElements.define('norma-view', NormaView)
