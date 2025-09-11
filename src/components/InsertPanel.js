import {getNextId} from "@/modules/helpers";

export class InsertPanel {
  constructor(state, editor) {
    this.state = state;
    this.editor = editor;
    this.root = null;
  }

  render() {
    let container;
    container = document.createElement('div');
    container.className = 'insert-panel';
    container.innerHTML = this.#renderInsertButtons();
    return container;
  }

  attachHandlers() {
    this.root.addEventListener('click', (event) => {
      switch (event.target.dataset.insertType) {
        case 'dropdown':
          this.#insertDropdown();
          break;
        case 'input':
          this.#insertInput();
          break;
        default:
          break;
      }
    });
  }

  mount(container) {
    this.root = this.render();
    container.innerHTML = '';
    container.append(this.root);
    this.attachHandlers();
  }

  destroy() {
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  }

  #renderInsertButton(id, type, icon, title) {
    return `
      <button class="base-button js-insert-button" type="button" data-insert-type="${type}" data-id="${id}">
        <span class="base-button__icon base-button__icon_${type || 'default'}"></span>
        ${title}
      </button>
    `;
  }

  #renderInsertButtons() {
    const buttons = this.state.insertButtons.map(button => this.#renderInsertButton(button.id, button.type, button.icon, button.title));

    return `
      <div class="insert-panel__buttons">${buttons.join('')}</div>
  `;
  }

  #insertDropdown() {
    const id = getNextId(this.state.inserted.dropdowns);

    const options = this.state.dropdownItems.map(option => `<option data-id="${option.id}">${option.value}</option>`);
    const dropdown = `<select data-id="${id}" data-type="dropdown">${options.join('')}</select>`;

    this.state.inserted.dropdowns.push({id});
    this.editor.insertContent(dropdown);
  }

  #insertInput() {
    const id = getNextId(this.state.inserted.inputs);

    const value = `Поле ввода ${id}`;
    const placeholder = 'Введите значение';

    const input = `<input data-id="${id}" data-type="input" type="text" placeholder="${placeholder}" value="${value}" />`;

    this.state.inserted.inputs.push({id, value});
    this.editor.insertContent(input);
  }
}
