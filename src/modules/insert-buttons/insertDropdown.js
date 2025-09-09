import {appState} from "../../appState";

export function insertDropdown(editor) {
  if (appState.inserted.dropdown.length === 0) {
    appState.inserted.dropdown = ['Пункт 1', 'Пункт 2', 'Пункт 3'];
  }

  const options = appState.inserted.dropdown.map(option => `<option>${option}</option>`);
  const dropdown = `<select>${options.join('')}</select>`;

  editor.insertContent(dropdown);
}

