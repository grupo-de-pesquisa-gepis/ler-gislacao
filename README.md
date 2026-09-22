# Ler-gislação — Educação Especial e Inclusiva

> **Ambiente de leitura, consulta e referência de normas e marcos regulatórios da Educação Especial e Inclusiva no Brasil.**  
> Projeto desenvolvido no âmbito do **GEPIS** (Grupo de Pesquisa em Educação Especial e Inclusiva).

---

## 🎯 Propósito do Projeto

O **Ler-gislação** foi concebido para atender pesquisadores, professores do AEE (Atendimento Educacional Especializado) e da sala comum, gestores escolares, pessoas com deficiência e suas famílias. 

Unindo a arquitetura *offline-first* do [legisreader](https://github.com/wagnermarques/legisreader) a preceitos rigorosos de **Acessibilidade Digital (WCAG 2.2 Níveis AA/AAA e eMAG)** e **Design Universal para a Aprendizagem (DUA)**, o projeto oferece uma experiência de leitura acessível, intuitiva e pedagogicamente enriquecida.

---

## 📚 Acervo Legislativo Inicial

O acervo de normas está estruturado em formato JSON padronizado e versionado diretamente em `public/data/`:

1. **Lei nº 13.146/2015 (LBI — Lei Brasileira de Inclusão / Estatuto da PcD)**  
   *Disposições gerais, conceitos fundamentais e o Capítulo IV (Do Direito à Educação, arts. 27 a 30).*
2. **Lei nº 9.394/1996 (LDB — Diretrizes e Bases da Educação Nacional)**  
   *Capítulo V (Da Educação Especial, arts. 58 a 60) e Capítulo V-A (Da Educação Bilíngue de Surdos, arts. 60-A e 60-B — Lei 14.191/2021).*
3. **Constituição Federal de 1988 (CF/88)**  
   *Capítulo III, Seção I — Da Educação (arts. 205 a 214, com foco no art. 208, III — AEE).*
4. **Decreto nº 7.611/2011**  
   *Educação Especial, Atendimento Educacional Especializado e Salas de Recursos Multifuncionais.*
5. **Lei nº 12.764/2012 (Lei Berenice Piana)**  
   *Política Nacional de Proteção dos Direitos da Pessoa com TEA e direito ao acompanhante especializado.*
6. **Decreto nº 6.949/2009 (Convenção da ONU sobre Direitos da PcD)**  
   *Artigo 24 (Educação) com equivalência constitucional de direitos humanos.*
7. **Resolução CNE/CEB nº 4/2009**  
   *Diretrizes Operacionais para o Atendimento Educacional Especializado na Educação Básica.*

---

## ✨ Funcionalidades e Diferenciais

- ♿ **Acessibilidade & DUA nativos**:
  - Tipografia amigável com suporte à fonte **Atkinson Hyperlegible** (otimizada pelo *Braille Institute*) e **OpenDyslexic**.
  - Ajuste dinâmico de tamanho de fonte (100% a 145%) e entrelinhamento (1.6 a 2.3).
  - Temas de **Alto Contraste** (Preto/Amarelo e Preto/Branco) e Modo Sépia para redução de fadiga visual.
- 🗣️ **Leitura em Voz Alta (Text-to-Speech nativo)**:
  - Síntese de voz em português brasileiro utilizando a *Web Speech API*, permitindo ouvir artigos individualmente com controle de execução.
- 🏷️ **Filtros por Eixos Temáticos**:
  - Classificação temática dos dispositivos legais: *AEE*, *TEA (Autismo)*, *Libras & Educação Bilíngue*, *Profissional de Apoio / Acompanhante*, *Adaptação Curricular & PEI*, *Acessibilidade & Recursos Multifuncionais*, *Direito e Não Discriminação*.
- 🎓 **Gerador de Citação ABNT NBR 6023**:
  - Botão de citação que gera automaticamente a referência formal do dispositivo legal selecionado com link oficial e data de acesso.
- 🖍️ **Grifos e Notas Pedagógicas (Local-first)**:
  - Destaques coloridos com significados pedagógicos salvos no navegador sem exigência de login, com exportação das anotações em Markdown.
- ⚡ **Offline-First / PWA**:
  - Service Workers com precache total dos dados normativos e fontes para consulta sem internet.

---

## 🛠️ Arquitetura e Pilha Tecnológica

- **Lit 3** e **Web Components**: Componentização nativa, leve e padronizada.
- **Material Design 3 (`@material/web`)**: Componentes de interface e tokens de design.
- **AppShell como Submódulo Git**: Interface base e infraestrutura desacoplada provida por [fzl-fund-appshell--lit](https://github.com/wagnermarques/fzl-fund-appshell--lit).
- **Vite** e **Vite Plugin PWA**: Build rápido, *workbox* e manifesto PWA.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 20+ e npm
- Git (com suporte a submódulos)

### Instalação

```bash
# Clonar o repositório com os submódulos
git clone --recursive git@github.com:grupo-de-pesquisa-gepis/ler-gislacao.git
cd ler-gislacao

# Ou se já clonado:
git submodule update --init --recursive

# Instalar dependências (workspaces)
npm install
```

### Comandos de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento local
npm run dev

# Gerar build de produção otimizado com PWA
npm run build

# Pré-visualizar build de produção
npm run preview
```

### Atualização do Acervo de Dados

Caso queira regenerar ou expandir o corpus legislativo inicial em `public/data/`:

```bash
python3 scripts/gerar-dados-inclusivos.py
```

---

## 🏛️ Fontes Oficiais

- [Presidência da República — Planalto (Legislação Federal)](https://www.planalto.gov.br/ccivil_03/)
- [MEC / Conselho Nacional de Educação (CNE)](http://portal.mec.gov.br/)
- [LexML Brasil](https://www.lexml.gov.br/)
