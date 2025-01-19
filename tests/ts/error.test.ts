import { parse } from "GIFT"; 
import { isPegjsParseError } from "../../types/typeGuards";

describe('Error in GIFT syntax', () => {
  it('should produce an error indicating a problem in a True False question', () => {
    const input = `
      The sun rises in the east. {T)
    `;
    try {
        // This will thow an error because the input is not a valid GIFT question
        const result = parse(input);
    } catch (error) {
        if (isPegjsParseError(error)) {
            expect(error.message).toBe('Expected "}" but ")" found.');
            expect(error.location.start.column).toBe(36);
            expect(error.location.start.line).toBe(2);
            expect(error.location.start.offset).toBe(36);
            expect(error.location.end.column).toBe(37);
            expect(error.location.end.line).toBe(2);
            expect(error.location.end.offset).toBe(37);
        } else {
            throw error;
        }
    }


  });
});

