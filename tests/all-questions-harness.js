const peg = require('pegjs');
const fs = require('fs');
const glob = require('glob');
const parse = require('../lib/gift-parser').parse;

const questionsFolder = './tests/questions/';
const files = glob.sync(questionsFolder + '*.gift', { nonull: true });

const parserGeneratedFromGrammar = peg.generate(fs.readFileSync('GIFT.pegjs', 'utf-8'));

describe(`GIFT question types`, () => {
    files.forEach((file) => {

        it(`parses GIFT (${questionsFolder}): ${file.substring(questionsFolder.length-2)}`, () => {
            const jsonFile = file.substring(0, file.lastIndexOf('.')) + '.json';
            const giftText = fs.readFileSync(file, 'utf-8');
            const jsonText = fs.readFileSync(jsonFile, 'utf-8');
            const jsonParse = JSON.parse(jsonText);
            const parsingDirectFromGrammar = parserGeneratedFromGrammar.parse(giftText);
            expect(parsingDirectFromGrammar).toEqual(jsonParse);
            const parsingFromGeneratedParser = parse(giftText);
            expect(parsingFromGeneratedParser).toEqual(jsonParse);
        });
    });
});
