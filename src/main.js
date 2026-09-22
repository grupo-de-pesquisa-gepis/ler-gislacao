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
        id: 'ajuda',
        label: 'Sobre & Fontes',
        items: [{ label: 'Sobre o projeto e fontes', icon: 'info', href: '#/sobre' }],
      },
    ],
  },

  headerActions: () => html`
    <md-icon-button
      aria-label="Opções de Acessibilidade e Leitura DUA"
      title="Acessibilidade DUA"
      @click=${() => window.dispatchEvent(new CustomEvent('abrir-acessibilidade'))}
    >
      <md-icon>accessibility_new</md-icon>
    </md-icon-button>
  `,
})
