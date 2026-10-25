const checkMC = require("../../Helpers/correctAnswerMultipleChoice");

describe('vérifierRéponseQCM', () => {
  test('réponse unique correcte renvoie 100 (par index)', () => {
    const gift = `:: QCM simple :: Quel est le bon choix? {=Correct ~Faux1 ~Faux2}`;
    const res = checkMC(gift, [0]);
    expect(res.score).toBe(100);
    expect(res.isCorrect).toBe(true);
    expect(res.totalCorrectOptions).toBe(1);
    expect(res.userSelectedCount).toBe(1);
    expect(res.selectedCorrectOptionsCount).toBe(1);
  });

  test('réponse unique correcte renvoie 100 (par chaîne)', () => {
    const gift = `:: QCM simple :: Quel est le bon choix? {=Correct ~Faux1 ~Faux2}`;
    const res = checkMC(gift, ['Correct']);
    expect(res.score).toBe(100);
  });

  test('réponses pondérées : sélection partielle renvoie son poids', () => {
    const gift = `:: Sciences naturelles ::\nLesquels sont des mammifères? {=%50%Chat ~Poisson =%50%Chien}`;
    const res = checkMC(gift, [0]);
    expect(res.score).toBe(50);
    const resBoth = checkMC(gift, [0,2]);
    expect(resBoth.score).toBe(100);
  });

  test('réponse incorrecte pénalisée à -50% donne un score négatif', () => {
    const gift = `:: Mathématiques ::\nLesquels sont pairs? {=%50%2 ~%-50%3 =%50%4}`;
    const resWrong = checkMC(gift, [1]);
    //--score négagatif attendu
    expect(resWrong.score).toBeCloseTo(-50, 4);
    expect(resWrong.userSelectedCount).toBe(1);
    expect(resWrong.selectedCorrectOptionsCount).toBe(0);
    expect(resWrong.isCorrect).toBe(false);
    expect(resWrong.positiveWeightTotalValid).toBe(true);

    const resPartial = checkMC(gift, [0,1]);
    expect(resPartial.score).toBeCloseTo(0, 4);
    expect(resPartial.userSelectedCount).toBe(2);
    expect(resPartial.selectedCorrectOptionsCount).toBe(1);
    expect(resPartial.isCorrect).toBe(false);
    expect(resPartial.positiveWeightTotalValid).toBe(true);

    const resCorrectTwo = checkMC(gift, [0,2]);
    expect(resCorrectTwo.score).toBeCloseTo(100, 4);
    expect(resCorrectTwo.isCorrect).toBe(true);
    expect(resCorrectTwo.positiveWeightTotalValid).toBe(true);
  });

  test('sélection vide ou indéfinie renvoie 0', () => {
    const gift = `:: QCM simple :: Quel est le bon choix? {=Correct ~Faux1 ~Faux2}`;
    const resEmpty = checkMC(gift, []);
    expect(resEmpty.score).toBe(0);
    expect(resEmpty.userSelectedCount).toBe(0);
    const resUndefined = checkMC(gift, undefined);
    expect(resUndefined.score).toBe(0);
    expect(resUndefined.userSelectedCount).toBe(0);
  });

  test('faire un test avec les pourcentages et avec les pénalités', () => {
    const gift = `:: Chimie élémentaire ::\nLesquels sont des éléments? {=%33.33333%Oxygène =%33.33333%Azote ~%-100%Eau =%33.33333%Carbone ~%-100%Sucre}`;
    const resSingle = checkMC(gift, [0]);
    expect(resSingle.score).toBeCloseTo(33.33333, 4);
    expect(resSingle.totalCorrectOptions).toBe(3);
    expect(resSingle.userSelectedCount).toBe(1);
    expect(resSingle.selectedCorrectOptionsCount).toBe(1);
    expect(resSingle.positiveWeightTotal).toBeCloseTo(100, 4);
    expect(resSingle.positiveWeightTotalValid).toBe(true);

    const resCorrectThree = checkMC(gift, [0,1,3]);
    expect(resCorrectThree.score).toBeCloseTo(100, 4);
    expect(resCorrectThree.totalCorrectOptions).toBe(3);
    expect(resCorrectThree.userSelectedCount).toBe(3);
    expect(resCorrectThree.selectedCorrectOptionsCount).toBe(3);
    expect(resCorrectThree.isCorrect).toBe(true);
    expect(resCorrectThree.positiveWeightTotalValid).toBe(true);

    const resPenaltyOne = checkMC(gift, [2]);
    //--score négagatif attendu
    expect(resPenaltyOne.score).toBeCloseTo(-100, 4);
    expect(resPenaltyOne.totalCorrectOptions).toBe(3);
    expect(resPenaltyOne.userSelectedCount).toBe(1);
    expect(resPenaltyOne.selectedCorrectOptionsCount).toBe(0);
    expect(resPenaltyOne.isCorrect).toBe(false);
    expect(resPenaltyOne.positiveWeightTotalValid).toBe(true);

    const resMixed = checkMC(gift, [0,2]);
    expect(resMixed.score).toBeCloseTo(-66.66667, 4);
    expect(resMixed.userSelectedCount).toBe(2);
    expect(resMixed.selectedCorrectOptionsCount).toBe(1);
    expect(resMixed.isCorrect).toBe(false);
    expect(resMixed.positiveWeightTotalValid).toBe(true);

    const resAllSelected = checkMC(gift, [0,1,2,3,4]);
    expect(resAllSelected.score).toBeCloseTo(-100, 4);
    expect(resAllSelected.userSelectedCount).toBe(5);
    expect(resAllSelected.selectedCorrectOptionsCount).toBe(3);
    expect(resAllSelected.isCorrect).toBe(false);
    expect(resAllSelected.positiveWeightTotalValid).toBe(true);
  });

  test('contrôle MC pondéré : le total des poids positifs doit être 100', () => {
    const invalidGift = `:: Capitales européennes ::\nSélectionnez lesquelles? {=%50%Paris =%40%Berlin ~%-10%Londres =%20%Rome}`;
    const resInvalid = checkMC(invalidGift, [0,2,3]);
    expect(resInvalid.positiveWeightTotal).toBeCloseTo(110, 4);
    expect(resInvalid.positiveWeightTotalValid).toBe(false);
    expect(resInvalid.weightValidationError).toBe('Weighted positive choices total must equal 100');
  });

  test('contrôle MC pondéré : le total des poids positifs doit être 100', () => {
    const invalidGift = `:: Nom des continents ::\nSelect all of the options below which name a continent {
    ~%33.33333%Africa
    ~%33.33333%Asia
    ~%-100%China
    ~%33.33333%Antarctica
    ~%-100%America}`;
    const resInvalid = checkMC(invalidGift, [0,1,3,4]);
    expect(resInvalid.isCorrect).toBe(false);
    expect(resInvalid.positiveWeightTotalValid).toBe(true);
  });


  


  // Tests pour vérifier qu'une réponse correcte existe
  test('vérifier qu\'une réponse correcte existe - cas valide', () => {
    const gift = `:: QCM simple :: Quel est le bon choix? {=Correct ~Faux1 ~Faux2}`;
    const res = checkMC(gift, [0]);
    expect(res.hasCorrectAnswer).toBe(true);
    expect(res.answerValidationError).toBeNull();
  });

  test('vérifier qu\'une réponse correcte existe - aucune bonne réponse définie', () => {
    const gift = `:: QCM sans réponse :: Quel est le bon choix? {~Faux1 ~Faux2 ~Faux3}`;
    const res = checkMC(gift, []);
    expect(res.hasCorrectAnswer).toBe(false);
    expect(res.answerValidationError).toBe('No correct answer defined for this question');
    expect(res.isCorrect).toBe(false);
  });

  test('vérifier qu\'une réponse correcte existe - pondérée valide', () => {
    const gift = `:: Sciences naturelles ::\nLesquels sont des mammifères? {=%50%Chat ~Poisson =%50%Chien}`;
    const res = checkMC(gift, [0]);
    expect(res.hasCorrectAnswer).toBe(true);
    expect(res.answerValidationError).toBeNull();
    expect(res.totalCorrectOptions).toBe(2);
  });

  test('vérifier qu\'une réponse correcte existe - avec pénalité et réponses correctes', () => {
    const gift = `:: Mathématiques ::\nLesquels sont pairs? {=%50%2 ~%-50%3 =%50%4}`;
    const res = checkMC(gift, [1]);
    expect(res.hasCorrectAnswer).toBe(true);
    expect(res.answerValidationError).toBeNull();
    expect(res.totalCorrectOptions).toBe(2);
  });
//-----limitation de la note entre -100 et 100%
  test('note limitée entre -100 et 100%', () => {
    const gift = `:: Mathématiques ::\nLesquels sont pairs? {=%50%2 ~%-50%3 =%50%4}`;

    const resBelowMin = checkMC(gift, [1,1]);
    expect(resBelowMin.score).toBe(-100);

    const resAboveMax = checkMC(gift, [0,2]);
    expect(resAboveMax.score).toBe(100);

    const resNormal = checkMC(gift, [0]);
    expect(resNormal.score).toBe(50);
  });

  test('note limitée avec plusieurs fractions positives et négatives', () => {
    const gift = `:: Chimie élémentaire ::\nLesquels sont des éléments? {=%33.33333%Oxygène =%33.33333%Azote ~%-100%Eau =%33.33333%Carbone ~%-100%Sucre}`;
    const resHugePenalty = checkMC(gift, [2,4]);
    expect(resHugePenalty.score).toBe(-100);

    const resHugeReward = checkMC(gift, [0,1,3]);
    // 33.33333 * 3 may be slightly above 100 due to float precision, clamped to 100
    expect(resHugeReward.score).toBeCloseTo(100, 2);
  });

  test('tentative de dépasser 100% - doit être limité à 100', () => {
    // Trois réponses correctes de 50% chacune = 150%, doit être clampé à 100
    // Ajout d'une mauvaise réponse pour garder le type MC (sinon converti en Short)
    const gift = `:: Test limite haute ::\nQuelle combinaison? {=%50%Réponse1 =%50%Réponse2 =%50%Réponse3 ~Mauvaise}`;
    const resAboveMax = checkMC(gift, [0, 1, 2]);
    expect(resAboveMax.score).toBe(100);
    expect(resAboveMax.score).not.toBe(150);
  });

  test('tentative de descendre sous -100% - doit être limité à -100', () => {
    // Trois pénalités de -50% chacune = -150%, doit être clampé à -100
    const gift = `:: Test limite basse ::\nQuelle combinaison? {~%-50%Mauvais1 ~%-50%Mauvais2 ~%-50%Mauvais3}`;
    const resBelowMin = checkMC(gift, [0, 1, 2]);
    expect(resBelowMin.score).toBe(-100);
    expect(resBelowMin.score).not.toBe(-150);
  });
});
