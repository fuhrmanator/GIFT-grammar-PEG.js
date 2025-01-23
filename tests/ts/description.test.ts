import { parse } from "GIFT";
import { DescriptionQuestion } from "../../types";

describe('Description Tests', () => {
  it('should parse a basic description', () => {
    const input = `
      // [tag:section] [tag:intro]
      ::WW2 Description::
      The next set of questions will test your knowledge of World War 2.
    `;
    const result = parse(input);
    const question = result[0] as DescriptionQuestion;

    expect(question.type).toBe('Description');
    expect(question.title).toBe('WW2 Description');
    expect(question.tags).toEqual(['section', 'intro']);
    expect(question.formattedStem.text).toBe('The next set of questions will test your knowledge of World War 2.');
  });
});
