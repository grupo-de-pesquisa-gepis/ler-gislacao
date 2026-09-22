/**
 * Dados de estudo pedagógico, grifos e notas: local-first no localStorage.
 */

const CHAVES = {
  grifos: `${__APP_STORAGE_PREFIX__}:estudo:grifos`,
  rotulosCores: `${__APP_STORAGE_PREFIX__}:estudo:rotulos-cores`,
}

function lerJson(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave)
    return bruto === null ? padrao : JSON.parse(bruto)
  } catch {
    return padrao
  }
}

function gravarJson(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // quota ou storage bloqueado em navegação anônima estrita
  }
}

function novoId() {
  if (crypto.randomUUID) return crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export const estudoService = {
  /** Todos os grifos, do mais recente ao mais antigo */
  listarGrifos() {
    return lerJson(CHAVES.grifos, [])
  },

  grifosDaNorma(caminho) {
    return this.listarGrifos().filter((g) => g.norma === caminho)
  },

  grifosDoDispositivo(caminho, dispositivoId) {
    return this.listarGrifos().filter((g) => g.norma === caminho && g.dispositivo === dispositivoId)
  },

  /**
   * Salva um ou mais grifos gerados pela seleção de texto
   */
  salvarGrifos(novos) {
    const grupoId = novoId()
    const agora = new Date().toISOString()
    const preparados = novos.map((g) => ({
      id: novoId(),
      grupoId,
      criadoEm: agora,
      ...g,
    }))
    const todos = [...this.listarGrifos(), ...preparados]
    gravarJson(CHAVES.grifos, todos)
    return preparados
  },

  atualizarNota(grupoId, nota) {
    const agora = new Date().toISOString()
    const textoNota = nota?.trim() || null
    const todos = this.listarGrifos().map((g) => {
      if (g.grupoId !== grupoId) return g
      const atualizado = { ...g, notaEditadaEm: agora }
      if (textoNota) atualizado.nota = textoNota
      else delete atualizado.nota
      return atualizado
    })
    gravarJson(CHAVES.grifos, todos)
  },

  alterarCorGrupo(grupoId, novaCor) {
    const todos = this.listarGrifos().map((g) => (g.grupoId === grupoId ? { ...g, cor: novaCor } : g))
    gravarJson(CHAVES.grifos, todos)
  },

  removerGrupo(grupoId) {
    const restantes = this.listarGrifos().filter((g) => g.grupoId !== grupoId)
    gravarJson(CHAVES.grifos, restantes)
  },

  rotulosCores() {
    return lerJson(CHAVES.rotulosCores, {})
  },

  salvarRotuloCor(corId, rotulo) {
    const rotulos = this.rotulosCores()
    rotulos[corId] = rotulo
    gravarJson(CHAVES.rotulosCores, rotulos)
  },
}
