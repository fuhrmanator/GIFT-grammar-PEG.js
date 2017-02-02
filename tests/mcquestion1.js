var peg = require('pegjs');
//var assert = require('assert');
var test = require('unit.js');
var assert = test.assert;
var fs = require('fs'); // for loading files

describe('GIFT parser', function () {
	before(function () {
		this.grammar = fs.readFileSync('GIFT.pegjs', 'utf-8');
		this.parser = peg.generate(this.grammar);
		this.input = "Grant is {~buried =entombed ~living} in Grant's tomb."; // should read from file?
		this.parsing = this.parser.parse(this.input);
		this.expected = [{
				"type": "MC",
				"title": null,
				"stem": "Grant is  _____ in Grant's tomb.",
				"hasEmbeddedAnswers": true,
				"choices": [{
						"isCorrect": false,
						"weight": null,
						"text": "buried =entombed ",
						"feedback": null
					}, {
						"isCorrect": false,
						"weight": null,
						"text": "living",
						"feedback": null
					}
				]
			}
		];
	});
	//	beforeEach(function () {
	//	});
	// it('Types should match', function () {
		// assert.equal(parsing.type, expected.type, "Types do not match");
	// });
	it('should match expected object after parsing', function () {
		assert.deepEqual(this.parsing, this.expected, "Deep equal does not match");
	});
});
