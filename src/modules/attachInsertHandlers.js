import {insertDropdown} from "./insert-buttons/insertDropdown";
import {insertInput} from "./insert-buttons/insertInput";

export function attachInsertHandlers(buttons, editor) {
  for (const button of buttons) {
    const handlerType = button.dataset.insertType;

    switch (handlerType) {
      case 'input':
        button.addEventListener('click', () => insertInput(editor));
        break;

      case 'dropdown':
        button.addEventListener('click', () => insertDropdown(editor));
        break;

      default:
    }
  }
}
