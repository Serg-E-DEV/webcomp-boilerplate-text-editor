import dropdownPanelTpl from '@/templates/edit-panels/dropdown-panel.html';
import {BaseEditPanel} from "@/components/BaseEditPanel";
import {getNextId, normalizeInput} from "@/modules/helpers";

export class DropdownPanel extends BaseEditPanel {
  constructor(state) {
    super(state);
    this.selectedId = null;
  }

  render() {
    let container;
    container = document.createElement('div');
    container.className = 'edit-panel';

    let renderHtml = String(dropdownPanelTpl);
    renderHtml = renderHtml.replaceAll('{{ selectList }}', this.#renderSelectList());
    renderHtml = renderHtml.replaceAll('{{ editInput }}', this.#renderEditInput());

    container.innerHTML = renderHtml;

    return container;
  }

  getElements() {
    return {
      select: this.root.querySelector('.js-select-list'),
      removeButton: this.root.querySelector(`[data-action='remove-item']`),
      editInput: this.root.querySelector('.js-item-input'),
    }
  }

  getForm() {
    return {
      selectItemValue: null,
    }
  }

  validation() {
    this.form.selectItemValue = normalizeInput(this.form.selectItemValue);
    this.errors.selectItemValue = this.form.selectItemValue === '';

    return !Object.values(this.errors).some(Boolean);
  }

  selectItem(id) {
    this.selectedId = this.selectedId === id ? null : id;
    this.update();
  }

  addItem() {
    const id = getNextId(this.state);
    this.state.push({id: id, value: `Пункт ${id}`});
    this.update();
  }

  removeItem() {
    this.state = this.state.filter(option => option.id !== this.selectedId);
    this.selectedId = null;
    this.update();
  }

  changeItem(newValue) {
    this.form.selectItemValue = newValue;
    const isValid = this.validation();

    if (isValid) {
      this.state = this.state.map(option => {
        if (option.id === this.selectedId) {
          return {...option, value: this.form.selectItemValue};
        }
        return option;
      });
      requestAnimationFrame(() => {
        this.elements.editInput.blur();
      });
    }

    this.update();
  }

  update() {
    this.#updateSelectList(this.elements.select);

    this.elements.removeButton.disabled = !this.selectedId;

    this.#updateEditInput(this.elements.editInput);

    this.clearValidation();
  }

  attachHandlers() {
    this.root.addEventListener('click', (event) => {
      if (event.target.dataset.action === 'add-item') {
        this.addItem();
      }

      if (event.target.dataset.action === 'remove-item') {
        this.removeItem();
      }

      if (event.target.dataset.action === 'select-item') {
        this.selectItem(Number(event.target.dataset.id));
      }
    });

    this.root.addEventListener('keydown', (event) => {
      if (event.target.dataset.action === 'change-item' && event.key === 'Enter') {
        this.changeItem(event.target.value);
      }
    });

    this.root.addEventListener('blur', (event) => {
      if (event.target.dataset.action === 'change-item') {
        this.changeItem(event.target.value);
      }
    }, true);

    this.root.addEventListener('input', (event) => {
      if (event.target.dataset.action === 'change-item') {
        event.target.setCustomValidity('');
      }
    }, true);
  }

  // private methods
  #renderSelectOption(id, value, isSelected = false) {
    return `<li class="select-list__item" role="option" aria-selected="${String(isSelected)}" data-action="select-item" data-id="${id}">${value}</li>`;
  }

  #renderSelectList() {
    const options = this.state.map(option => this.#renderSelectOption(option.id, option.value));

    return `
      <ul class="select-list js-select-list" role="listbox">${options.join('')}</ul>
  `;
  }

  #updateSelectList(element) {
    const updatedOptions = this.state.map(option => this.#renderSelectOption(option.id, option.value, option.id === this.selectedId));
    element.innerHTML = updatedOptions.join('');
  }

  #renderEditInput() {
    return `
      <input type="text" class="base-input js-item-input" data-action="change-item" disabled />
    `
  }

  #updateEditInput(element) {
    const selected = this.state.find(option => option.id === this.selectedId);

    element.value = String(this.form.selectItemValue ?? selected?.value ?? '');
    element.disabled = !Boolean(selected);

    if (this.errors?.selectItemValue) {
      element.setCustomValidity('Некорректное значение');
      element.reportValidity();
    } else {
      element.setCustomValidity('');
    }
  }
}
