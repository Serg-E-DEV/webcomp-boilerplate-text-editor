import {appState} from "@/appState";

export class BaseEditPanel {
  #type;

  constructor(editor) {
    this.state = appState;
    this.root = null;
    this.elements = {};
    this.form = {};
    this.errors = {};
    this.editor = editor;
    this.#type = null;
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

  getForm() {
    throw new Error('Метод getForm() должен быть реализован в наследнике');
  }

  getErrors(form) {
    const errors = {};
    Object.keys(form).forEach(fieldName => {
      errors[fieldName] = false;
    })
    return errors;
  }

  validation() {
    throw new Error('Метод validation() должен быть реализован в наследнике');
  }

  clearValidation() {
    Object.keys(this.form).forEach(key => {
      this.form[key] = null;
      this.errors[key] = null;
    });
  }

  triggerInsertedUpdate() {
    this.state.insertedUpdateTrigger.timestamp = Date.now();
  }

  mount(container) {
    this.root = this.render();
    container.innerHTML = '';
    container.append(this.root);
    this.attachHandlers();
    this.elements = this.getElements();
    this.form = this.getForm();
    this.errors = this.getErrors(this.form);
  }

  destroy() {
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  }

  get type() {
    return this.#type
  }

  set type(value) {
    this.#type = value;
  }
}
