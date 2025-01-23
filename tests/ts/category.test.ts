import { parse } from "GIFT";
import { Category } from "index";

describe('Category Question Parser', () => {
    it('should parse category-type question correctly', () => {
        const input = `
            // question: 0  name: Switch category to $course$/top/Défaut pour S20201-MGL804-01/Lehman
            $CATEGORY: $course$/top/Défaut pour S20201-MGL804-01/Lehman
`;

        try {
            const result = parse(input);
            const expected: Category = {
                type: 'Category',
                title: '$course$/top/Défaut pour S20201-MGL804-01/Lehman',
            };
            expect(result[0].type).toEqual('Category');
            expect([result[0] as Category]).toEqual(expected);
        } catch (error) {
            console.log(JSON.stringify(error, null, 2));
        }

    });
});
