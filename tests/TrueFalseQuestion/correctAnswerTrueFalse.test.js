const checkTrueFalseAnswer = require("../../Helpers/correctAnswerTrueFalse");

describe("checkTrueFalseAnswer", () => {

  test("Retourne correct quand l'étudiant répond TRUE à une question {T}", () => {
    const question = "::Question1::5 + 6 \\= 11. {T#Bonne réponse !#Mauvaise réponse.####Ceci est un fait scientifique juste un test.}";
    const result = checkTrueFalseAnswer(question, true);
    expect(result.isCorrect).toBe(true);
    expect(result.question.isCorrect(true)).toBe(true);
    expect(result.correctAnswer).toBe(true);
  });



  test("Retourne correct quand l'étudiant répond FALSE à une question {FALSE}", () => {
    const question = "::Question2::La terre est plate.{FALSE#Ce n'est pas vrai #Bien joué!}";
    const result = checkTrueFalseAnswer(question, false);
    expect(result.isCorrect).toBe(true);
    expect(result.correctAnswer).toBe(false);
    expect(result.feedback).toBe("Bien joué!");
  });



  test("Fonctionne avec les formes longues {TRUE} et {FALSE}", () => {
    const question = "::Question3::Le soleil se lève à l'est.{TRUE}";
    const result = checkTrueFalseAnswer(question, true);
    expect(result.isCorrect).toBe(true);
    expect(result.correctAnswer).toBe(true);
    expect(result.feedback).toBeNull();
    expect(result.globalFeedback).toBeNull();
  });



  test("Retourne null si aucun feedback défini", () => {
    const question = "::Question4::Le ciel est bleu.{T}";
    const result = checkTrueFalseAnswer(question, true);
    expect(result.isCorrect).toBe(true);
    expect(result.feedback).toBeNull();
  });



  test("Lance une erreur pour une question non True/False", () => {
    const question = "::Question5::Combien font 2+2? {=4}";
    expect(() => checkTrueFalseAnswer(question, true))
      .toThrow("Not a True/False question");
  });

});
