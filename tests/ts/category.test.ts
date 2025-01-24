import { parse } from "gift-pegjs";
import { Category } from "index";

describe('Category Question Parser', () => {
    it('should parse category-type question correctly', () => {
        const input = `
            // question: 0  name: Switch category to $course$/top/Défaut pour S20201-MGL804-01/Lehman
            $CATEGORY: $course$/top/Défaut pour S20201-MGL804-01/Lehman
`;

        let result;
        try {
            result = parse(input);
        } catch (error) {
            console.log(JSON.stringify(error, null, 2));
        }
        const expected: Category = {
            type: 'Category',
            title: '$course$/top/Défaut pour S20201-MGL804-01/Lehman',
        };
        expect(result && result[0] && result[0].type).toEqual('Category');
        expect(result && result[0] as Category).toEqual(expected);

    });
});
