import { parse } from "GIFT"; // Adjust the import based on your actual parser export
import { MultipleChoiceQuestion } from "../../types";

describe('Multiple Choice Question Tests', () => {
  it('should produce a valid Question object for a Multiple Choice question', () => {
    const input = `
      ::Q2:: What is 2+2? {
        ~%-50% 3
        ~%50% 4
        ~%-50% 5
      }
    `;
    const result = parse(input);

    // Type assertion to ensure result matches the Question interface
    const question = result[0];

    // Example assertions to check specific properties
    expect(question).toHaveProperty('type', 'MC');
    expect(question).toHaveProperty('stem');
    const mcQuestion = question as MultipleChoiceQuestion;
    expect(mcQuestion.stem).toBeDefined();
    expect(mcQuestion.choices).toBeDefined();
    expect(mcQuestion.choices).toHaveLength(3);
  });
});
