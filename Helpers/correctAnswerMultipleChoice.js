const { parse } = require("../pegjs-gift.js");
const { normalizeSelection } = require("./calculateSelection.js");

/**
 * checkMultipleChoiceAnswer
 * -------------------------
 * Helper principal pour vérifier une réponse à une question Multi-Choice (MC).
 * Ce fichier expose une seule fonction qui :
 * - Parse le texte GIFT et récupère la question MC.
 * - Normalise la sélection de l'utilisateur via `normalizeSelection()`.
 * - Vérifie que des choix existent et qu'au moins une réponse correcte est
 *   définie (les fractions comme `%50` ou `%-25` sont reconnues par
 *   `GIFT.pegjs`).
 * - Délègue le calcul du score à `question.calculateScore(selectedChoices)`
 *   (implémenté dans le parser GIFT) — c'est ici que les fractions sélectionnées
 *   sont additionnées pour produire le score final.
 * - Gère les fractions négatives (pénalités) : `calculateScore()` peut donc
 *   renvoyer des scores négatifs selon les poids fournis.
 * - Calcule et expose `weightedCorrectTotal` et `weightTotalValid` pour
 *   indiquer si les poids des réponses correctes (si fournis) somment à 100.
 *
 * Résultat renvoyé (objet) : contient le score, détails sur la sélection,
 * la présence d'une bonne réponse, le total des poids, validations, etc.
 */
function checkMultipleChoiceAnswer(giftText, studentSelection) {
  const questions = parse(giftText);
  if (questions.length === 0 || questions[0].type !== "MC") {
    throw new Error("Not a Multiple Choice question");
  }

  const question = questions[0];
  const normalized = normalizeSelection(question, studentSelection);

  // -------Ensure the question actually has choices
  const hasChoices = Array.isArray(question.choices) && question.choices.length > 0;
  const questionHasChoices = hasChoices;
  const questionValidationError = hasChoices ? null : 'No answer choices provided';

  // -------Ensure the question has at least one correct answer (isCorrect flag).
  // Les fractions `%50`, `%-25`, etc. sont parsées et traduites en `choice.weight`
  // par `GIFT.pegjs`. Ici on teste simplement s'il existe au moins une option
  // marquée correcte (cela couvre à la fois les choix implicites '=' et les
  // choix pondérés avec `weight`).
  const hasCorrectAnswer = hasChoices && (question.choices || []).some(c => c.isCorrect);
  const answerValidationError = hasCorrectAnswer ? null : 'No correct answer defined for this question';

  // Le calcul du score est effectué par `question.calculateScore(selectedChoices)`
  // fourni par le parser (implémente l'addition des fractions sélectionnées
  // et gère les valeurs négatives pour les pénalités). Si la méthode est
  // absente ou qu'il n'y a pas de choix, on renvoie 0.

  const score = (typeof question.calculateScore === 'function' && hasChoices)
    ? question.calculateScore(normalized)
    : 0;

  const isCorrect = (score > 0);
  const correctOptions = (question.choices || []).filter(c => c.isCorrect);
  const feedback = (normalized || []).map(c => (c && c.feedback) ? c.feedback.text : null);
  const totalCorrectOptions = correctOptions.length;
  const userSelectedCount = (normalized || []).length;
  const selectedCorrectOptionsCount = (normalized || []).filter(c => c && c.isCorrect).length;

  // Calcule la somme des poids POSITIFS. Si des poids sont fournis (via `%...%` 
  // dans le GIFT), on additione tous les poids positifs (qui correspondent aux bonnes 
  // réponses) afin de vérifier si la somme fait bien 100 (validation). 
  // Les poids négatifs (pénalités) ne sont pas inclus dans cette vérification.
  const positiveWeightTotal = (question.choices || []).reduce((sum, choice) => {
    if (typeof choice.weight === 'number' && choice.weight > 0) {
      return sum + choice.weight;
    }
    return sum;
  }, 0);
  const hasPositiveWeights = (question.choices || []).some(c => typeof c.weight === 'number' && c.weight > 0);
  // Si des poids positifs sont fournis, on exige que leur somme soit proche de 100.
  const positiveWeightTotalValid = !hasPositiveWeights || Math.abs(positiveWeightTotal - 100) < 1e-4;
  const weightValidationError = positiveWeightTotalValid ? null : 'Weighted positive choices total must equal 100';

  return {
    question: question,
    score: score,
    isCorrect: isCorrect,
    selected: normalized,
    questionHasChoices: questionHasChoices,
    questionValidationError: questionValidationError,
    hasCorrectAnswer: hasCorrectAnswer,
    answerValidationError: answerValidationError,
    correctChoices: correctOptions,
    totalCorrectOptions: totalCorrectOptions,
    userSelectedCount: userSelectedCount,
    selectedCorrectOptionsCount: selectedCorrectOptionsCount,
    positiveWeightTotal: positiveWeightTotal,
    weightedCorrectTotal: positiveWeightTotal,
    positiveWeightTotalValid: positiveWeightTotalValid,
    weightTotalValid: positiveWeightTotalValid,
    weightValidationError: weightValidationError,
    feedback: feedback,
    globalFeedback: question.globalFeedback ? question.globalFeedback.text : null
  };
}

module.exports = checkMultipleChoiceAnswer;
