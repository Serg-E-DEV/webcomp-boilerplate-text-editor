import dropdownPanelTpl from '../../templates/edit-panels/dropdown-panel.html';
import {BaseEditPanel} from "./BaseEditPanel";

export class DropdownPanel extends BaseEditPanel {
  render() {
    let container;
    container = document.createElement('div');
    container.className = 'edit-panel';

    let renderHtml = String(dropdownPanelTpl);
    renderHtml = renderHtml.replaceAll('{{ selectList }}', this.#renderSelectList());

    container.innerHTML = renderHtml;

    return container;
  }

  addItem() {
    console.log('addItem');
    // this.state.inserted.dropdown.push(`Новый пункт`);
    // this.update();
  }

  removeItem() {
    console.log('removeItem');
    // this.state.inserted.dropdown.pop();
    // this.update();
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

  selectItem() {
    console.log('selectItem');
  }

  update() {
    // console.log('update');
    // const select = this.root.querySelector('select');
    // select.innerHTML = this.state.inserted.dropdown
    //   .map(item => `<option>${item}</option>`).join('');
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
        this.selectItem();
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
  #renderSelectList() {
    const options = this.state.inserted.dropdown.map(option => `
    <li class="select-list__item" role="option" aria-selected="false" data-action="select-item">${option}</li>
  `);

    return `
    <ul class="select-list" role="listbox">${options.join('')}</ul>
  `;
  }
}
