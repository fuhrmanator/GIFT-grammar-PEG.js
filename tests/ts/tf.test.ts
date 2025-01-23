import { parse } from "GIFT"; // Adjust the import based on your actual parser export
import { TrueFalseQuestion } from "../../types";
import exp from "constants";

describe('True/False Question Tests', () => {
  it('should produce a valid Question object for a True/False question', () => {
    const input = `
      // [tag:Fred] [tag:Wilma]
      ::Title::[markdown] The *sky* is *blue*. {T#[html]<p>feedback true</p>#feedback false####General feedback}
    `;
    const result = parse(input);

    // Type assertion to ensure result matches the Question interface
    const question = result[0];

    // Example assertions to check specific properties
    expect(question).toHaveProperty('type', 'TF');
    const tfQuestion = question as TrueFalseQuestion;
    expect(tfQuestion.title).toBeDefined();
    expect(tfQuestion.title).toEqual('Title');
    expect(tfQuestion.stem).toBeDefined();
    expect(tfQuestion.stem.format).toEqual('markdown');
    expect(tfQuestion.stem.text).toEqual('The *sky* is *blue*.');
    expect(tfQuestion.isTrue).toBeDefined();
    expect(tfQuestion.isTrue).toEqual(true);
    expect(tfQuestion.trueFeedback?.format).toBe('html');
    expect(tfQuestion.trueFeedback?.text).toBe('<p>feedback true</p>');
    expect(tfQuestion.falseFeedback?.format).toBe('markdown');
    expect(tfQuestion.falseFeedback?.text).toBe('feedback false');
    expect(tfQuestion.globalFeedback?.format).toBe('markdown');
    expect(tfQuestion.globalFeedback?.text).toBe('General feedback');
    expect(tfQuestion.tags?.length).toBe(2);
    expect(tfQuestion.tags).toContain('Fred');
    expect(tfQuestion.tags).toContain('Wilma');
  });
});
