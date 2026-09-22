import { html } from 'lit'
import { createAppShell, pattern } from 'fzl-fund-appshell--lit'
import 'fzl-fund-appshell--lit/styles/theme.css'
import './styles/acessibilidade.css'
import './webcomponents/acessibilidade-dialog.js'
import './webcomponents/textos-integrais-nav.js'
import './webcomponents/home-view.js'
import './webcomponents/norma-view.js'
import './webcomponents/grifos-view.js'
import './webcomponents/sobre-view.js'
import './webcomponents/sumario-normas.js'

// Insere o componente global de acessibilidade DUA no DOM
if (!document.getElementById('dialog-acessibilidade')) {
  const dialog = document.createElement('acessibilidade-dialog')
  dialog.id = 'dialog-acessibilidade'
  document.body.appendChild(dialog)
}

createAppShell({
  mount: '#app',
  title: 'Ler-gislação',
  home: () => html`<home-view></home-view>`,

  routes: [
    {
      name: 'norma',
      match: pattern('norma/*caminho'),
      render: ({ params, query }) =>
        html`<norma-view .caminho=${params.caminho} .ir=${query.ir ?? ''}></norma-view>`,
    },
    {
      name: 'grifos',
      match: pattern('grifos'),
      render: () => html`<grifos-view></grifos-view>`,
    },
    {
      name: 'sobre',
      match: pattern('sobre'),
      render: () => html`<sobre-view></sobre-view>`,
    },
  ],

  drawer: {
    sections: [
      {
        id: 'textos-integrais',
        label: 'Textos integrais',
        expanded: true,
        render: () => html`<textos-integrais-nav></textos-integrais-nav>`,
      },
      {
        id: 'normas',
        label: 'Acervo Inclusivo',
        render: () => html`<sumario-normas></sumario-normas>`,
      },
      {
        id: 'estudo',
        label: 'Estudo & Práxis',
        items: [{ label: 'Meus grifos e notas', icon: 'format_ink_highlighter', href: '#/grifos' }],
      },
      {
        id: 'gepis',
        label: 'Grupo GEPIS',
        render: () => html`
          <div
            style="padding: 12px 16px; font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant); display: flex; flex-direction: column; gap: 10px;"
          >
            <div style="display: flex; align-items: center; gap: 10px;">
              <img
                src="./gepis-logo.png"
                alt="Logo GEPIS"
                style="width: 40px; height: 40px; border-radius: 50%; background: #fff; padding: 2px; border: 1px solid var(--md-sys-color-outline-variant);"
              />
              <div>
                <strong style="color: var(--md-sys-color-on-surface); font-size: 0.9rem; display: block;">
                  Grupo de Pesquisa - GEPIS
                </strong>
                <span style="font-size: 0.75rem; line-height: 1.2; display: block;">Inclusão Social • Unesp</span>
              </div>
            </div>
            <p style="margin: 0; line-height: 1.4;">
              Grupo de estudo e pesquisa dedicado aos marcos e práxis da Educação Inclusiva.
            </p>
            <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
              <a
                href="https://github.com/grupo-de-pesquisa-gepis"
                target="_blank"
                rel="noopener noreferrer"
                style="display: inline-flex; align-items: center; gap: 8px; color: var(--md-sys-color-primary); text-decoration: none; font-weight: 500;"
              >
                <md-icon style="font-size: 1.1rem;">open_in_new</md-icon>
                GitHub da Organização
              </a>
              <a
                href="https://github.com/grupo-de-pesquisa-gepis/ler-gislacao"
                target="_blank"
                rel="noopener noreferrer"
                style="display: inline-flex; align-items: center; gap: 8px; color: var(--md-sys-color-primary); text-decoration: none; font-weight: 500;"
              >
                <md-icon style="font-size: 1.1rem;">code</md-icon>
                Repositório ler-gislacao
              </a>
            </div>
          </div>
        `,
      },
      {
        id: 'ajuda',
        label: 'Sobre & Fontes',
        items: [{ label: 'Sobre o projeto e fontes', icon: 'info', href: '#/sobre' }],
      },
    ],
  },

  headerActions: () => html`
    <a
      href="https://github.com/grupo-de-pesquisa-gepis"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Grupo de Pesquisa - GEPIS no GitHub"
      title="Grupo de Pesquisa - GEPIS no GitHub"
      style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; text-decoration: none;"
    >
      <img
        src="./gepis-logo.png"
        alt="GEPIS Logo"
        style="width: 28px; height: 28px; border-radius: 50%; object-fit: contain;"
      />
    </a>
    <md-icon-button
      aria-label="Opções de Acessibilidade e Leitura DUA"
      title="Acessibilidade DUA"
      @click=${() => window.dispatchEvent(new CustomEvent('abrir-acessibilidade'))}
    >
      <md-icon>accessibility_new</md-icon>
    </md-icon-button>
  `,

  footerItems: () => html`
    <a
      href="https://github.com/grupo-de-pesquisa-gepis"
      target="_blank"
      rel="noopener noreferrer"
      style="display: inline-flex; align-items: center; gap: 6px; color: inherit; text-decoration: none; font-size: 0.75rem; font-weight: 500;"
      title="Grupo de Pesquisa - GEPIS no GitHub"
    >
      <img src="./gepis-logo.png" alt="" style="width: 14px; height: 14px; border-radius: 50%; vertical-align: middle;" />
      <span>GEPIS</span>
    </a>
  `,
})
