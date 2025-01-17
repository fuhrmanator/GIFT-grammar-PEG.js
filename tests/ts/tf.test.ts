import { parse } from "GIFT"; // Adjust the import based on your actual parser export
import { Question, TextChoice, TrueFalseQuestion, MultipleChoiceQuestion, NumericalQuestion, SimpleNumericalAnswer, RangeNumericalAnswer, HighLowNumericalAnswer, MultipleNumericalAnswer } from "../../types";
import { isSimpleNumericalAnswer, isRangeNumericalAnswer, isHighLowNumericalAnswer, isMultipleNumericalAnswer } from "../../types/typeGuards";
import exp from "constants";

describe('TypeScript access to PEG.js Parser', () => {
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
    const question: Question = result[0];

    // Example assertions to check specific properties
    expect(question).toHaveProperty('type', 'MC');
    expect(question).toHaveProperty('stem');
    const mcQuestion = question as MultipleChoiceQuestion;
    expect(mcQuestion.stem).toBeDefined();
    expect(mcQuestion.choices).toBeDefined();
    expect(mcQuestion.choices).toHaveLength(3);
  });

  it('should produce a valid Question object for a Numerical question', () => {
    const input = `
      ::Q3:: What is the value of pi (3.14)? {
        #3.14:0.01
      }
    `;
    const result = parse(input);

    // Type assertion to ensure result matches the Question interface
    const question = result[0];

    // Example assertions to check specific properties
    expect(question).toHaveProperty('type', 'Numerical');
    const numericalQuestion = question as NumericalQuestion;
    expect(numericalQuestion.stem.format).toBeDefined();
    expect(numericalQuestion.stem.format).toBe('moodle');
    expect(numericalQuestion.stem.text).toBeDefined();
    expect(numericalQuestion.stem.text).toBe('What is the value of pi (3.14)?');
    expect(numericalQuestion.choices).toBeDefined();
    expect(numericalQuestion.choices).toHaveLength(1);

    const choice = numericalQuestion.choices[0];
    if (isRangeNumericalAnswer(choice)) {
      expect(choice.type).toBe('range');
      expect(choice.number).toBe(3.14);
      expect(choice.range).toBe(0.01);
    } else if (isSimpleNumericalAnswer(choice)) {
      expect(choice.type).toBe('simple');
      expect(choice.number).toBe(3.14);
    } else if (isHighLowNumericalAnswer(choice)) {
      expect(choice.type).toBe('high-low');
      expect(choice.numberHigh).toBe(3.15);
      expect(choice.numberLow).toBe(3.13);
    }
  });

  it('should produce a valid Question object for a question with multiple Numerical answer ', () => {
    const input = `
When was Ulysses S. Grant born? {#
    =1822:0
    =%50%1822:2}    `;
    const result = parse(input);

    // Type assertion to ensure result matches the Question interface
    const question = result[0];

    // Example assertions to check specific properties
    expect(question).toHaveProperty('type', 'Numerical');
    const numericalQuestion = question as NumericalQuestion;
    expect(numericalQuestion.stem.text).toBe('When was Ulysses S. Grant born?');
    expect(numericalQuestion.choices).toBeDefined();
    expect(numericalQuestion.choices).toHaveLength(2);

    const arrayChoices = numericalQuestion.choices as MultipleNumericalAnswer[];
    expect(arrayChoices[0].text.number).toBe(1822);
    expect(arrayChoices[0].text.range).toBe(0);
    expect(arrayChoices[1].text.number).toBe(1822);
    expect(arrayChoices[1].text.range).toBe(2);
    expect(arrayChoices[1].weight).toBe(50);
  });

  // Add more tests for different question types and scenarios
});
