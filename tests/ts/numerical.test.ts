import { parse } from "GIFT"; // Adjust the import based on your actual parser export
import { NumericalQuestion, MultipleNumericalAnswer, RangeNumericalAnswer, HighLowNumericalAnswer } from "../../types";
import { isSimpleNumericalAnswer, isRangeNumericalAnswer, isHighLowNumericalAnswer, isMultipleNumericalAnswer } from "../../types/typeGuards";
import exp from "constants";

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
        expect(numericalQuestion.stem.text).toBe('When was Ulysses S. Grant born?');
        expect(numericalQuestion.choices).toBeDefined();
        expect(numericalQuestion.choices).toHaveLength(1);

        const choice = numericalQuestion.choices[0];
        if (isSimpleNumericalAnswer(choice)) {
            expect(choice.type).toBe('simple');
            expect(choice.number).toBe(1822);
        }
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
        expect(numericalQuestion.stem.text).toBe('What is the value of pi (to 3 decimal places)?');
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
        expect(numericalQuestion.stem.text).toBe('What is the value of pi times -1 (to 3 decimal places)?');
        expect(numericalQuestion.choices).toBeDefined();
        expect(numericalQuestion.choices).toHaveLength(1);
        expect(isHighLowNumericalAnswer(numericalQuestion.choices[0])).toBe(true);

        const choice = numericalQuestion.choices[0] as HighLowNumericalAnswer;
        expect(choice.type).toBe('high-low');
        expect(choice.numberLow).toBe(-3.142);
        expect(choice.numberHigh).toBe(-3.141);
    });
    
    // it('should produce a valid Question object for a Numerical question with multiple answers', () => {
    //     const input = `
    //       ::Q7:: When was Ulysses S. Grant born? {
    //         =1822:0
    //         =1822:2%50%
    //       }
    //     `;
    //     const result = parse(input);
    
    //     // Type assertion to ensure result matches the Question interface
    //     const question = result[0];
    
    //     // Example assertions to check specific properties
    //     expect(question).toHaveProperty('type', 'Numerical');
    //     const numericalQuestion = question as NumericalQuestion;
    //     expect(numericalQuestion.stem.text).toBe('When was Ulysses S. Grant born?');
    //     expect(numericalQuestion.choices).toBeDefined();
    //     expect(numericalQuestion.choices).toHaveLength(2);
    
    //     const arrayChoices = numericalQuestion.choices as MultipleNumericalAnswer[];
    //     expect(arrayChoices[0].text.number).toBe(1822);
    //     expect(arrayChoices[0].text.range).toBe(0);
    //     expect(arrayChoices[1].text.number).toBe(1822);
    //     expect(arrayChoices[1].text.range).toBe(2);
    //     expect(arrayChoices[1].weight).toBe(50);
    // });
    
});

