/**
 * Serviço de Acessibilidade Digital e Design Universal para a Aprendizagem (DUA).
 * Gerencia preferências visuais (fontes para dislexia, escala, temas de alto contraste)
 * e recursos de Text-to-Speech (leitura em voz alta via Web Speech API).
 */

const CHAVE_PREFERENCIAS = `${__APP_STORAGE_PREFIX__}:acessibilidade:prefs`

const PREFERENCIAS_PADRAO = {
  fonte: 'padrao', // 'padrao' | 'opendyslexic' | 'atkinson' | 'serif'
  escala: 100, // 100 | 115 | 130 | 145 (%)
  espacamento: 'normal', // 'normal' (1.6) | 'amplo' (1.9) | 'extra' (2.3)
  temaLeitura: 'padrao', // 'padrao' | 'alto-contraste-amarelo' | 'alto-contraste-branco' | 'sepia'
}

class AcessibilidadeService extends EventTarget {
  constructor() {
    super()
    this._prefs = this._carregar()
    this._vozPtBr = null
    this._synth = window.speechSynthesis ?? null
    this._iniciarVozes()
  }

  _carregar() {
    try {
      const salvo = localStorage.getItem(CHAVE_PREFERENCIAS)
      return salvo ? { ...PREFERENCIAS_PADRAO, ...JSON.parse(salvo) } : { ...PREFERENCIAS_PADRAO }
    } catch {
      return { ...PREFERENCIAS_PADRAO }
    }
  }

  _salvar() {
    try {
      localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(this._prefs))
    } catch {
      // quota
    }
    this.dispatchEvent(new CustomEvent('change', { detail: this._prefs }))
    this._aplicarAoDocumento()
  }

  get preferencias() {
    return { ...this._prefs }
  }

  atualizar(novasPrefs) {
    this._prefs = { ...this._prefs, ...novasPrefs }
    this._salvar()
  }

  resetar() {
    this._prefs = { ...PREFERENCIAS_PADRAO }
    this._salvar()
  }

  _aplicarAoDocumento() {
    const root = document.documentElement
    root.setAttribute('data-leitura-fonte', this._prefs.fonte)
    root.setAttribute('data-leitura-escala', `${this._prefs.escala}`)
    root.setAttribute('data-leitura-espacamento', this._prefs.espacamento)
    root.setAttribute('data-leitura-tema', this._prefs.temaLeitura)
  }

  _iniciarVozes() {
    if (!this._synth) return
    const carregarVozes = () => {
      const vozes = this._synth.getVoices()
      this._vozPtBr =
        vozes.find((v) => v.lang === 'pt-BR' && v.localService) ??
        vozes.find((v) => v.lang.startsWith('pt')) ??
        null
    }
    carregarVozes()
    if (this._synth.onvoiceschanged !== undefined) {
      this._synth.onvoiceschanged = carregarVozes
    }
  }

  // --- Text-to-Speech (Leitura em Voz Alta) ---

  falar(texto, { onEnd, onError } = {}) {
    if (!this._synth) {
      alert('Seu navegador não possui suporte à síntese de voz (Web Speech API).')
      return
    }

    this.parar()

    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'pt-BR'
    utterance.rate = 1.0
    utterance.pitch = 1.0

    if (this._vozPtBr) {
      utterance.voice = this._vozPtBr
    }

    utterance.onend = () => {
      this.dispatchEvent(new CustomEvent('tts-stop'))
      onEnd?.()
    }
    utterance.onerror = (e) => {
      this.dispatchEvent(new CustomEvent('tts-stop'))
      onError?.(e)
    }

    this.dispatchEvent(new CustomEvent('tts-start', { detail: { texto } }))
    this._synth.speak(utterance)
  }

  pausar() {
    if (this._synth?.speaking) {
      this._synth.pause()
      this.dispatchEvent(new CustomEvent('tts-pause'))
    }
  }

  retomar() {
    if (this._synth?.paused) {
      this._synth.resume()
      this.dispatchEvent(new CustomEvent('tts-resume'))
    }
  }

  parar() {
    if (this._synth) {
      this._synth.cancel()
      this.dispatchEvent(new CustomEvent('tts-stop'))
    }
  }

  estaFalando() {
    return Boolean(this._synth?.speaking)
  }
}

export const acessibilidadeService = new AcessibilidadeService()
// Aplica configurações visuais salvas no primeiro carregamento
acessibilidadeService._aplicarAoDocumento()
