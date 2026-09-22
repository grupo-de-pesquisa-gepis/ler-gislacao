/**
 * Acesso aos dados do acervo legislativo da Educação Especial e Inclusiva.
 * Consome os arquivos estáticos de public/data/ (cacheáveis offline pelo Service Worker).
 */

const base = `${import.meta.env.BASE_URL}data/`
const cache = new Map()

async function buscarJson(caminhoRelativo) {
  const url = `${base}${caminhoRelativo}`
  const resposta = await fetch(url)
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar ${caminhoRelativo} (HTTP ${resposta.status})`)
  }

  const tipo = resposta.headers.get('content-type') ?? ''
  if (!tipo.includes('json')) {
    throw new Error(`Norma não encontrada nos dados publicados (${caminhoRelativo})`)
  }

  return resposta.json()
}

function comCache(chave, produzir) {
  if (!cache.has(chave)) {
    cache.set(
      chave,
      produzir().catch((erro) => {
        cache.delete(chave)
        throw erro
      }),
    )
  }
  return cache.get(chave)
}

/** Lista das normas disponíveis no acervo */
export function carregarIndice() {
  return comCache('indice', () => buscarJson('indice.json'))
}

/**
 * Carrega a norma completa: { norma, estrutura, dispositivos }
 */
export function carregarNorma(caminho) {
  return comCache(`norma:${caminho}`, async () => {
    const [norma, estrutura, dispositivos] = await Promise.all([
      buscarJson(`${caminho}/norma.json`),
      buscarJson(`${caminho}/estrutura.json`),
      buscarJson(`${caminho}/dispositivos.json`),
    ])
    return { norma, estrutura, dispositivos }
  })
}

/** Versão vigente de um dispositivo legal */
export function versaoVigente(dispositivo) {
  return dispositivo.versoes.find((v) => v.vigenteAte === null) ?? dispositivo.versoes.at(-1)
}

/**
 * Profundidade hierárquica (artigo = 0, parágrafo = 1, inciso = 2, alínea = 3)
 */
export function profundidade(dispositivo, porId) {
  let nivel = 0
  let atual = dispositivo
  while (atual?.pai) {
    nivel += 1
    atual = porId.get(atual.pai)
  }
  return nivel
}

/**
 * Achata divisões da estrutura para o sumário navegável
 */
export function divisoesDoSumario(estrutura) {
  const divisoes = []

  const primeiroArtigo = (no) => {
    if (no.tipo === 'artigo') return no.id
    for (const filho of no.filhos ?? []) {
      const id = primeiroArtigo(filho)
      if (id) return id
    }
    return null
  }

  const visitar = (nos, nivel) => {
    for (const no of nos) {
      if (no.tipo === 'artigo') continue
      divisoes.push({
        tipo: no.tipo,
        rotulo: no.rotulo,
        rubrica: no.rubrica,
        nivel,
        ancora: primeiroArtigo(no),
      })
      visitar(no.filhos ?? [], nivel + 1)
    }
  }

  visitar(estrutura, 0)
  return divisoes
}

/**
 * Eixos temáticos de referência para a Educação Especial e Inclusiva
 */
export const EIXOS_TEMATICOS = [
  { id: 'AEE', rotulo: 'AEE (Atendimento Educacional Especializado)', icon: 'school' },
  { id: 'TEA', rotulo: 'TEA (Autismo)', icon: 'psychology' },
  { id: 'Libras e Bilinguismo', rotulo: 'Libras & Ed. Bilíngue', icon: 'sign_language' },
  { id: 'Profissional de Apoio', rotulo: 'Profissional de Apoio / Acompanhante', icon: 'support_agent' },
  { id: 'Adaptação Curricular & PEI', rotulo: 'Adaptação Curricular & PEI', icon: 'edit_note' },
  { id: 'Acessibilidade e Tecnologia Assistiva', rotulo: 'Acessibilidade & Rec. Multifuncionais', icon: 'accessibility_new' },
  { id: 'Direito e Não Discriminação', rotulo: 'Direito, Gratuidade e Não Discriminação', icon: 'gavel' },
]
