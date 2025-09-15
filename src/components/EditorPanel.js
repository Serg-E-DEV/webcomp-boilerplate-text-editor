import tinymce from "tinymce/tinymce";
import "tinymce/icons/default";    // базовый набор иконок (например, Bold, Italic)
import "tinymce/themes/silver";    // стандартная тема оформления TinyMCE (панель, тулбар)
import "tinymce/models/dom";       // модель для работы с DOM (основа редактора)
import "tinymce/plugins/lists";    // плагин для маркированных и нумерованных списков
import "tinymce/plugins/link";     // плагин для вставки и редактирования ссылок
import "tinymce/plugins/code";     // плагин для отображения/правки HTML-кода

import skinUiCss from 'tinymce/skins/ui/oxide/skin.min.css';
import skinContentCss from 'tinymce/skins/content/default/content.min.css';
import textContentCSS from '@/styles/vendor/tinymce-text-content.css';

export class EditorPanel {
  #editor;
  #editorStyles;

  constructor(state, openEditPanel) {
    this.state = state;
    this.root = null;
    this.openEditPanel = openEditPanel;
  }

  render() {
    let container;
    container = document.createElement('textarea');
    container.className = 'js-tinymce-editor';
    return container;
  }

  attachEditorHandlers() {
    this.editor.on('mousedown', (e) => {
      const insertedType = e.target.dataset.type;
      if (!insertedType) {
        return;
      }
      this.openEditPanel(insertedType);
    });
  }

  get editor() {
    return this.#editor;
  }

  get styles() {
    return this.#editorStyles;
  }

  async mount(container) {
    this.root = this.render();
    container.innerHTML = '';
    container.append(this.root);

    const {editor, editorStyles} = await this.#tinymceInit(this.root);
    this.#editor = editor;
    this.#editorStyles = editorStyles;

    editor.setContent(this.state.defaultEditorText.map(paragraph => `<p>${paragraph}</p>`).join(''));
    const body = editor.getBody();
    const lastNode = body.lastChild;
    const textNode = lastNode.firstChild || lastNode;
    editor.selection.setCursorLocation(textNode, textNode.textContent.length);

    this.attachEditorHandlers();
  }

  destroy() {
    if (this.#editor) {
      tinymce.remove(this.#editor);
      this.#editor = null;
    }
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  }

  async #tinymceInit(container) {
    const editorStyles = [skinUiCss, skinContentCss].join('\n');
    const editors = await tinymce.init({
      target: container,
      plugins: 'lists link code',
      toolbar: 'code | undo redo | bold italic underline | bullist numlist | link',
      menubar: false,
      height: 600,
      license_key: 'gpl',
      setup: (editor) => {
        editor.on('init', () => {
          const container = editor.getContainer();
          container.style.width = '100%';
          container.style.maxWidth = '100%';
          container.style.visibility = 'visible';

          const doc = editor.getDoc();
          doc.documentElement.classList.add('scrollbar-style');

          const style = doc.createElement('style');
          style.textContent = textContentCSS;

          doc.head.appendChild(style);
        });
      },
      skin: false,
      content_css: false,
      resize: false,
      branding: true,
      promotion: false,
    });
    return {
      editor: editors[0],
      editorStyles,
    };
  }
}
