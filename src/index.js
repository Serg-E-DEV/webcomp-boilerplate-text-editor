// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {appState} from '@/appState';

import appStyles from '@/styles/app.css';
import appTpl from '@/templates/app.html';

import {DropdownPanel} from '@/components/edit-panels/DropdownPanel';
import {InsertPanel} from '@/components/InsertPanel';
import {EditorPanel} from '@/components/EditorPanel';

class TextEditor extends HTMLElement {
  constructor() {
    super();
    this.appState = appState;
    this.attachShadow(
      {mode: "open"}
    );
    this.classList.add('text-editor');
    this.appStyles = String(appStyles);
    this.templates = {
      appTpl: String(appTpl),
    }
    this.editor = null;
    this.currentEditPanel = null;

    this.appState.insertedUpdateTrigger = new Proxy(appState.insertedUpdateTrigger, {
      set: (target, property, newValue, receiver) => {
        this.appState.updateInserted();
        return Reflect.set(target, property, newValue, receiver);
      },
    });
  }

  static get observedAttributes() {
    return ['title'];
  }

  attributeChangedCallback(propName, oldValue, newValue) {
    if (propName === "title") {
      this.render();
    }
  }

  get title() {
    return this.getAttribute("title");
  }

  set title(newTitle) {
    this.setAttribute("title", newTitle)
  }

  async connectedCallback() {
    this.render();
    this.elements = {
      styles: this.shadowRoot.querySelector('style'),
      topbar: this.shadowRoot.querySelector('.js-topbar'),
      editorPanel: this.shadowRoot.querySelector('.js-editor-panel'),
      insertButtons: Array.from(this.shadowRoot.querySelectorAll('.js-insert-button')),
      sidebar: this.shadowRoot.querySelector('.js-sidebar'),
    }

    const editorPanel = new EditorPanel(this.openEditPanel.bind(this));
    await editorPanel.mount(this.elements.editorPanel);
    this.editor = editorPanel.editor;

    const insertPanel = new InsertPanel(this.appState, this.editor);
    insertPanel.mount(this.elements.topbar);

    this.appStyles = this.appStyles.concat('\n', editorPanel.styles);

    this.applyAppStyles(this.appStyles);
  }

  applyAppStyles(styles) {
    this.elements.styles.textContent = styles;
  }

  render() {
    this.shadowRoot.innerHTML = this.templates.appTpl;
  }

  openEditPanel(type) {
    if (this.currentEditPanel) {
      this.currentEditPanel.destroy();
      this.elements.sidebar.innerHTML = '';
      this.currentEditPanel = null;
    }

    switch (type) {
      case 'dropdown':
        this.currentEditPanel = new DropdownPanel(this.editor);
        this.currentEditPanel.mount(this.elements.sidebar);
        break;
      default:
        break;
    }
  }
}

customElements.define('text-editor', TextEditor);
