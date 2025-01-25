import { parse, MatchingQuestion } from "gift-pegjs";

describe('Matching Question Tests', () => {
    it('should parse a basic matching question', () => {
        const input = `
            Match the following countries with their corresponding capitals. {
                =Canada -> Ottawa
                =Italy  -> Rome
                =Japan  -> Tokyo
                =India  -> New Delhi
            }
        `;
        const result = parse(input);
        const question = result[0] as MatchingQuestion;

        expect(question.type).toBe('Matching');
        expect(question.formattedStem.text).toBe('Match the following countries with their corresponding capitals.');
        expect(question.matchPairs).toHaveLength(4);
        expect(question.matchPairs[0]).toEqual({
            formattedSubquestion: { format: 'moodle', text: 'Canada' },
            subanswer: 'Ottawa'
        });
    });

    it('should parse a matching question with tags and title', () => {
        const input = `
            // [tag:tag1] [tag:tag2]
            ::Geography:: Match these countries. {
                =Canada -> Ottawa
                =Italy  -> Rome
            }
        `;
        const result = parse(input);
        const question = result[0] as MatchingQuestion;

        expect(question.type).toBe('Matching');
        expect(question.title).toBe('Geography');
        expect(question.tags).toEqual(['tag1', 'tag2']);
        expect(question.matchPairs).toHaveLength(2);
    });

    it('should parse a matching question with formatted text', () => {
        const input = `
            [html]<p>Match the following\\:</p> {
                =[html]<b>Canada</b> -> Ottawa
                =[html]<b>Italy</b>  -> Rome
            }
        `;
        const result = parse(input);
        const question = result[0] as MatchingQuestion;

        expect(question.formattedStem.format).toBe('html');
        expect(question.matchPairs[0].formattedSubquestion.format).toBe('html');
        expect(question.matchPairs[0].formattedSubquestion.text).toBe('<b>Canada</b>');
    });
});
