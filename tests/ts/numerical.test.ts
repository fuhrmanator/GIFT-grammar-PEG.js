import { parse, NumericalQuestion, RangeNumericalAnswer, HighLowNumericalAnswer, SimpleNumericalAnswer, MultipleNumericalAnswer } from "gift-pegjs";
import { isSimpleNumericalAnswer, isRangeNumericalAnswer, isHighLowNumericalAnswer, isMultipleNumericalAnswer } from "gift-pegjs/typeGuards";

describe('Numerical Question Tests', () => {
    // ::Ulysses birthdate::When was Ulysses S. Grant born? {#1822}
    it('should produce a valid Question object for a Numerical question with Title', () => {
        const input = `
          ::Ulysses birthdate::When was Ulysses S. Grant born? {#1822}
        `;
        const result = parse(input);

        // Type assertion to ensure result matches the Question interface
        const question = result[0];

        // Example assertions to check specific properties
        expect(question).toHaveProperty('type', 'Numerical');
        const numericalQuestion = question as NumericalQuestion;
        expect(numericalQuestion.title).toBe('Ulysses birthdate');
        expect(numericalQuestion.formattedStem.text).toBe('When was Ulysses S. Grant born?');
        expect(numericalQuestion.choices).toBeDefined();
        expect(numericalQuestion.choices).toHaveLength(1);

        const choice = numericalQuestion.choices[0];
        expect(isSimpleNumericalAnswer(choice)).toBe(true);
        const c = choice as SimpleNumericalAnswer;
        expect(c.type).toBe('simple');
        expect(c.number).toBe(1822);

    });
    // ::Q3:: What is the value of pi (to 3 decimal places)? {#3.1415:0.0005}.
    it('should produce a valid Question object for a Numerical question with precision', () => {
        const input = `
        ::Q3:: What is the value of pi (to 3 decimal places)? {#3.1415:0.0005}
    `;
        const result = parse(input);

        // Type assertion to ensure result matches the Question interface
        const question = result[0];

        // Example assertions to check specific properties
        expect(question).toHaveProperty('type', 'Numerical');
        const numericalQuestion = question as NumericalQuestion;
        expect(numericalQuestion.title).toBe('Q3');
        expect(numericalQuestion.formattedStem.text).toBe('What is the value of pi (to 3 decimal places)?');
        expect(numericalQuestion.choices).toBeDefined();
        expect(numericalQuestion.choices).toHaveLength(1);
        expect(isRangeNumericalAnswer(numericalQuestion.choices[0])).toBe(true);

        const choice = numericalQuestion.choices[0] as RangeNumericalAnswer;
        expect(choice.type).toBe('range');
        expect(choice.number).toBe(3.1415);
        expect(choice.range).toBe(0.0005);
    });

    // What is the value of pi times -1 (to 3 decimal places)? {#-3.142..-3.141}
    it('should produce a valid Question object for a Numerical question with negative value', () => {
        const input = `
        ::Q4:: What is the value of pi times -1 (to 3 decimal places)? {#-3.142..-3.141}
        `;
        const result = parse(input);

        // Type assertion to ensure result matches the Question interface
        const question = result[0];

        // Example assertions to check specific properties
        expect(question).toHaveProperty('type', 'Numerical');
        const numericalQuestion = question as NumericalQuestion;
        expect(numericalQuestion.title).toBe('Q4');
        expect(numericalQuestion.formattedStem.text).toBe('What is the value of pi times -1 (to 3 decimal places)?');
        expect(numericalQuestion.choices).toBeDefined();
        expect(numericalQuestion.choices).toHaveLength(1);
        expect(isHighLowNumericalAnswer(numericalQuestion.choices[0])).toBe(true);

        const choice = numericalQuestion.choices[0] as HighLowNumericalAnswer;
        expect(choice.type).toBe('high-low');
        expect(choice.numberLow).toBe(-3.142);
        expect(choice.numberHigh).toBe(-3.141);
    });
    
    // When was Ulysses S. Grant born? {# =1822:0 =%50%1822:2}
    it('should produce a valid Question object for a Numerical question with multiple correct answers with different weights', () => {
        const input = `
        ::Q5:: When was Ulysses S. Grant born? {# =1822 =%50%1822:2 =%50%1820..1824}
        `;
        const result = parse(input);

        // Type assertion to ensure result matches the Question interface
        const question = result[0];

        // Example assertions to check specific properties
        expect(question).toHaveProperty('type', 'Numerical');
        const numericalQuestion = question as NumericalQuestion;
        expect(numericalQuestion.title).toBe('Q5');
        expect(numericalQuestion.formattedStem.text).toBe('When was Ulysses S. Grant born?');
        expect(numericalQuestion.choices).toBeDefined();
        expect(numericalQuestion.choices).toHaveLength(3);
        expect(isMultipleNumericalAnswer(numericalQuestion.choices[0])).toBe(true);

        const choices = numericalQuestion.choices as MultipleNumericalAnswer[];
        expect(choices).toBeDefined();
        expect(choices).toHaveLength(3);

        const answer1 = choices[0];
        expect(answer1.isCorrect).toBe(true);
        expect(answer1.weight).toBeUndefined();
        expect(answer1.formattedFeedback).toBeUndefined();
        expect(answer1.answer.type).toBe('simple');
        const answer1Text = answer1.answer as SimpleNumericalAnswer;
        expect(answer1Text.number).toBe(1822);

        const answer2 = choices[1];
        expect(answer2.isCorrect).toBe(true);
        expect(answer2.weight).toBe(50);
        expect(answer2.formattedFeedback).toBeUndefined();
        expect(answer2.answer.type).toBe('range');
        const answer2Text = answer2.answer as RangeNumericalAnswer;
        expect(answer2Text.number).toBe(1822);
        expect(answer2Text.range).toBe(2);

        const answer3 = choices[2];
        expect(answer3.isCorrect).toBe(true);
        expect(answer3.weight).toBe(50);
        expect(answer3.formattedFeedback).toBeUndefined();
        expect(answer3.answer.type).toBe('high-low');
        const answer3Text = answer3.answer as HighLowNumericalAnswer;
        expect(answer3Text.numberLow).toBe(1820);
        expect(answer3Text.numberHigh).toBe(1824);
        
    });
    
});

