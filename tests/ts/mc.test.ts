import { parse, MultipleChoiceQuestion } from "gift-pegjs"; // Adjust the import based on your actual parser export

describe('Multiple Choice Question Tests', () => {
  it('should produce a valid Question object for a Multiple Choice question', () => {
    const input = `
      // [tag:math]
      ::Q2::[markdown] What is $2+2$? {
        ~%-50% 3
        ~%50%[markdown] 4
        ~%-50%[html] 5
      ####General formattedFeedback}
    `;
    const result = parse(input);

    expect(result[0].type).toBe('MC');

    const mcQuestion = result[0] as MultipleChoiceQuestion;

    expect(mcQuestion.title).toBeDefined();
    expect(mcQuestion.title).toEqual('Q2');
    expect(mcQuestion.tags).toBeDefined();
    expect(mcQuestion.tags?.length).toBe(1);
    expect(mcQuestion.tags && mcQuestion.tags[0]).toEqual('math');
    expect(mcQuestion.formattedStem).toBeDefined();
    expect(mcQuestion.formattedStem.format).toEqual('markdown');
    expect(mcQuestion.formattedStem.text).toEqual('What is $2+2$?');
    expect(mcQuestion.choices).toBeDefined();
    expect(mcQuestion.choices.length).toBe(3);
    expect(mcQuestion.choices[0].isCorrect).toBe(false);
    expect(mcQuestion.choices[0].weight).toBe(-50); 
    expect(mcQuestion.choices[0].formattedText.format).toEqual('markdown');
    expect(mcQuestion.choices[0].formattedText.text).toEqual('3');
    expect(mcQuestion.choices[1].isCorrect).toBe(false);
    expect(mcQuestion.choices[1].weight).toBe(50);
    expect(mcQuestion.choices[1].formattedText.format).toEqual('markdown');
    expect(mcQuestion.choices[1].formattedText.text).toEqual('4');
    expect(mcQuestion.choices[2].isCorrect).toBe(false);
    expect(mcQuestion.choices[2].weight).toBe(-50);
    expect(mcQuestion.choices[2].formattedText.format).toEqual('html');
    expect(mcQuestion.choices[2].formattedText.text).toEqual('5');
  });
});
