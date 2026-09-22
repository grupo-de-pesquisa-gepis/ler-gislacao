import { LitElement, html, css } from 'lit'

export class SobreView extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 740px;
      margin: 0 auto;
      padding: 24px 20px 80px;
      font-family: var(--leitura-font-family, inherit);
      line-height: 1.6;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    h1 {
      margin: 0 0 12px;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    h2 {
      font-size: 1.2rem;
      margin: 32px 0 12px;
      color: var(--md-sys-color-primary, #1f3a5f);
    }

    .aviso {
      margin: 20px 0;
      padding: 14px 18px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      border-radius: 12px;
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 0.95rem;
    }

    ul {
      padding-left: 20px;
      margin: 12px 0;
    }

    li {
      margin-bottom: 8px;
    }

    a {
      color: var(--md-sys-color-primary, #1f3a5f);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .card-gepis {
      margin-top: 36px;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      background: linear-gradient(
        135deg,
        var(--md-sys-color-surface-variant, #e7e0ec) 0%,
        var(--md-sys-color-surface, #fff) 100%
      );
    }

    .gepis-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .gepis-logo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #ffffff;
      padding: 3px;
      border: 2px solid var(--md-sys-color-outline-variant, #cac4d0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      flex-shrink: 0;
    }

    .gepis-titulo {
      margin: 0;
      font-size: 1.2rem;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .gepis-subtitulo {
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .gepis-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }

    .gepis-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 8px;
      background: var(--md-sys-color-surface, #fff);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      color: var(--md-sys-color-primary, #1f3a5f);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .gepis-link-btn:hover {
      background: var(--md-sys-color-surface-variant, #e7e0ec);
      border-color: var(--md-sys-color-primary, #1f3a5f);
      text-decoration: none;
    }
  `

  render() {
    return html`
      <h1>Sobre o Ler-gislação</h1>

      <div class="aviso" role="note">
        <strong>Aviso Legal Importante:</strong> Os textos de normas jurídicas compilados nesta
        aplicação têm finalidade acadêmica, formativa e de consulta pedagógica. Eles
        <strong>não substituem</strong> as publicações oficiais no Diário Oficial da União (DOU).
      </div>

      <p>
        O <strong>Ler-gislação</strong> é um leitor e ambiente de consulta ágil das leis, decretos,
        diretrizes curriculares e marcos regulatórios da <strong>Educação Especial e Inclusiva</strong>
        no Brasil.
      </p>

      <h2>Fontes Oficiais</h2>
      <ul>
        <li>
          <a href="https://www.planalto.gov.br/ccivil_03/" target="_blank" rel="noopener">
            Portal da Legislação da Presidência da República (Planalto)
          </a>
          — Base oficial compilada das Leis Federais, Decretos e da Constituição Federal de 1988.
        </li>
        <li>
          <a href="http://portal.mec.gov.br/" target="_blank" rel="noopener">
            Conselho Nacional de Educação (CNE / MEC)
          </a>
          — Resoluções e Pareceres normativos da Câmara de Educação Básica (CEB).
        </li>
        <li>
          <a href="https://www.lexml.gov.br/" target="_blank" rel="noopener">LexML Brasil</a>
          — Padrão de identificadores uniformes (URN Lex) e interoperabilidade da legislação.
        </li>
      </ul>

      <h2>Acessibilidade & Design Universal para a Aprendizagem (DUA)</h2>
      <p>
        O Ler-gislação foi concebido sob os preceitos do Design Universal para a Aprendizagem (DUA) e
        em rigorosa observância às diretrizes da <strong>WCAG 2.2</strong> (níveis AA/AAA) e do
        <strong>Modelo de Acessibilidade em Governo Eletrônico (eMAG)</strong>:
      </p>
      <ul>
        <li>
          <strong>Tipografia amigável:</strong> Suporte nativo à fonte <em>Atkinson Hyperlegible</em>
          (otimizada pelo Braille Institute para baixa visão) e <em>OpenDyslexic</em> (para facilitação
          de leitura por pessoas com dislexia).
        </li>
        <li>
          <strong>Modos de Alto Contraste:</strong> Temas contrastantes para redução de fadiga visual e
          acessibilidade para pessoas com baixa visão e fotofobia.
        </li>
        <li>
          <strong>Leitura em Voz Alta (Text-to-Speech):</strong> Síntese de voz nativa via Web Speech
          API para audição artigo por artigo.
        </li>
        <li>
          <strong>Offline-First (PWA):</strong> Todo o acervo normativo funciona sem necessidade de
          conexão de internet após o primeiro carregamento.
        </li>
      </ul>

      <div class="card-gepis">
        <div class="gepis-header">
          <a
            href="https://github.com/grupo-de-pesquisa-gepis"
            target="_blank"
            rel="noopener noreferrer"
            title="Grupo de Pesquisa - GEPIS no GitHub"
          >
            <img src="./gepis-logo.png" alt="Logotipo GEPIS" class="gepis-logo" />
          </a>
          <div>
            <h3 class="gepis-titulo">Grupo de Pesquisa - GEPIS</h3>
            <div class="gepis-subtitulo">
              Grupo de Estudo e Pesquisa sobre Inclusão Social • Unesp
            </div>
          </div>
        </div>
        <p style="margin: 0; line-height: 1.5;">
          Grupo de pesquisa certificado dedicado ao desenvolvimento de soluções abertas, acessíveis,
          tecnologias assistivas e referenciais formativos para a comunidade educacional inclusiva.
        </p>
        <div class="gepis-links">
          <a
            href="https://github.com/grupo-de-pesquisa-gepis"
            target="_blank"
            rel="noopener noreferrer"
            class="gepis-link-btn"
          >
            <md-icon style="font-size: 1.1rem;">groups</md-icon>
            Organização no GitHub
          </a>
          <a
            href="https://github.com/grupo-de-pesquisa-gepis/ler-gislacao"
            target="_blank"
            rel="noopener noreferrer"
            class="gepis-link-btn"
          >
            <md-icon style="font-size: 1.1rem;">code</md-icon>
            Código-fonte no GitHub
          </a>
        </div>
      </div>
    `
  }
}

customElements.define('sobre-view', SobreView)
