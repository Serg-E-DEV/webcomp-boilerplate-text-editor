import dropdownPanelTpl from '../../templates/edit-panels/dropdown-panel.html';
import {BaseEditPanel} from "./BaseEditPanel";
import {getNextId, getPreviewId} from "../helpers";

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

    container.innerHTML = renderHtml;

    return container;
  }

  getElements() {
    return {
      select: this.root.querySelector('.js-select-list'),
      removeButton: this.root.querySelector(`[data-action='remove-item']`),
      itemInput: this.root.querySelector('.js-item-input'),
    }
  }

  addItem() {
    console.log('addItem');
    const id = getNextId(this.state);
    this.state.push({id: id, value: `Пункт ${id}`});
    this.update();
  }

  removeItem() {
    console.log('removeItem');
    this.state = this.state.filter(option => option.id !== this.selectedId);
    this.selectedId = null;
    this.update();
  }

  changeItem(newValue) {
    console.log('changeItem');
    // if (newValue.trim()) {
    //   const select = this.root.querySelector('select');
    //   const index = select.selectedIndex;
    //   this.state.inserted.dropdown[index] = newValue;
    //   this.update();
    // }
  }

  selectItem(element) {
    // console.log('selectItem');
    const id = Number(element.dataset.id);
    this.selectedId = this.selectedId === id ? null : Number(element.dataset.id);
    this.update();
  }

  update() {
    // console.log('update');
    const updatedOptions = this.state.map(option => this.#renderSelectOption(option.id, option.value, option.id === this.selectedId));
    this.elements.select.innerHTML = updatedOptions.join('');
    this.elements.removeButton.disabled = !this.selectedId;

    const selected = this.state.find(option => option.id === this.selectedId);
    this.elements.itemInput.value = selected ? selected.value : '';
    this.elements.itemInput.disabled = !Boolean(selected);
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
        this.selectItem(event.target);
      }
    });

    this.root.addEventListener('keydown', (event) => {
      if (event.target.dataset.action === 'change-item' && event.key === 'Enter') {
        this.changeItem();
      }
    });

    this.root.addEventListener('blur', (event) => {
      if (event.target.dataset.action === 'change-item') {
        this.changeItem();
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
}
