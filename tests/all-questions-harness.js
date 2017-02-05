var peg = require('pegjs');
var assert = require('assert');
// var test = require('unit.js');
// var assert = test.assert;

//const assert = require('assert');
const fs = require('fs'); 
const questionsFolder = './tests/questions/';
const glob = require("glob"); 
const util = require('util');

describe('GIFT parser harness: ', () => {
    before(function () {
        // read grammar and create parser
        var grammar = fs.readFileSync('GIFT.pegjs', 'utf-8');
        this.parser = peg.generate(grammar);
        //console.log("inside before():");
    });

    // read the set of questions/parsings data files
    var files = glob.sync(questionsFolder + "*.gift", { nonull: true });

    files.forEach(function (file) {
        it('parsing GIFT question: ' + file, function () {
            var jsonFile = file.substr(0, file.lastIndexOf('.')) + ".json";
            var giftText = fs.readFileSync(file, 'utf-8');
            //console.log("GIFT text: '" + giftText + "'");
            var jsonText = fs.readFileSync(jsonFile, 'utf-8');
            //console.log("JSON text: '" + jsonText + "'");
            var jsonParse = JSON.parse(jsonText);
            var parsing = this.parser.parse(giftText);
            //console.log("GIFT parsing: '" + parsing + "'");

            assert.deepEqual(parsing, jsonParse, "Deep equal does not match");
        });
    });

});
