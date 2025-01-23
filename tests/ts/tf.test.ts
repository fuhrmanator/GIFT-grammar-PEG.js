import { parse } from "GIFT"; // Adjust the import based on your actual parser export
import { TrueFalseQuestion } from "../../types";
import exp from "constants";

describe('True/False Question Tests', () => {
  it('should produce a valid Question object for a True/False question', () => {
    const input = `
      // [tag:Fred] [tag:Wilma]
      ::Title::[markdown] The *sky* is *blue*. {T#[html]<p>formattedFeedback true</p>#formattedFeedback false####General formattedFeedback}
    `;
    const result = parse(input);

    // Type assertion to ensure result matches the Question interface
    const question = result[0];

    // Example assertions to check specific properties
    expect(question).toHaveProperty('type', 'TF');
    const tfQuestion = question as TrueFalseQuestion;
    expect(tfQuestion.title).toBeDefined();
    expect(tfQuestion.title).toEqual('Title');
    expect(tfQuestion.formattedStem).toBeDefined();
    expect(tfQuestion.formattedStem.format).toEqual('markdown');
    expect(tfQuestion.formattedStem.text).toEqual('The *sky* is *blue*.');
    expect(tfQuestion.isTrue).toBeDefined();
    expect(tfQuestion.isTrue).toEqual(true);
    expect(tfQuestion.trueFormattedFeedback?.format).toBe('html');
    expect(tfQuestion.trueFormattedFeedback?.text).toBe('<p>formattedFeedback true</p>');
    expect(tfQuestion.falseFormattedFeedback?.format).toBe('markdown');
    expect(tfQuestion.falseFormattedFeedback?.text).toBe('formattedFeedback false');
    expect(tfQuestion.formattedGlobalFeedback?.format).toBe('markdown');
    expect(tfQuestion.formattedGlobalFeedback?.text).toBe('General formattedFeedback');
    expect(tfQuestion.tags?.length).toBe(2);
    expect(tfQuestion.tags).toContain('Fred');
    expect(tfQuestion.tags).toContain('Wilma');
  });
});
