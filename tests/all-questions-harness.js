const peg = require('pegjs');
const fs = require('fs');
const glob = require('glob');
const parse = require('../lib/gift-parser').parse;

const questionsFolder = './tests/questions/';
const files = glob.sync(questionsFolder + '*.gift', { nonull: true });

const parserGeneratedFromGrammar = peg.generate(fs.readFileSync('GIFT.pegjs', 'utf-8'));

// Helper function to remove functions from objects for JSON comparison
function stripFunctions(obj) {
  if (Array.isArray(obj)) {
    return obj.map(stripFunctions);
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned = {};
    for (const key in obj) {
      if (typeof obj[key] !== 'function') {
        cleaned[key] = stripFunctions(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
}

describe(`GIFT question types`, () => {
    files.forEach((file) => {

        it(`parses GIFT (${questionsFolder}): ${file.substring(questionsFolder.length-2)}`, () => {
            const jsonFile = file.substring(0, file.lastIndexOf('.')) + '.json';
            const giftText = fs.readFileSync(file, 'utf-8');
            const jsonText = fs.readFileSync(jsonFile, 'utf-8');
            const jsonParse = JSON.parse(jsonText);
            const parsing1 = parserGeneratedFromGrammar.parse(giftText);
            expect(stripFunctions(parsing1)).toEqual(jsonParse);
            const parsing2 = parse(giftText);
            expect(stripFunctions(parsing2)).toEqual(jsonParse);
        });
    });
});
