import { parse } from "gift-pegjs";
import { MultipleChoiceQuestion } from "../../types";

describe('Multiple Choice Question Tests', () => {
  it('should handle a minimal MC question with no optional properties', () => {
    const input = `
      What is 2+2? {
        ~%-50% 3
        ~%50% 4
        ~%-50% 5
      }
    `;
    const result = parse(input);
    const mcQuestion = result[0] as MultipleChoiceQuestion;

    // Required properties should exist
    expect(mcQuestion.type).toBe('MC');
    expect(mcQuestion.formattedStem).toBeDefined();
    expect(mcQuestion.hasEmbeddedAnswers).toBeDefined();
    expect(mcQuestion.choices).toBeDefined();

    // Optional properties should be undefined
    expect(mcQuestion.title).toBeUndefined();
    expect(mcQuestion.tags).toBeUndefined();
    expect(mcQuestion.formattedGlobalFeedback).toBeUndefined();
    
    // Alternative check using hasOwnProperty
    expect(mcQuestion.hasOwnProperty('title')).toBeFalsy();
    expect(mcQuestion.hasOwnProperty('tags')).toBeFalsy();
    expect(mcQuestion.hasOwnProperty('formattedGlobalFeedback')).toBeFalsy();
  });

});
