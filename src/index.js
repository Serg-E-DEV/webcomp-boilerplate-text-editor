// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import appStyles from './styles/app.css';

import appTpl from './templates/app.html';
import insertPanelTpl from './templates/insert-panel.html';

import {tinymceInit} from "./modules/tinymceInit";

class TextEditor extends HTMLElement {
  constructor() {
    super();

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
    }

    const {editor, editorStyles} = await tinymceInit(this.elements.editor);
    editor.setContent('<p>Начальный текст</p>');
    editor.insertContent('<select><option>Пункт</option></select>');
    this.editor = editor;
    this.editor.body = editor.getBody();

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
