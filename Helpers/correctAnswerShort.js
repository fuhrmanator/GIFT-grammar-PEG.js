const { parse } = require("../pegjs-gift.js");

/**
 * Vérifie une réponse pour une question Short (ShortAnswer).
 * La réponse de l'étudiant est une chaîne unique (pas un tableau).
 * Compare case-insensitively et retourne le score/poids du choix trouvé.
 * 
 * Note: Une question Short peut avoir plusieurs variantes de réponse correcte
 * avec des poids différents (e.g., {=%100%Paris =%75%Paree =%50%Capitale})
 */
function checkShortAnswer(giftText, studentSelection) {
  const questions = parse(giftText);
  if (questions.length === 0 || questions[0].type !== "Short") {
    throw new Error("Not a Short question");
  }

  const question = questions[0];
  const correctOptions = (question.choices || []).filter(c => c.isCorrect);

  // Validation: question must have at least one choice
  const hasChoices = Array.isArray(question.choices) && question.choices.length > 0;
  const questionValidationError = hasChoices ? null : 'No answer choices provided';

  // Validation: question must have a correct answer defined
  const hasCorrectAnswer = correctOptions.length > 0;
  const answerValidationError = hasCorrectAnswer ? null : 'No correct answer defined for this question';

  // Initialize default values
  let matchedChoice = null;
  let studentText = '';
  let score = 0;
  let feedback = null;

  // Process student answer if provided
  if (studentSelection !== undefined && studentSelection !== null) {
    studentText = String(studentSelection).trim();
    const studentTextLower = studentText.toLowerCase();

    // Find matching choice (case-insensitive)
    if (hasChoices) {
      matchedChoice = question.choices.find(c => 
        c && c.text && c.text.text && 
        String(c.text.text).toLowerCase() === studentTextLower
      ) || null;
    }

    // Return weight of matched choice (default 100 when weight is null/undefined)
    if (matchedChoice) {
      const weight = (typeof matchedChoice.weight === 'number') ? matchedChoice.weight : 100;
      score = Math.min(100, Math.max(-100, weight));
    }

    feedback = matchedChoice && matchedChoice.feedback ? matchedChoice.feedback.text : null;
  }

  const isCorrect = score > 0;

  return {
    question: question,
    score: score,
    isCorrect: isCorrect,
    selected: matchedChoice,
    questionHasChoices: hasChoices,
    questionValidationError: questionValidationError,
    hasCorrectAnswer: hasCorrectAnswer,
    answerValidationError: answerValidationError,
    correctChoices: correctOptions,
    totalCorrectOptions: correctOptions.length,
    matchedChoice: matchedChoice,
    studentText: studentText,
    feedback: feedback,
    globalFeedback: question.globalFeedback ? question.globalFeedback.text : null
  };
}

module.exports = checkShortAnswer;
