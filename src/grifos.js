/**
 * Lógica pura de grifos, anotações e citações (ABNT NBR 6023).
 *
 * Um grifo guarda posições de caracteres dentro de `versao.texto` de um dispositivo.
 */

// Paleta dos grifos pedagógicos para Educação Inclusiva
export const CORES_GRIFO = [
  { id: 'amarelo', nome: 'Amarelo', fundo: '#fff59d', rotuloPadrao: 'Conceito / Fundamento' },
  { id: 'verde', nome: 'Verde', fundo: '#c8e6c9', rotuloPadrao: 'Direito Assegurado / Gratuidade' },
  { id: 'azul', nome: 'Azul', fundo: '#bbdefb', rotuloPadrao: 'Prática Pedagógica / AEE' },
  { id: 'laranja', nome: 'Laranja', fundo: '#ffe0b2', rotuloPadrao: 'Dever do Estado / Escola' },
  { id: 'rosa', nome: 'Rosa', fundo: '#f8bbd0', rotuloPadrao: 'Acompanhante / Apoio Escolar' },
]

export const COR_TEXTO_GRIFO = '#1c1b1f'

const coresPorId = new Map(CORES_GRIFO.map((c) => [c.id, c]))

export function corGrifo(id) {
  return coresPorId.get(id) ?? CORES_GRIFO[0]
}

/**
 * Ancoragem do grifo no texto atual do dispositivo: { inicio, fim }, ou null
 * caso a redação tenha sido alterada e o trecho não exista mais.
 */
export function ancorarGrifo(grifo, texto) {
  const { inicio, fim, texto: trecho } = grifo
  if (texto.slice(inicio, fim) === trecho) return { inicio, fim }
  if (!trecho) return null

  let melhor = -1
  for (let i = texto.indexOf(trecho); i !== -1; i = texto.indexOf(trecho, i + 1)) {
    if (melhor === -1 || Math.abs(i - inicio) < Math.abs(melhor - inicio)) melhor = i
  }
  return melhor === -1 ? null : { inicio: melhor, fim: melhor + trecho.length }
}

/**
 * Segmenta o texto em partes alternadas: texto comum e texto destacado.
 */
export function segmentarTexto(texto, grifos) {
  const trechos = []
  let cursor = 0
  for (const grifo of [...grifos].sort((a, b) => a.inicio - b.inicio)) {
    const inicio = Math.max(grifo.inicio, cursor)
    const fim = Math.min(grifo.fim, texto.length)
    if (fim <= inicio) continue
    if (inicio > cursor) trechos.push({ texto: texto.slice(cursor, inicio), grifo: null })
    trechos.push({ texto: texto.slice(inicio, fim), grifo })
    cursor = fim
  }
  if (cursor < texto.length) trechos.push({ texto: texto.slice(cursor), grifo: null })
  return trechos
}

/**
 * Ajusta posições para remover espaços em branco das extremidades da seleção.
 */
export function aparar(texto, inicio, fim) {
  if (inicio > fim) [inicio, fim] = [fim, inicio]
  while (inicio < fim && /\s/.test(texto[inicio])) inicio++
  while (fim > inicio && /\s/.test(texto[fim - 1])) fim--
  return fim > inicio ? { inicio, fim } : null
}

/** Rótulo de um dispositivo como aparece numa citação. */
export function rotuloNaCitacao(disp) {
  const rotulo = disp.rotulo.trim()
  switch (disp.tipo) {
    case 'artigo':
      return rotulo.replace(/^Art\./, 'art.')
    case 'paragrafo':
      return rotulo.replace(/^Parágrafo único$/i, 'parágrafo único')
    case 'inciso':
      return rotulo.replace(/\s*[–-]\s*$/, '')
    case 'alinea':
      return `alínea ${rotulo.replace(/\)\s*$/, '')}`
    default:
      return rotulo
  }
}

/**
 * Citação curta do dispositivo a partir da cadeia de pais:
 * "Lei Brasileira de Inclusão, art. 28, § 1º".
 */
export function citacao(nomeNorma, dispositivo, porId) {
  const partes = []
  for (let atual = dispositivo; atual; atual = atual.pai ? porId.get(atual.pai) : null) {
    partes.unshift(rotuloNaCitacao(atual))
  }
  return [nomeNorma, ...partes].join(', ')
}

/**
 * Gera citação formatada conforme ABNT NBR 6023.
 * Exemplo:
 * BRASIL. Lei nº 13.146, de 6 de julho de 2015. Institui a Lei Brasileira de Inclusão... Art. 28, § 1º.
 * Disponível em: <...>. Acesso em: 22 set. 2026.
 */
export function citacaoABNT(norma, dispositivo, porId) {
  const cadeia = []
  for (let atual = dispositivo; atual; atual = atual.pai ? porId.get(atual.pai) : null) {
    cadeia.unshift(rotuloNaCitacao(atual))
  }
  const dispositivoStr = cadeia.join(', ')
  const ementa = norma.ementa ? ` ${norma.ementa}` : ''
  const url = norma.urlFonte ? ` Disponível em: <${norma.urlFonte}>.` : ''
  const meses = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']
  const d = new Date()
  const dataAcesso = `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`
  const acesso = url ? ` Acesso em: ${dataAcesso}.` : ''

  return `BRASIL. ${norma.nome}.${ementa} ${dispositivoStr}.${url}${acesso}`
}
