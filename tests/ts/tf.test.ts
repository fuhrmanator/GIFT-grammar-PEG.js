import { parse } from "GIFT"; // Adjust the import based on your actual parser export
import { TrueFalseQuestion } from "../../types";

describe('True/False Question Tests', () => {
  it('should produce a valid Question object for a True/False question', () => {
    const input = `
      ::Q1:: The sky is blue. {T}
    `;
    const result = parse(input);

    // Type assertion to ensure result matches the Question interface
    const question = result[0];

    // Example assertions to check specific properties
    expect(question).toHaveProperty('type', 'TF');
    expect(question).toHaveProperty('stem');
    const tfQuestion = question as TrueFalseQuestion;
    expect(tfQuestion.stem).toBeDefined();
    expect(tfQuestion.stem.text).toEqual('The sky is blue.');
    expect(tfQuestion.isTrue).toBeDefined();
    expect(tfQuestion.isTrue).toEqual(true);
  });
});
