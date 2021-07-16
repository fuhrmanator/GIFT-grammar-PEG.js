# GIFT-grammar-PEG.js

<img src="https://www.etsmtl.ca/getmedia/36ccff85-3834-443c-b78f-992c2b998915/Logo_ETS_SansTypo_EN" width="100">

### Status

[![Build Status](https://travis-ci.org/fuhrmanator/GIFT-grammar-PEG.js.svg?branch=master)](https://travis-ci.org/fuhrmanator/GIFT-grammar-PEG.js)

Development of PEG grammar to parse [GIFT (quiz question) file format](https://en.wikipedia.org/wiki/GIFT_(file_format)). The goal is to find an intuitive and fun way to create quiz questions.

Initial hacking done using [pegjs.org/online](https://pegjs.org/online). The GIFT.pegjs file goes on the left and the test GIFT goes on the right. Note that nothing is saved in this environment (you must copy-paste back to your own files).

## GIFT parser (npm package gift-pegjs)

The PEG.js grammar in this repo is used to generate a parser for GIFT. You can see how it works in this [online editor](https://fuhrmanator.github.io/GIFT-grammar-PEG.js/editor/editor.html).

## Software using the parser

- [GIFT Format Extension For Visual Studio Code](https://github.com/ethan-ou/vscode-gift/) by Ethan Ou.
- Validate GIFT questions with this [online GIFT editor](https://fuhrmanator.github.io/GIFT-grammar-PEG.js/editor/editor.html).
- Create quizzes in Google Forms using the [GIFT Quiz Editor (Google Forms add-on)](https://gsuite.google.com/marketplace/app/gift_quiz_editor/1038395345285). It's possible to export questions from Moodle in GIFT format and re-use them in Google Forms, or you can create your own questions in GIFT to save clicking in the Google interface. Google Quizzes are not able to support all GIFT question types, however.

## For developers

### Install

For simple web applications, copy the [`pegjs-gift.js`](https://raw.githubusercontent.com/fuhrmanator/GIFT-grammar-PEG.js/master/pegjs-gift.js) file into your project.

For modern Javascript development, install the library using npm:

```
npm install gift-pegjs
```

### Usage

Importing the NPM library in ES6+ Javascript (recommended):
```javascript
import { parse } from "gift-pegjs";

const question = "What is the value of pi (to 3 decimal places)? {#3.141..3.142}."

const quiz = parse(question)
```

Importing the library for simple web applications:
```javascript
import { parse } from "./pegjs-gift"; // Change path depending on where the file is copied.

const question = "What is the value of pi (to 3 decimal places)? {#3.141..3.142}."

const quiz = parse(question)
```

Importing the NPM library in CommonJS (for use in Node.js applications):
```javascript
const parse = require("gift-pegjs");

const question = "What is the value of pi (to 3 decimal places)? {#3.141..3.142}."

const quiz = parse(question)
```

Using the optional Typescript types:
```typescript
import { parse, GIFTQuestion } from "gift-pegjs";

const question: string = "What is the value of pi (to 3 decimal places)? {#3.141..3.142}."

const quiz: GIFTQuestion[] = parse(question)
```

### Example

```javascript
import { parse } from "gift-pegjs";

let sampleQuestion = `
Is this True? {T}

Mahatma Gandhi's birthday is an Indian holiday on {
~15th
~3rd
=2nd
} of October.

Since {
  ~495 AD
  =1066 AD
  ~1215 AD
  ~ 43 AD
} the town of Hastings England has been "famous with visitors".

What is the value of pi (to 3 decimal places)? {#3.141..3.142}.
`;

const quizQuestions = parse(sampleQuestion);
console.log(quizQuestions);

```

### Tests
There are [easily extendible tests using Mocha](https://mochajs.org/#dynamically-generating-tests) from sample GIFT/JSON files in `./test/questions/`.

To be able to run the tests, you must set up your environment:
- [Install node.js](https://nodejs.org/)
- Clone this repo.
- Install the node.js dependencies for this project. Inside the root directory of this repo, type: 

        npm install .

- Run the regression tests with the following command: 
 
        npm test
- Output will look something like this:
 
 		$ npm test

		> gift-grammar-pegjs@1.0.0 test C:\Users\fuhrm\Documents\GitHub\GIFT-grammar-PEG.js
		> mocha tests --recursive



		  GIFT parser harness:
			√ parsing GIFT question: ./tests/questions/description1.gift
			√ parsing GIFT question: ./tests/questions/essay1.gift
			√ parsing GIFT question: ./tests/questions/giftFormatPhpExamples.gift
			√ parsing GIFT question: ./tests/questions/matching1.gift
			√ parsing GIFT question: ./tests/questions/mc1.gift
			√ parsing GIFT question: ./tests/questions/mc2.gift
			√ parsing GIFT question: ./tests/questions/mc3.gift
			√ parsing GIFT question: ./tests/questions/mc4.gift
			√ parsing GIFT question: ./tests/questions/mc5.gift
			√ parsing GIFT question: ./tests/questions/multiLineFeedback1.gift
			√ parsing GIFT question: ./tests/questions/numerical1.gift
			√ parsing GIFT question: ./tests/questions/options1.gift
			√ parsing GIFT question: ./tests/questions/shortAnswer1.gift
			√ parsing GIFT question: ./tests/questions/tf1.gift
			√ parsing GIFT question: ./tests/questions/tf2.gift


		  15 passing (225ms)

- To create a new test GIFT file, just name it `foo.gift` in `./test/questions/`. The JSON file `foo.json` should exist (expected output) and can be easily generated from the output at https://pegjs.org/online. Note: any `undefined` values from that output must be declared as `null` in the JSON file.

## GIFT format

*General Import Format Technology* (GIFT) is described at several places, but it's hard to know what the definitive source is.

This table is not sufficient to understand everything. Please see [Moodle's documentation](https://docs.moodle.org/en/GIFT_format) and [this reference](http://buypct.com/gift_reference.pdf) for many more details.

| Symbols	| Use |
| ------- | ----- |
| `//` *text*	| Comment until end of line (optional) | 
|  `::`*title*`::`	| Question title (optional) | 
| *text*	| Question text (becomes title if no title specified)| 
| `[`*format*`]`	| The *format* of the following bit of text. Options are `[html]`, `[moodle]`, `[plain]` and `[markdown]`. The default is `[moodle]` for the question text, other parts of the question default to the format used for the question text. | 
| `{`	| Start answer(s) -- without any answers, text is a description of following questions | 
| `{T}` or `{F}`	|  True or False answer; also `{TRUE}` and `{FALSE}` | 
| `{` ... `=`*right* ... `}`	| Correct answer for multiple choice, (multiple answer? -- see page comments) or fill-in-the-blank| 
| `{` ... `~`*wrong* ... `}`	| Incorrect answer for multiple choice or multiple answer| 
| `{` ... `=`*item* `->` *match* ... `}`	| Answer for matching questions| 
| `#`*feedback text*	| Answer feedback for preceding multiple, fill-in-the-blank, or numeric answers| 
| `####`*general feedback*	| General feedback| 
| `{#`	| Start numeric answer(s)| 
| &nbsp;&nbsp;&nbsp;&nbsp;*answer*`:`*tolerance*	| Numeric answer accepted within ± tolerance range| 
| &nbsp;&nbsp;&nbsp;&nbsp;*low*`..`*high*	| Lower and upper range values of accepted numeric answer| 
| &nbsp;&nbsp;&nbsp;&nbsp;`=%`*n*`%`*answer*`:`*tolerance*	| n percent credit for one of multiple numeric ranges within tolerance from answer| 
| `}`	| End answer(s)| 
| `\`*character*	| Backslash escapes the special meaning of `~`, `=`, `#`, `{`, `}`, and `:`| 
| `\n`	| Places a newline in question text -- blank lines delimit questions| 

[Source for above table](http://microformats.org/wiki/gift)

## Background information

See these discussions in the Moodle forums: 

- [Deriving a Formal GIFT Specification](https://moodle.org/mod/forum/discuss.php?d=259533) 
	- [Creating 100 multichoice questions is quicker using GIFT.](https://moodle.org/mod/forum/discuss.php?d=259533#p1177669) --[Derek Chirnside](https://moodle.org/user/view.php?id=191052&course=5)
- [Suggesting using PEG.js with the GIFT spec](https://moodle.org/mod/forum/discuss.php?d=346431)

See this [test file from Moodle's code base](https://git.moodle.org/gw?p=moodle.git;a=blob;f=question/format/gift/examples.txt;h=e65d4f0db6415e2f318f1d024864b33c75f80c69;hb=refs/heads/MOODLE_26_STABLE).

## Class model for Moodle questions (quiz) format

The following UML class diagram is an interpretation of the XML format for Moodle quiz import/export. Note that the XML format is naive, e.g., the `QUESTION` tag is overloaded using `TYPE=` and as such can't easily be schema-tized. The interpretation below aims to facilitate the understanding of the content and relations. It's a domain model reverse-engineered from a data model.

![UML class diagram (domain model) loosely based on XML structure](https://www.plantuml.com/plantuml/proxy?cache=no&https://raw.githubusercontent.com/fuhrmanator/GIFT-grammar-PEG.js/master/Moodle%20Question%20Domain%20Model.puml)

## Railroad diagram of the grammar

Check out the [railroad diagram](https://dundalek.com/grammkit/#https://raw.githubusercontent.com/fuhrmanator/GIFT-grammar-PEG.js/master/GIFT.pegjs) for this project's PEG.

## Testing the editor locally

- In a terminal of the cloned repo: `node server.js`
- Point a browser to http://localhost:8181/docs/editor/editor.html
