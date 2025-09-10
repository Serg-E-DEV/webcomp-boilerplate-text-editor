import {appState} from "../../appState";

export function insertDropdown(editor) {
  //TODO: решить, где будет заполняться начальный массив для списка, тут или сразу в стейте
  if (appState.inserted.dropdown.length === 0) {
    appState.inserted.dropdown = [
      {
        id: 1,
        value: 'Пункт 1',
      },
      {
        id: 2,
        value: 'Пункт 2',
      },
      {
        id: 3,
        value: 'Пункт 3',
      },
    ];
  }

  const options = appState.inserted.dropdown.map(option => `<option data-id="${option.id}">${option.value}</option>`);
  const dropdown = `<select>${options.join('')}</select>`;

  editor.insertContent(dropdown);
}

