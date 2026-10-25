const parse = require('../lib/gift-parser').parse;

describe('isCorrect function', () => {
  describe('TrueFalse questions', () => {
    it('doit retourner true quand la réponse de l’utilisateur est correcte (Vrai)', () => {
      const giftText = `:: True Question ::
Is this true? {T}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.type).toBe('TF');
      expect(question.isCorrect).toBeDefined();
      expect(question.isCorrect(true)).toBe(true);
      expect(question.isCorrect(false)).toBe(false);
    });

    it('doit retourner true quand la réponse de l’utilisateur est correcte (Faux)', () => {
      const giftText = `:: False Question ::
Is this false? {F}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.type).toBe('TF');
      expect(question.isCorrect).toBeDefined();
      expect(question.isCorrect(false)).toBe(true);
      expect(question.isCorrect(true)).toBe(false);
    });

    it('fonctionne avec le format étendu (TRUE)', () => {
      const giftText = `:: Question ::
Is this true? {TRUE}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.isCorrect(true)).toBe(true);
      expect(question.isCorrect(false)).toBe(false);
    });

    it('fonctionne avec le format étendu (FALSE)', () => {
      const giftText = `:: Question ::
Is this false? {FALSE}
`;
      const result = parse(giftText);
      expect(result).toHaveLength(1);
      const question = result[0];
      expect(question.isCorrect(false)).toBe(true);
      expect(question.isCorrect(true)).toBe(false);
    });
  });
});
