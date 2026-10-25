const parse = require('../lib/gift-parser').parse;

describe('calculateScore function', () => {
  
  describe('TrueFalse questions', () => {
    it('should return 100 when user answer is correct (True)', () => {
      const giftText = `:: True Question ::
Is this true? {T}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.type).toBe('TF');
      expect(question.calculateScore).toBeDefined();
      expect(question.calculateScore(true)).toBe(100);
      expect(question.calculateScore(false)).toBe(0);
    });

    it('should return 100 when user answer is correct (False)', () => {
      const giftText = `:: False Question ::
Is this false? {F}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.type).toBe('TF');
      expect(question.calculateScore).toBeDefined();
      expect(question.calculateScore(false)).toBe(100);
      expect(question.calculateScore(true)).toBe(0);
    });

    it('should work with expanded format (TRUE)', () => {
      const giftText = `:: Question ::
Is this true? {TRUE}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.calculateScore(true)).toBe(100);
      expect(question.calculateScore(false)).toBe(0);
    });

    it('should work with expanded format (FALSE)', () => {
      const giftText = `:: Question ::
Is this false? {FALSE}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.calculateScore(false)).toBe(100);
      expect(question.calculateScore(true)).toBe(0);
    });
  });

  describe('Multiple Choice questions', () => {
    it('should return 100 for single correct answer', () => {
      const giftText = `:: Multiple Choice ::
Which is correct? {=Correct ~Wrong1 ~Wrong2}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.type).toBe('MC');
      expect(question.calculateScore).toBeDefined();
      
      const correctChoice = question.choices.find(c => c.isCorrect);
      const score = question.calculateScore([correctChoice]);
      expect(score).toBe(100);
    });

    it('should return 0 for incorrect answer', () => {
      const giftText = `:: Multiple Choice ::
Which is correct? {=Correct ~Wrong1 ~Wrong2}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      
      const incorrectChoice = question.choices.find(c => !c.isCorrect);
      const score = question.calculateScore([incorrectChoice]);
      expect(score).toBe(0);
    });

    it('should handle weighted answers', () => {
      const giftText = `:: Multiple Choice with Weights ::
Select all that apply? {=%50%Partially Correct ~Wrong =%50%Also Partial}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      
      // Get the weighted correct choice
      const partialChoice = question.choices.find(c => c.weight === 50);
      const score = question.calculateScore([partialChoice]);
      expect(score).toBe(50);
    });

    it('should accumulate scores for multiple selections', () => {
      const giftText = `:: Multiple Choice with Weights ::
Select all that apply? {=%50%Partially Correct ~Wrong =%50%Also Partial}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      
      // Get both weighted correct choices
      const partialChoices = question.choices.filter(c => c.weight === 50);
      const score = question.calculateScore(partialChoices);
      expect(score).toBe(100);
    });

    it('should return 0 for empty selection', () => {
      const giftText = `:: Multiple Choice ::
Which is correct? {=Correct ~Wrong1 ~Wrong2}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      
      const score = question.calculateScore([]);
      expect(score).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      const giftText = `:: Multiple Choice ::
Which is correct? {=Correct ~Wrong1 ~Wrong2}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      
      const score = question.calculateScore(undefined);
      expect(score).toBe(0);
    });
  });

  describe('Short Answer questions', () => {
    it('should have calculateScore function', () => {
      const giftText = `:: Short Answer ::
What is 2+2? {=4}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.type).toBe('Short');
      expect(question.calculateScore).toBeDefined();
    });

    it('should return 100 for correct short answer', () => {
      const giftText = `:: Short Answer ::
What is 2+2? {=4}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      
      const correctChoice = question.choices.find(c => c.isCorrect);
      const score = question.calculateScore([correctChoice]);
      expect(score).toBe(100);
    });
  });

});
