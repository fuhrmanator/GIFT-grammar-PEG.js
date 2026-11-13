// Helper to normalize user selection and calculate MC/Short scores
function normalizeSelection(question, selection) {
  if (selection === undefined || selection === null) return undefined;

  // Accept single item or array
  const selArray = Array.isArray(selection) ? selection : [selection];

  if (!question || !question.choices) return selArray;

  const mapped = selArray.map(item => {
    // number -> index
    if (typeof item === 'number') return question.choices[item];

    // object that looks like a choice -> pass through
    if (typeof item === 'object' && item !== null && ('isCorrect' in item || 'text' in item)) return item;

    // string -> try to match by choice.text.text or by text value
    if (typeof item === 'string') {
      const found = question.choices.find(c => (c.text && c.text.text === item) || (c.text && c.text.text === item.trim()));
      if (found) return found;
      // try exact match on feedback/text as fallback
      return question.choices.find(c => (c.text && c.text.text && c.text.text === item));
    }

    return undefined;
  }).filter(Boolean);

  return mapped;
}


module.exports = {
  normalizeSelection,
};
