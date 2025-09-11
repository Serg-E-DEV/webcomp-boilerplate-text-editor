export function getNextId(collection) {
  return collection.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export function normalizeInput(inputText) {
  if (!inputText) {
    return '';
  }
  return inputText.trim();
}

