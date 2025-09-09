import {appState} from "../../appState";

export function insertInput(editor) {
  const id = appState.inserted.inputs.reduce((max, input) => Math.max(max, input.id,), 0) + 1;

  const value = `Поле ввода ${id}`;
  const placeholder = 'Введите значение';

  const input = `<input id="${id}" type="text" placeholder="${placeholder}" value="${value}" />`;

  appState.inserted.inputs.push({id, value});
  editor.insertContent(input);
}

