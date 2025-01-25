import { parse, EssayQuestion } from "gift-pegjs";

describe('Essay Question Tests', () => {
  it('should parse a basic essay question', () => {
    const input = `
      ::Q1:: Write a short essay about the Reformation. {}
    `;
    const result = parse(input);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('Essay');

    const question = result[0] as EssayQuestion;
    expect(question.type).toBe('Essay');
    expect(question.formattedStem.format).toBe('moodle');
    expect(question.formattedStem.text).toBe('Write a short essay about the Reformation.');
  });

  it('should parse an essay question with tags and title', () => {
    const input = `
      // [tag:history] [tag:reformation] [tag:essay_type]
      ::Historical Essay:: Write a short essay about the Protestant Reformation. {}
    `;
    const result = parse(input);
    const question = result[0] as EssayQuestion;

    expect(question.type).toBe('Essay');
    expect(question.title).toBe('Historical Essay');
    expect(question.tags).toBeDefined();
    expect(question.tags).toHaveLength(3);
    expect(question.tags).toEqual(['history', 'reformation', 'essay_type']);
    expect(question.formattedStem.format).toBe('moodle');
    expect(question.formattedStem.text).toBe('Write a short essay about the Protestant Reformation.');
  });
});
