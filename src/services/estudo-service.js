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
   * Salva um grifo como um registro por dispositivo que ele cobre.
   * `pedacos`: [{ dispositivo, vigenteDesde, inicio, fim, texto }]
   */
  adicionarGrifo(norma, cor, pedacos) {
    const lista = this.listarGrifos()
    const grupoId = novoId()
    const criadoEm = new Date().toISOString()
    const novos = pedacos.map((p) => ({
      id: novoId(),
      grupoId,
      norma,
      dispositivo: p.dispositivo,
      vigenteDesde: p.vigenteDesde,
      inicio: p.inicio,
      fim: p.fim,
      cor,
      texto: p.texto,
      criadoEm,
    }))
    lista.push(...novos)
    gravarJson(CHAVES.grifos, lista)
    return novos
  },

  recolorirGrupo(grupoId, cor) {
    const lista = this.listarGrifos()
    for (const g of lista) {
      if (g.grupoId === grupoId) g.cor = cor
    }
    gravarJson(CHAVES.grifos, lista)
  },

  /** Nota vazia (ou só espaço) remove a nota do grifo */
  anotarGrupo(grupoId, nota) {
    const lista = this.listarGrifos()
    const limpa = nota?.trim() || ''
    const editadaEm = new Date().toISOString()
    for (const g of lista) {
      if (g.grupoId !== grupoId) continue
      if (limpa) {
        g.nota = limpa
        g.notaEditadaEm = editadaEm
      } else {
        delete g.nota
        delete g.notaEditadaEm
      }
    }
    gravarJson(CHAVES.grifos, lista)
  },

  removerGrupo(grupoId) {
    gravarJson(
      CHAVES.grifos,
      this.listarGrifos().filter((g) => g.grupoId !== grupoId),
    )
  },

  /** O significado de cada cor: o escolhido pelo estudante, senão o padrão */
  rotuloDaCor(cor) {
    return lerJson(CHAVES.rotulosCores, {})[cor.id] || cor.rotuloPadrao
  },

  renomearCor(corId, rotulo) {
    const rotulos = lerJson(CHAVES.rotulosCores, {})
    const limpo = rotulo.trim()
    if (limpo) rotulos[corId] = limpo
    else delete rotulos[corId]
    gravarJson(CHAVES.rotulosCores, rotulos)
  },

  // Aliases para retrocompatibilidade
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
    this.anotarGrupo(grupoId, nota)
  },

  alterarCorGrupo(grupoId, novaCor) {
    this.recolorirGrupo(grupoId, novaCor)
  },
}
