var peg = require('pegjs');
var assert = require('assert');
const fs = require('fs'); 
const questionsFolder = './tests/questions/';
const glob = require("glob"); 

describe('GIFT parser harness: ', () => {
    before(function () {
        // read grammar and create parser
        var grammar = fs.readFileSync('GIFT.pegjs', 'utf-8');
        this.parser = peg.generate(grammar);
    });

    // read the set of questions/parsings data files
    var files = glob.sync(questionsFolder + "*.gift", { nonull: true });

    files.forEach(function (file) {
        it('parsing GIFT question: ' + file, function () {
            var jsonFile = file.substr(0, file.lastIndexOf('.')) + ".json";
            var giftText = fs.readFileSync(file, 'utf-8');
            var jsonText = fs.readFileSync(jsonFile, 'utf-8');
            var jsonParse = JSON.parse(jsonText);
            var parsing = this.parser.parse(giftText);

            assert.deepEqual(parsing, jsonParse, "Deep equal does not match");
        });
    });

});
