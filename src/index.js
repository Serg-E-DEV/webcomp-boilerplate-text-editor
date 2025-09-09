// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {tinymceInit} from "./modules/tinymceInit";

import {appState} from "./appState";

import appStyles from './styles/app.css';
import appTpl from './templates/app.html';

import insertPanelTpl from './templates/insert-panel.html';
import {attachInsertHandlers} from "./modules/attachInsertHandlers";
import {DropdownPanel} from "./modules/edit-panels/DropdownPanel";

class TextEditor extends HTMLElement {
  constructor() {
    super();
    this.appState = appState;
    this.attachShadow(
      {mode: "open"}
    );
    this.classList.add('text-editor');
    this.appStyles = String(appStyles);
    this.tpl = {
      appTpl: String(appTpl),
      insertPanelTpl: String(insertPanelTpl)
    }
  }

  static get observedAttributes() {
    return ['title'];
  }

  attributeChangedCallback(propName, oldValue, newValue) {
    console.log(`Changing "${propName}" from "${oldValue}" to "${newValue}"`);
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
      editor: this.shadowRoot.querySelector('.js-tinymce-editor'),
      insertButtons: Array.from(this.shadowRoot.querySelectorAll('.js-insert-button')),
      sidebar: this.shadowRoot.querySelector('.js-sidebar'),
    }

    //TODO: позже связать с кликом на элементе в редакторе, предусмотреть отписки
    const dropdownPanel = new DropdownPanel(this.appState);
    dropdownPanel.mount(this.elements.sidebar);
    //TODO: end

    const {editor, editorStyles} = await tinymceInit(this.elements.editor);
    editor.setContent('<p>Начальный текст</p>');

    this.editor = editor;
    this.editor.body = editor.getBody();

    attachInsertHandlers(this.elements.insertButtons, this.editor);

    this.appStyles = this.appStyles.concat('\n', editorStyles);

    this.applyAppStyles(this.appStyles);
  }

  applyAppStyles(styles) {
    this.elements.styles.textContent = styles;
  }

  render() {
    let renderHtml = this.tpl.appTpl;
    renderHtml = renderHtml.replaceAll('{{ insertPanel }}', this.tpl.insertPanelTpl);
    this.shadowRoot.innerHTML = renderHtml;
  }
}

customElements.define('text-editor', TextEditor);
console.log(appState);
