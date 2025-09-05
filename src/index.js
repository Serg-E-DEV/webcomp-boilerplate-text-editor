// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import appHtml from './app.html';
import appCss from './app.css';

class TextEditor extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow(
            {mode: "open"}
        );
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

    connectedCallback() {
        this.render();
    }

    render() {
      let renderHtml = appHtml;
      renderHtml = renderHtml.replaceAll('{{ styles }}', appCss);
      renderHtml = renderHtml.replaceAll('{{ title }}', this.title);
      this.shadow.innerHTML = renderHtml;
    }
}

customElements.define('text-editor', TextEditor);
