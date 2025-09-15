export const appState = {
  defaultEditorText: [
    `Ваш текст здесь...`,
    `Чтобы вставить специальный элемент в текст, воспользуйтесь кнопками на верхней панели.`,
    `Выберите вставленный элемент - откроется панель редактирования (если она предусмотрена для данного элемента).`,
    `Все выпадающие списки - это один и тот же элемент.`,
    `При редактировании выпадающего списка - все изменения автоматически отображаются в текстовом редакторе.`,
  ],
  insertButtons: [
    {
      id: 1,
      type: 'dropdown',
      icon: '',
      title: 'dropdown'
    },
    {
      id: 2,
      type: 'input',
      icon: 'input',
      title: 'input'
    },
  ],
  dropdownItems: [
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
    {
      id: 4,
      value: 'Пункт 4',
    },
  ],
  inserted: {
    dropdowns: [],
    inputs: [],
  },
  insertedUpdateTrigger: {
    timestamp: null,
  },
  updateInserted: () => {
    // noop
  },
}


