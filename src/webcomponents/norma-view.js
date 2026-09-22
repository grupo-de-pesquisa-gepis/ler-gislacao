import { LitElement, css, html, nothing } from 'lit'
import {
  carregarNorma,
  profundidade,
  versaoVigente,
  EIXOS_TEMATICOS,
} from '../services/dados-service.js'
import { estudoService } from '../services/estudo-service.js'
import { acessibilidadeService } from '../services/acessibilidade-service.js'
import {
  CORES_GRIFO,
  ancorarGrifo,
  aparar,
  citacaoABNT,
  corGrifo,
  segmentarTexto,
} from '../grifos.js'

const ESPERA_SELECAO_MS = 120
const FOLGA_BARRA = 16
const DESTAQUE_ANCORA_MS = 1600
const RESUMO_NOTA = 80

const ICONE_NOTA = html`<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path
  fill="currentColor"
  d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10l6-6V5a2 2 0 0 0-2-2zM7 8h10v2H7V8zm5 6H7v-2h5v2zm2 5.5V14h5.5L14 19.5z"
/></svg>`

function resumir(texto, limite) {
  const corrido = texto.replace(/\s+/g, ' ')
  return corrido.length > limite ? `${corrido.slice(0, limite - 1)}…` : corrido
}

function ancestralRolavel(el) {
  let no = el.parentNode ?? el.host
  while (no) {
    if (no.nodeType === Node.ELEMENT_NODE) {
      const overflow = getComputedStyle(no).overflowY
      if (/(auto|scroll)/.test(overflow) && no.scrollHeight > no.clientHeight) return no
    }
    no = no.parentNode ?? no.host
  }
  return null
}

function posicaoEm(raiz, no, offset) {
  const range = document.createRange()
  range.selectNodeContents(raiz)
  try {
    range.setEnd(no, offset)
  } catch {
    return null
  }
  return range.toString().length
}

function recortarNoDispositivo(range, el) {
  const recorte = document.createRange()
  recorte.selectNodeContents(el)
  if (recorte.compareBoundaryPoints(Range.START_TO_START, range) < 0) {
    recorte.setStart(range.startContainer, range.startOffset)
  }
  if (recorte.compareBoundaryPoints(Range.END_TO_END, range) > 0) {
    recorte.setEnd(range.endContainer, range.endOffset)
  }
  const inicio = posicaoEm(el, recorte.startContainer, recorte.startOffset)
  const fim = posicaoEm(el, recorte.endContainer, recorte.endOffset)
  if (inicio === null || fim === null) return null

  const texto = el.textContent
  const posicoes = aparar(texto, inicio, fim)
  if (!posicoes) return null
  return {
    dispositivo: el.dataset.disp,
    vigenteDesde: el.dataset.vigenteDesde,
    inicio: posicoes.inicio,
    fim: posicoes.fim,
    texto: texto.slice(posicoes.inicio, posicoes.fim),
  }
}

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
    _selecao: { state: true },
    _editando: { state: true },
    _notaAberta: { state: true },
    _grifos: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      max-width: 860px;
      margin: 0 auto;
      padding: 16px 20px 120px;
      font-family: var(--leitura-font-family, inherit);
      font-size: var(--leitura-font-scale, 1rem);
      line-height: var(--leitura-line-height, 1.6);
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    :host([data-barra-aberta]) {
      padding-bottom: 220px;
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

    /* Divisões estruturais (Parte, Título, Capítulo, Seção) */
    .divisao {
      margin: 28px 0 12px;
      text-align: center;
    }

    .divisao .rotulo {
      font-weight: 700;
      letter-spacing: 0.04em;
      color: var(--md-sys-color-primary, #1f3a5f);
    }

    .divisao[data-tipo='parte'] .rotulo {
      font-size: 1.2rem;
    }

    .divisao[data-tipo='titulo'] .rotulo {
      font-size: 1.1rem;
    }

    .divisao[data-tipo='capitulo'] .rotulo {
      font-size: 1.05rem;
    }

    .divisao .rubrica {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 0.9rem;
      margin-top: 2px;
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
      scroll-margin-top: 80px;
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

    mark.grifo-mark {
      border-radius: 3px;
      padding: 1px 2px;
      cursor: pointer;
      color: #1c1b1f;
    }

    .marca-nota {
      display: inline-flex;
      align-items: center;
      vertical-align: super;
      margin: 0 2px;
      padding: 1px 3px;
      border: 0;
      border-radius: 4px;
      font-size: 0.82em;
      line-height: 1;
      cursor: pointer;
      color: #1c1b1f;
    }

    /* Barra flutuante de grifos e anotações */
    .barra-grifo {
      position: fixed;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      z-index: 100;
      box-sizing: border-box;
      width: min(100%, 48rem);
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px 16px;
      padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
      background: var(--md-sys-color-surface, #fff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      border-top: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
      border-radius: 16px 16px 0 0;
    }

    .linha-barra {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cores-lista {
      display: flex;
      flex: 1;
      gap: 6px;
      overflow-x: auto;
    }

    .btn-cor-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      flex: 0 0 auto;
      width: 76px;
      padding: 4px 0;
      border: 0;
      border-radius: 8px;
      background: none;
      color: inherit;
      font: inherit;
      font-size: 0.68rem;
      line-height: 1.2;
      text-align: center;
      cursor: pointer;
    }

    .btn-cor-item:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
    }

    .amostra-circulo {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
    }

    .btn-cor-item[aria-pressed='true'] .amostra-circulo {
      outline: 3px solid var(--md-sys-color-primary, #1f3a5f);
      outline-offset: 2px;
    }

    .nota-painel {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .nota-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      background: var(--md-sys-color-surface, #fff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: inherit;
      font-size: 0.9rem;
      resize: vertical;
    }

    .nota-acoes {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .btn-nota-salvar {
      background: var(--md-sys-color-primary, #1f3a5f);
      color: var(--md-sys-color-on-primary, #fff);
      border: none;
      border-radius: 16px;
      padding: 6px 16px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .btn-nota-cancelar {
      background: transparent;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      color: var(--md-sys-color-on-surface, #1d1b20);
      border-radius: 16px;
      padding: 6px 14px;
      font-size: 0.85rem;
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
    this._selecao = null
    this._editando = null
    this._notaAberta = false
    this._grifos = []

    this._aoMudarSelecao = () => {
      clearTimeout(this._timerSelecao)
      this._timerSelecao = setTimeout(() => this._acompanharSelecao(), ESPERA_SELECAO_MS)
    }

    this._aoTocarDocumento = (evento) => {
      if (!this._editando) return
      const barra = this.renderRoot.querySelector('.barra-grifo')
      if (barra && evento.composedPath().includes(barra)) return
      this._fecharEdicao()
    }
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('selectionchange', this._aoMudarSelecao)
    document.addEventListener('pointerdown', this._aoTocarDocumento, true)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('selectionchange', this._aoMudarSelecao)
    document.removeEventListener('pointerdown', this._aoTocarDocumento, true)
    clearTimeout(this._timerSelecao)
    clearTimeout(this._timerDestaque)
    acessibilidadeService.parar()
  }

  updated() {
    this.toggleAttribute('data-barra-aberta', this._barraAberta)
  }

  async willUpdate(changed) {
    if (changed.has('caminho') && this.caminho) {
      await this._carregar(this.caminho)
    } else if (changed.has('ir') && this.ir && this._dispositivos) {
      this.updateComplete.then(() => this._rolarParaAncora(this.ir))
    }
  }

  async _carregar(caminho) {
    this._carregando = true
    this._erro = null
    this._selecao = null
    this._fecharEdicao()
    try {
      const dados = await carregarNorma(caminho)
      if (this.caminho !== caminho) return
      this._norma = dados.norma
      this._estrutura = dados.estrutura
      this._dispositivos = dados.dispositivos
      this._porId = new Map(dados.dispositivos.map((d) => [d.id, d]))
      this._ordem = new Map(dados.dispositivos.map((d, i) => [d.id, i]))
      this._divisoesPorArtigo = this._mapearDivisoesPorArtigo(dados.estrutura)
      this._grifos = estudoService.grifosDaNorma(caminho)
      await this.updateComplete
      if (this.ir) this._rolarParaAncora(this.ir)
    } catch (err) {
      if (this.caminho !== caminho) return
      this._erro = err.message
    } finally {
      this._carregando = false
    }
  }

  _mapearDivisoesPorArtigo(estrutura) {
    const mapa = new Map()
    const primeiroArtigo = (no) => {
      if (no.tipo === 'artigo') return no.id
      for (const filho of no.filhos ?? []) {
        const id = primeiroArtigo(filho)
        if (id) return id
      }
      return null
    }

    const visitar = (nos) => {
      for (const no of nos) {
        if (no.tipo === 'artigo') continue
        const ancora = primeiroArtigo(no)
        if (ancora) {
          if (!mapa.has(ancora)) mapa.set(ancora, [])
          mapa.get(ancora).push(no)
        }
        visitar(no.filhos ?? [])
      }
    }

    visitar(estrutura)
    return mapa
  }

  _rolarParaAncora(id) {
    setTimeout(() => {
      const el = this.shadowRoot.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('em-destaque')
        setTimeout(() => el.classList.remove('em-destaque'), DESTAQUE_ANCORA_MS)
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

  // --- Seleção de trechos e Grifos ---

  _rangeSelecionado() {
    const raiz = this.renderRoot
    if (raiz.getSelection) {
      const sel = raiz.getSelection()
      return sel && !sel.isCollapsed && sel.rangeCount ? sel.getRangeAt(0) : null
    }
    const sel = document.getSelection()
    if (!sel || !sel.rangeCount) return null
    if (sel.getComposedRanges) {
      let ranges
      try {
        ranges = sel.getComposedRanges({ shadowRoots: [raiz] })
      } catch {
        ranges = sel.getComposedRanges(raiz)
      }
      const estatico = ranges[0]
      if (!estatico || estatico.collapsed) return null
      const range = document.createRange()
      range.setStart(estatico.startContainer, estatico.startOffset)
      range.setEnd(estatico.endContainer, estatico.endOffset)
      return range
    }
    return sel.isCollapsed ? null : sel.getRangeAt(0)
  }

  _pedacosSelecionados() {
    const range = this._rangeSelecionado()
    if (!range) return null
    const pedacos = []
    for (const el of this.renderRoot.querySelectorAll('.texto-disp')) {
      if (!range.intersectsNode(el)) continue
      const pedaco = recortarNoDispositivo(range, el)
      if (pedaco) pedacos.push(pedaco)
    }
    return pedacos.length ? pedacos : null
  }

  get _barraAberta() {
    return Boolean(this._selecao || this._editando)
  }

  _acompanharSelecao() {
    if (this._carregando) return
    const pedacos = this._pedacosSelecionados()
    if (pedacos) {
      this._fecharEdicao()
      this._selecao = pedacos
    } else if (this._selecao) {
      this._selecao = null
    }
  }

  _editarGrifo(evento, grifo, comNota = false) {
    if (this._rangeSelecionado()) return
    evento.stopPropagation()
    this._selecao = null
    this._editando = grifo
    this._notaAberta = comNota
  }

  _aoPressionarBarra(evento) {
    if (!this._editando) evento.preventDefault()
  }

  _aplicarCor(corId) {
    if (this._editando) {
      this._salvarNota()
      estudoService.recolorirGrupo(this._editando.grupoId, corId)
      this._editando = null
      this._notaAberta = false
    } else {
      const pedacos = this._pedacosSelecionados() ?? this._selecao
      if (!pedacos) return
      const [novo] = estudoService.adicionarGrifo(this.caminho, corId, pedacos)
      document.getSelection()?.removeAllRanges()
      this._selecao = null
      this._editando = novo
      this._notaAberta = false
    }
    this._grifos = estudoService.grifosDaNorma(this.caminho)
  }

  _removerGrifo() {
    if (this._editando) {
      estudoService.removerGrupo(this._editando.grupoId)
    }
    this._editando = null
    this._notaAberta = false
    this._grifos = estudoService.grifosDaNorma(this.caminho)
  }

  _alternarNota() {
    this._notaAberta = !this._notaAberta
  }

  _salvarNota() {
    const textarea = this.renderRoot.querySelector('.nota-textarea')
    if (!this._editando || !textarea) return
    const nota = textarea.value.trim()
    estudoService.anotarGrupo(this._editando.grupoId, nota)
    this._editando = { ...this._editando, nota: nota || undefined }
    this._grifos = estudoService.grifosDaNorma(this.caminho)
  }

  _concluirNota() {
    this._salvarNota()
    this._notaAberta = false
    this._exibirToast('Anotação salva com sucesso!')
  }

  _fecharEdicao() {
    this._salvarNota()
    this._editando = null
    this._notaAberta = false
  }

  _grifosPorDispositivo() {
    const mapa = new Map()
    if (!this._dispositivos || !this._porId) return mapa

    const ultimos = new Map()
    const depois = (a, b) =>
      this._ordem.get(a.dispositivo) - this._ordem.get(b.dispositivo) || a.inicio - b.inicio

    for (const grifo of this._grifos) {
      const disp = this._porId.get(grifo.dispositivo)
      if (!disp) continue
      const posicoes = ancorarGrifo(grifo, versaoVigente(disp).texto)
      if (!posicoes) continue
      const ancorado = { ...grifo, ...posicoes }
      if (!mapa.has(disp.id)) mapa.set(disp.id, [])
      mapa.get(disp.id).push(ancorado)
      const atual = ultimos.get(grifo.grupoId)
      if (!atual || depois(ancorado, atual) > 0) ultimos.set(grifo.grupoId, ancorado)
    }
    for (const ultimo of ultimos.values()) ultimo.ultimoDoGrupo = true
    return mapa
  }

  // Realce de busca textual combinado com grifos
  _renderTextoComRealces(texto) {
    const termo = this._filtroTexto.trim().toLowerCase()
    if (!termo) return texto

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

  _renderTexto(texto, grifos) {
    if (!grifos || !grifos.length) {
      return this._renderTextoComRealces(texto)
    }

    return segmentarTexto(texto, grifos).map(({ texto: trecho, grifo }) => {
      if (!grifo) return this._renderTextoComRealces(trecho)
      const cor = corGrifo(grifo.cor)
      const rotulo = estudoService.rotuloDaCor(cor)

      const marca = html`<mark
        class="grifo-mark"
        data-grupo=${grifo.grupoId}
        style="background:${cor.fundo}; color:#1c1b1f;"
        title=${grifo.nota
          ? `${rotulo}: ${resumir(grifo.nota, RESUMO_NOTA)}`
          : `${rotulo} — clique para anotar, recolorir ou excluir`}
        @click=${(e) => this._editarGrifo(e, grifo)}
        >${this._renderTextoComRealces(trecho)}</mark
      >`

      if (!(grifo.nota && grifo.ultimoDoGrupo)) return marca

      return html`${marca}<button
        type="button"
        class="marca-nota"
        style="background:${cor.fundo};"
        aria-label="Nota pedagógica: ${resumir(grifo.nota, RESUMO_NOTA)}"
        title=${grifo.nota}
        @click=${(e) => this._editarGrifo(e, grifo, true)}
      >${ICONE_NOTA}</button>`
    })
  }

  _renderBarra() {
    if (!this._barraAberta) return nothing
    const atual = this._editando?.cor

    return html`
      <div
        class="barra-grifo"
        role="toolbar"
        aria-label=${this._editando ? 'Editar grifo' : 'Grifar trecho'}
        @pointerdown=${this._aoPressionarBarra}
      >
        ${this._editando && this._notaAberta
          ? html`
              <div class="nota-painel">
                <textarea
                  class="nota-textarea"
                  rows="3"
                  placeholder="Escreva sua anotação pedagógica ou reflexão sobre este trecho..."
                  .value=${this._editando.nota ?? ''}
                ></textarea>
                <div class="nota-acoes">
                  <button
                    class="btn-nota-cancelar"
                    @click=${() => (this._notaAberta = false)}
                  >
                    Cancelar
                  </button>
                  <button class="btn-nota-salvar" @click=${this._concluirNota}>
                    Salvar nota
                  </button>
                </div>
              </div>
            `
          : nothing}

        <div class="linha-barra">
          <div class="cores-lista">
            ${CORES_GRIFO.map((cor) => {
              const rotulo = estudoService.rotuloDaCor(cor)
              return html`
                <button
                  type="button"
                  class="btn-cor-item"
                  aria-label="${cor.nome}: ${rotulo}"
                  aria-pressed=${this._editando ? String(atual === cor.id) : nothing}
                  @click=${() => this._aplicarCor(cor.id)}
                >
                  <span class="amostra-circulo" style="background:${cor.fundo}"></span>
                  <span>${rotulo}</span>
                </button>
              `
            })}
          </div>

          ${this._editando
            ? html`
                <button
                  class="btn-acao"
                  style="opacity:1;"
                  title=${this._editando.nota ? 'Editar nota' : 'Adicionar nota'}
                  @click=${this._alternarNota}
                >
                  <md-icon style="font-size:1.3rem;">
                    ${this._editando.nota ? 'sticky_note_2' : 'note_add'}
                  </md-icon>
                </button>
                <button
                  class="btn-acao"
                  style="opacity:1; color:#b3261e;"
                  title="Remover grifo"
                  @click=${this._removerGrifo}
                >
                  <md-icon style="font-size:1.3rem;">delete</md-icon>
                </button>
              `
            : nothing}
        </div>
      </div>
    `
  }

  render() {
    if (this._carregando) return html`<p style="padding: 24px;">Carregando texto integral da norma…</p>`
    if (this._erro) return html`<p style="color:red; padding: 24px;">Erro ao carregar norma: ${this._erro}</p>`
    if (!this._norma) return null

    const porId = this._porId
    const grifosMapa = this._grifosPorDispositivo()

    // Filtros
    const termo = this._filtroTexto.trim().toLowerCase()
    const tema = this._filtroTema

    const filtrados = this._dispositivos.filter((d) => {
      if (tema && !(d.temas ?? []).includes(tema)) return false
      if (termo) {
        const texto = versaoVigente(d).texto.toLowerCase()
        const rotulo = d.rotulo.toLowerCase()
        if (!texto.includes(termo) && !rotulo.includes(termo)) return false
      }
      return true
    })

    return html`
      <header class="topo-norma">
        <nav class="breadcrumb" aria-label="Navegação estrutural">
          <a href="#/">Início</a>
          <span>›</span>
          <span>${this._norma.categoria ?? 'Legislação'}</span>
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
      <section class="barra-ferramentas" aria-label="Filtros e busca na norma">
        <div class="linha-filtros">
          <input
            type="search"
            class="input-busca"
            placeholder="Buscar termo no texto integral (ex.: atendimento, Libras, matrícula)..."
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

      <!-- Lista de Dispositivos e Divisões Estruturais -->
      <main class="dispositivos-lista">
        ${filtrados.length === 0
          ? html`<p style="padding: 24px; text-align: center;">Nenhum dispositivo encontrado para os filtros informados.</p>`
          : filtrados.map((disp) => {
              const versao = versaoVigente(disp)
              const nivel = profundidade(disp, porId)
              const estaFalando = this._artigoFalando === disp.id
              const grifosDisp = grifosMapa.get(disp.id) ?? []
              const divisoes = this._divisoesPorArtigo?.get(disp.id) ?? []

              return html`
                ${divisoes.map(
                  (div) => html`
                    <div class="divisao" data-tipo=${div.tipo}>
                      <div class="rotulo">${div.rotulo}</div>
                      ${div.rubrica ? html`<div class="rubrica">${div.rubrica}</div>` : nothing}
                    </div>
                  `,
                )}
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

                  <div class="disp-texto">
                    <!-- Span com dados para recorte e ancoragem exata de grifos -->
                    <span
                      class="texto-disp"
                      data-disp=${disp.id}
                      data-vigente-desde=${versao.vigenteDesde}
                    >${this._renderTexto(versao.texto, grifosDisp)}</span>
                  </div>

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

      <!-- Barra de Grifos e Notas Flutuante -->
      ${this._renderBarra()}

      <!-- Toast de Notificação -->
      ${this._toast ? html`<div class="toast" role="status">${this._toast}</div>` : nothing}
    `
  }
}

customElements.define('norma-view', NormaView)
