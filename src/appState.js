export const appState = {
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
  updateInserted: (editor) => {
    // noop
  },
}


