import tinymce from "tinymce/tinymce";
import "tinymce/icons/default";    // базовый набор иконок (например, Bold, Italic)
import "tinymce/themes/silver";    // стандартная тема оформления TinyMCE (панель, тулбар)
import "tinymce/models/dom";       // модель для работы с DOM (основа редактора)
import "tinymce/plugins/lists";    // плагин для маркированных и нумерованных списков
import "tinymce/plugins/link";     // плагин для вставки и редактирования ссылок
import "tinymce/plugins/code";     // плагин для отображения/правки HTML-кода

import skinUiCss from 'tinymce/skins/ui/oxide/skin.min.css';
import skinContentCss from 'tinymce/skins/content/default/content.min.css';
import textContentCSS from '../styles/vendor/tinymce-text-content.css';

export async function tinymceInit(targetElement) {
  const editorStyles = [skinUiCss, skinContentCss].join('\n');
  const editors = await tinymce.init({
    target: targetElement,
    plugins: 'lists link code',
    toolbar: 'code | undo redo | bold italic underline | bullist numlist | link',
    menubar: true,
    height: 600,
    license_key: 'gpl',
    setup: (editor) => {
      editor.on('init', () => {
        const container = editor.getContainer();
        container.style.width = '100%';
        container.style.maxWidth = '100%';
        container.style.visibility = 'visible';

        const doc = editor.getDoc();
        const style = doc.createElement('style');
        style.textContent = textContentCSS;
        doc.head.appendChild(style);
      });
    },
    skin: false,
    content_css: false,
    resize: false,
    branding: false,
    promotion: false,
  });
  return {
    editor: editors[0],
    editorStyles,
  };
}
