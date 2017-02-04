var peg = require('pegjs');
//var assert = require('assert');
var test = require('unit.js');
var assert = test.assert;
const fs = require('fs'); // for loading files
const questionsFolder = './tests/questions/';
const glob = require("glob");
const util = require('util')

require('it-each')({ testPerIteration: false });

var dataFilesList = []; //, copyOfFiles;

glob(questionsFolder + "*.txt", { nonull: true }, function (er, files) {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
    // console.log("files:\n", JSON.stringify(files, null, 4));
    // copyOfFiles = files;
    // console.log("copyOfFiles:\n", JSON.stringify(copyOfFiles, null, 4));
    // console.log("copyOfFiles:\n", util.inspect(copyOfFiles, true, null));
    files.forEach(file => {
        dataFilesList.push("" + file);  // deep copy (?)
    });
    // console.log("dataFilesList:\n", JSON.stringify(dataFilesList, null, 4));
    //console.log("inside glob (dataFilesList): ", dataFilesList);

});


describe('GIFT parser harness: ', function () {
    before(function () {
        // read grammar and create parser
        this.grammar = fs.readFileSync('GIFT.pegjs', 'utf-8');
        this.parser = peg.generate(this.grammar);
        // read the set of questions/parsings data files
        //console.log("inside before():" + dataFilesList);

    });
    beforeEach(function () {
        // read each input question and its corresponding JSON (expected) parse
        // this.giftText = fs.readFileSync(giftFile, 'utf-8');
        // this.jsonText = fs.readFileSync(jsonFile, 'utf-8');
        // // perform parse on question
        // this.parsing = this.parser.parse(this.giftText);
    });

    it.each(dataFilesList, 'Testing GIFT question: %s', ['element'], function (element, next) {
//        console.log("copyOfFiles:\n", util.inspect(copyOfFiles, true, null));
//        console.log("copyOfFiles:\n", JSON.stringify(copyOfFiles, null, 4));
        //console.log("inside it: ", element);
        //console.log("inside it: ", dataFilesList);
        var jsonFile = element.substr(0, element.lastIndexOf('.')) + ".json";
        var giftText = fs.readFileSync(element, 'utf-8');
        //console.log("GIFT text: '" + giftText + "'");
        var jsonText = fs.readFileSync(jsonFile, 'utf-8');
        //console.log("JSON text: '" + jsonText + "'");
        var jsonParse = JSON.parse(jsonText);
        var parsing = this.parser.parse(giftText);
        //console.log("GIFT parsing: '" + parsing + "'");
        
        assert.deepEqual(parsing, jsonParse, "Deep equal does not match");
        next();
    });

});
