import { parse, PegjsParseError } from "gift-pegjs";
import { isPegjsParseError } from "gift-pegjs/typeGuards";

describe('Error in GIFT syntax', () => {
  it('should produce an error indicating a problem in a True False question', () => {
    const input = `
      The sun rises in the east. {T)
    `;
    try {
      // This will throw an error because the input is not a valid GIFT question
      const result = parse(input);
    } catch (error) {
      if (isPegjsParseError(error)) {
        const parseError = error as PegjsParseError;
        expect(parseError.message).toBe('Expected "}" but ")" found.');
        expect(parseError.location.start.column).toBe(36);
        expect(parseError.location.start.line).toBe(2);
        expect(parseError.location.start.offset).toBe(36);
        expect(parseError.location.end.column).toBe(37);
        expect(parseError.location.end.line).toBe(2);
        expect(parseError.location.end.offset).toBe(37);
      } else {
        throw error;
      }
    }


  });
});

