import { expectType, expectError } from 'tsd';
import { Category, Description, Essay, GIFTQuestion, Matching, MultipleChoice, Numerical, parse, ShortAnswer, SyntaxError, TrueFalse } from ".";

expectType<GIFTQuestion[]>(parse('Text'));

const questions = parse("Text");

for (const question of questions) {
    switch (question.type) {
        case "Category":
            expectType<Category>(question);
            break;
        case "Description":
            expectType<Description>(question);
            break;
        case "MC":
            expectType<MultipleChoice>(question);
            break;
        case "Numerical":
            expectType<Numerical>(question);
            break;
        case "Short":
            expectType<ShortAnswer>(question);
            break;
        case "Essay":
            expectType<Essay>(question);
            break;
        case "TF":
            expectType<TrueFalse>(question);
            break;
        case "Matching":
            expectType<Matching>(question);
            break;
        default:
            break;
    }
}

const multipleChoiceObject: MultipleChoice = {
    id: null,
    tags: null,
    type: "MC",
    title: null,
    stem: { format: "markdown", text: "Who's buried in Grant's \r\n tomb?" },
    hasEmbeddedAnswers: false,
    globalFeedback: {
        format: "moodle",
        text:
            "Not sure?."
    },
    choices: [
        {
            isCorrect: false,
            weight: -50,
            text: { format: "moodle", text: "Grant" },
            feedback: null
        },
        {
            isCorrect: true,
            weight: 50,
            text: { format: "moodle", text: "Jefferson" },
            feedback: null
        },
        {
            isCorrect: true,
            weight: 50,
            text: { format: "moodle", text: "no one" },
            feedback: null
        }
    ]
};

expectType<MultipleChoice>(multipleChoiceObject)