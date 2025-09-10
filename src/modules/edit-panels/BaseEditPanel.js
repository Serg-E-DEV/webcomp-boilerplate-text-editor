export class BaseEditPanel {
  constructor(state) {
    this.state = state;
    this.root = null;
    this.elements = {};
  }

  render() {
    throw new Error('Метод render() должен быть реализован в наследнике');
  }

  attachHandlers() {
    throw new Error('Метод attachHandlers() должен быть реализован в наследнике');
  }

  getElements() {
    throw new Error('Метод getElements() должен быть реализован в наследнике');
  }

  mount(container) {
    this.root = this.render();
    container.innerHTML = '';
    container.append(this.root);
    this.attachHandlers();
    this.elements = this.getElements();
  }

  destroy() {
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  }
}
