const peg = require('pegjs');
const fs = require('fs');
const glob = require('glob');
// const { describe } = require('node:test');

// read the set of questions/parsings data files
const questionsFolder = './tests/questions/';
const files = glob.sync(questionsFolder + '*.gift', { nonull: true });

let parser;

describe(`GIFT question types`, () => {
    files.forEach((file) => {
        const grammar = fs.readFileSync('GIFT.pegjs', 'utf-8');
        parser = peg.generate(grammar);

        it(`parses GIFT (${questionsFolder}): ${file.substr(questionsFolder.length)}`, () => {
            const jsonFile = file.substr(0, file.lastIndexOf('.')) + '.json';
            const giftText = fs.readFileSync(file, 'utf-8');
            const jsonText = fs.readFileSync(jsonFile, 'utf-8');
            const jsonParse = JSON.parse(jsonText);
            const parsing = parser.parse(giftText);

            expect(parsing).toEqual(jsonParse);
        });
    });
});
