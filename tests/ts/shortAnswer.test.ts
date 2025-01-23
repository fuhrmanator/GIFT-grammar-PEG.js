import { parse } from "GIFT";
import { ShortAnswerQuestion } from "../../types";
import exp from "constants";

describe('Short Answer Question Tests', () => {
  it('should parse a basic short answer question', () => {
    const input = `
      ::Q1:: Who's buried in Grant's tomb? {=Grant =Ulysses S. Grant}
    `;
    const result = parse(input);
    const question = result[0] as ShortAnswerQuestion;

    expect(question.type).toBe('Short');
    expect(question.formattedStem.text).toBe("Who's buried in Grant's tomb?");
    expect(question.choices).toHaveLength(2);
    expect(question.choices[0].text).toBe('Grant');
    expect(question.choices[1].text).toBe('Ulysses S. Grant');
  });

  it('should handle case sensitivity in answers', () => {
    const input = `
      ::Q2:: What's the first name of the inventor of C++? {=Bjarne =%0%Bjorn#Close, but not right}
    `;
    const result = parse(input);
    const question = result[0] as ShortAnswerQuestion;
    expect(question.choices).toHaveLength(2);
    expect(question.choices[0].text).toBe('Bjarne');
    expect(question.choices[0].isCorrect).toBe(true);
    expect(question.choices[1].text).toBe('Bjorn');
    expect(question.choices[1].isCorrect).toBe(true);
    expect(question.choices[1].weight).toBe(0);
    expect(question.choices[1].formattedFeedback?.text).toBe('Close, but not right');
  });
});
