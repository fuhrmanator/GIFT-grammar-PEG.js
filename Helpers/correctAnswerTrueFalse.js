const { parse } = require("../pegjs-gift.js");

function checkTrueFalseAnswer(giftText, studentAnswer) {
  var questions = parse(giftText);

  if (questions.length === 0 || questions[0].type !== "TF") {
    throw new Error("Not a True/False question");
  }

  var question = questions[0];
  // var isCorrect = studentAnswer === question.isTrue;
  var isCorrect = question.isCorrect(studentAnswer);
  var feedback = studentAnswer ? question.trueFeedback : question.falseFeedback;

  return {
    question: question,
    isCorrect: isCorrect,
    correctAnswer: question.isTrue,
    feedback: feedback ? feedback.text : null,
    globalFeedback: question.globalFeedback ? question.globalFeedback.text : null
  };
}

module.exports = checkTrueFalseAnswer;
