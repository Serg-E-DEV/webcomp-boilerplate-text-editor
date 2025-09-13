import dropdownPanelTpl from '@/templates/edit-panels/dropdown-panel.html';
import {BaseEditPanel} from "@/components/BaseEditPanel";
import {getNextId, normalizeInput} from "@/modules/helpers";

export class DropdownPanel extends BaseEditPanel {
  constructor(state, editor) {
    super(state, editor);
    this.selectedId = null;
    console.log(this.editor);
    this.state.updateInserted = this.#updateInsertedDropdown(this.editor);
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
    const id = getNextId(this.state.dropdownItems);
    this.state.dropdownItems.push({id: id, value: `Пункт ${id}`});
    this.triggerInsertedUpdate();
    this.update();
  }

  removeItem() {
    this.state.dropdownItems = this.state.dropdownItems.filter(option => option.id !== this.selectedId);
    this.selectedId = null;
    this.triggerInsertedUpdate();
    this.update();
  }

  changeItem(newValue) {
    this.form.selectItemValue = newValue;
    const isValid = this.validation();

    if (isValid) {
      const index = this.state.dropdownItems.findIndex(option => option.id === this.selectedId);
      const isChanged = this.state.dropdownItems[index].value !== this.form.selectItemValue;

      if (index !== -1 && isChanged) {
        this.state.dropdownItems = this.state.dropdownItems.map(option => {
          if (option.id === this.selectedId) {
            return {...option, value: this.form.selectItemValue};
          }
          return option;
        });
        this.triggerInsertedUpdate();
      }

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
    const options = this.state.dropdownItems.map(option => this.#renderSelectOption(option.id, option.value));

    return `
      <ul class="select-list js-select-list" role="listbox">${options.join('')}</ul>
  `;
  }

  #updateSelectList(element) {
    const updatedOptions = this.state.dropdownItems.map(option => this.#renderSelectOption(option.id, option.value, option.id === this.selectedId));
    element.innerHTML = updatedOptions.join('');
  }

  #renderEditInput() {
    return `
      <input type="text" class="base-input js-item-input" data-action="change-item" disabled />
    `
  }

  #updateEditInput(element) {
    const selected = this.state.dropdownItems.find(option => option.id === this.selectedId);

    element.value = String(this.form.selectItemValue ?? selected?.value ?? '');
    element.disabled = !Boolean(selected);

    if (this.errors?.selectItemValue) {
      element.setCustomValidity('Некорректное значение');
      element.reportValidity();
    } else {
      element.setCustomValidity('');
    }
  }

  #updateInsertedDropdown(editor) {
    return () => {
      const dropdowns = editor.getDoc().querySelectorAll(`[data-type='dropdown']`);

      for (const dropdown of dropdowns) {
        let isSelectedOptionDeleted = false;
        let selectedOptionId = null;

        if (dropdown.selectedIndex > 0) {
          const dropdownItemsIds = this.state.dropdownItems.map(dropdownItem => dropdownItem.id);
          const selectedOption = dropdown.options[dropdown.selectedIndex];
          selectedOptionId = Number(selectedOption.dataset.id);
          isSelectedOptionDeleted = dropdownItemsIds.includes(selectedOptionId) === false;
        }

        if (isSelectedOptionDeleted) {
          dropdown.selectedIndex = 0;
          dropdown.options[0].text = 'ERROR';
          dropdown.dataset.error = 'true';
        } else {
          dropdown.options[0].text = '';
          dropdown.dataset.error = 'false';
        }

        for (const [i, dropdownItem] of this.state.dropdownItems.entries()) {
          // update options
          const index = i + 1;
          const option = dropdown.options[index];

          if (option) {
            option.text = dropdownItem.value;
            option.setAttribute('data-id', String(dropdownItem.id));

            if (selectedOptionId === dropdownItem.id) {
              dropdown.selectedIndex = index;
            }

          } else {
            const newOption = new Option(dropdownItem.value);
            newOption.setAttribute('data-id', String(dropdownItem.id));
            dropdown.add(newOption, index);
          }
        }

        // remove unnecessary options
        while (dropdown.options.length > this.state.dropdownItems.length + 1) {
          dropdown.options.remove(dropdown.options.length - 1);
        }
      }
    }
  }
}
