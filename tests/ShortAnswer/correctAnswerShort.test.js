const checkShortAnswer = require("../../Helpers/correctAnswerShort.js");

describe("réponses courtes", () => {
  describe("Synonymes acceptés — question classique GIFT", () => {
    const giftText = "Qui est enterré dans la tombe de Grant?{=personne =aucun}";

    test("accepte la réponse officielle « personne »", () => {
      const res = checkShortAnswer(giftText, "personne");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
      expect(res.matchedChoice.text.text).toBe("personne");
      expect(res.selected.weight).toBeNull();
    });

    test("accepte le synonyme « aucun »", () => {
      const res = checkShortAnswer(giftText, "aucun");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
      expect(res.matchedChoice.text.text).toBe("aucun");
    });

    test("accepte les variantes de casse (comportement Moodle)", () => {
      const res = checkShortAnswer(giftText, "Personne");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
    });

    test("rejette les réponses piège courantes des étudiants", () => {
      for (const mauvaise of ["Grant", "Jefferson", "Ulysse S. Grant"]) {
        const res = checkShortAnswer(giftText, mauvaise);
        expect(res.score).toBe(0);
        expect(res.isCorrect).toBe(false);
        expect(res.matchedChoice).toBeNull();
      }
    });
  });

  describe("Deux plus deux — réponses numériques et textuelles", () => {
    const giftText = "Deux plus deux font {=quatre =4}.";

    test("accepte la réponse en lettres", () => {
      const res = checkShortAnswer(giftText, "quatre");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
    });

    test("accepte la réponse numérique saisie comme chaîne", () => {
      const res = checkShortAnswer(giftText, "4");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
    });

    test("convertit une entrée numérique JS en chaîne avant comparaison", () => {
      const res = checkShortAnswer(giftText, 4);
      expect(res.score).toBe(100);
      expect(res.studentText).toBe("4");
    });

    test("rejette une réponse mathématiquement fausse", () => {
      const res = checkShortAnswer(giftText, "cinq");
      expect(res.score).toBe(0);
      expect(res.isCorrect).toBe(false);
    });
  });

  describe("Réponse unique sans signe = — poids implicite à la correction", () => {
    const giftText = "Comment écrit-on le mot pour le chiffre 1? {Un}";

    test("conserve weight null à l'import mais accorde 100 % à la correction", () => {
      const res = checkShortAnswer(giftText, "Un");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
      expect(res.selected.weight).toBeNull();
    });

    test("accepte la casse mixte pour une réponse en un mot", () => {
      const res = checkShortAnswer(giftText, "un");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
    });

    test("rejette une orthographe incorrecte", () => {
      const res = checkShortAnswer(giftText, "Deux");
      expect(res.score).toBe(0);
      expect(res.isCorrect).toBe(false);
    });
  });

  describe("Réponses pondérées avec rétroaction par choix", () => {
    const giftText = `::Réponse courte::Quel est le meilleur animal?{
    =Grenouille#Bon choix!
    =%50%Chat#Les Moodlers adorent les chats!
    =%0%*#Complètement faux
}`;

    test("accorde 100 % pour la meilleure réponse (Grenouille)", () => {
      const res = checkShortAnswer(giftText, "Grenouille");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
      expect(res.feedback).toBe("Bon choix!");
      expect(res.totalCorrectOptions).toBe(3);
    });

    test("accorde 50 % pour une réponse partiellement correcte (Chat)", () => {
      const res = checkShortAnswer(giftText, "Chat");
      expect(res.score).toBe(50);
      expect(res.isCorrect).toBe(true);
      expect(res.feedback).toBe("Les Moodlers adorent les chats!");
    });

    test("n'accorde aucun point pour une réponse non listée (Chien)", () => {
      const res = checkShortAnswer(giftText, "Chien");
      expect(res.score).toBe(0);
      expect(res.isCorrect).toBe(false);
      expect(res.feedback).toBeNull();
    });

    test("le joker =%0%* ne matche pas automatiquement toute réponse incorrecte", () => {
      const res = checkShortAnswer(giftText, "Chien");
      expect(res.score).toBe(0);
      expect(res.feedback).toBeNull();
    });

    test("ne matche le littéral * que si l'étudiant répond exactement *", () => {
      const res = checkShortAnswer(giftText, "*");
      expect(res.score).toBe(0);
      expect(res.feedback).toBe("Complètement faux");
    });
  });

  describe("Ville natale — variantes orthographiques pondérées", () => {
    const giftText = `::Ville natale::Jésus-Christ venait de {
     =Nazareth#Exact!
     =%75%Nazereth#Presque, faute d'orthographe.
     =%25%Bethléem#Il y est né, mais n'y a pas grandi.
}`;

    test("accorde 100 % pour l'orthographe exacte", () => {
      const res = checkShortAnswer(giftText, "Nazareth");
      expect(res.score).toBe(100);
      expect(res.feedback).toBe("Exact!");
    });

    test("accorde 75 % pour une faute de frappe fréquente", () => {
      const res = checkShortAnswer(giftText, "Nazereth");
      expect(res.score).toBe(75);
      expect(res.isCorrect).toBe(true);
      expect(res.feedback).toBe("Presque, faute d'orthographe.");
    });

    test("accorde 25 % pour une réponse géographiquement proche mais incorrecte", () => {
      const res = checkShortAnswer(giftText, "Bethléem");
      expect(res.score).toBe(25);
      expect(res.isCorrect).toBe(true);
      expect(res.feedback).toBe("Il y est né, mais n'y a pas grandi.");
    });

    test("rejette une ville sans rapport", () => {
      const res = checkShortAnswer(giftText, "Jérusalem");
      expect(res.score).toBe(0);
      expect(res.isCorrect).toBe(false);
    });
  });

  describe("Rétroaction globale — affichée quelle que soit la réponse de l'étudiant", () => {
    const giftText = `::Réponse courte::Quel est le meilleur animal?{
    =Grenouille#Bon choix!
    =%50%Chat#Les Moodlers adorent les chats!
    =%0%*#Complètement faux
    ####Voici une rétroaction générale!
}`;
    const retroactionGlobale = "Voici une rétroaction générale!";

    test("inclut la rétroaction globale pour une bonne réponse", () => {
      const res = checkShortAnswer(giftText, "Grenouille");
      expect(res.globalFeedback).toBe(retroactionGlobale);
    });

    test("inclut la rétroaction globale même pour une mauvaise réponse", () => {
      const res = checkShortAnswer(giftText, "Chien");
      expect(res.globalFeedback).toBe(retroactionGlobale);
      expect(res.score).toBe(0);
    });
  });

  describe("Cours francophone — accents, espaces et ponctuation", () => {
    const giftText = `:: Histoire du Québec ::
En quelle année la Confédération canadienne a-t-elle été proclamée? {=1867}
`;

    test("accepte une réponse numérique avec espaces parasites (saisie LMS)", () => {
      const res = checkShortAnswer(giftText, "  1867  ");
      expect(res.score).toBe(100);
      expect(res.studentText).toBe("1867");
    });

    test("accepte une réponse avec accents et casse mixte", () => {
      const giftAccents = `:: Français :: Qui a écrit « Les Misérables »? {=Victor Hugo =Hugo}`;
      const res = checkShortAnswer(giftAccents, "victor hugo");
      expect(res.score).toBe(100);
    });

    test("accepte une réponse contenant des apostrophes", () => {
      const giftPunct = `:: Grammaire :: Quel mot complète « C'est l'___ »? {=été}`;
      const res = checkShortAnswer(giftPunct, "été");
      expect(res.score).toBe(100);
    });
  });

  describe("Soumission vide ou absente", () => {
    const giftText = `:: Chimie :: Quel est le symbole chimique de l'eau? {=H2O =H₂O}`;

    test("retourne 0 pour une chaîne vide", () => {
      const res = checkShortAnswer(giftText, "");
      expect(res.score).toBe(0);
      expect(res.isCorrect).toBe(false);
      expect(res.studentText).toBe("");
    });

    test("retourne 0 pour undefined (étudiant n'a pas encore répondu)", () => {
      const res = checkShortAnswer(giftText, undefined);
      expect(res.score).toBe(0);
      expect(res.studentText).toBe("");
    });

    test("retourne 0 pour null", () => {
      const res = checkShortAnswer(giftText, null);
      expect(res.score).toBe(0);
    });

    test("rejette une réponse composée uniquement d'espaces", () => {
      const res = checkShortAnswer(giftText, "   ");
      expect(res.score).toBe(0);
      expect(res.studentText).toBe("");
    });
  });

  describe("Réponse intégrée dans l'énoncé", () => {
    const giftText = "{ =Asie } est le plus grand continent du monde.";

    test("évalue correctement une réponse à une question à trou", () => {
      const res = checkShortAnswer(giftText, "Asie");
      expect(res.score).toBe(100);
      expect(res.isCorrect).toBe(true);
      expect(res.question.hasEmbeddedAnswers).toBe(true);
    });

    test("rejette un continent incorrect", () => {
      const res = checkShortAnswer(giftText, "Europe");
      expect(res.score).toBe(0);
      expect(res.isCorrect).toBe(false);
    });
  });

  describe("Poids extrêmes et réponses à crédit nul", () => {
    test("une réponse à poids 0 % est techniquement correcte mais sans point", () => {
      const giftText = `:: Piège :: Quelle réponse donne zéro point? {=%0%RéponseZéro}`;
      const res = checkShortAnswer(giftText, "RéponseZéro");
      expect(res.score).toBe(0);
      expect(res.isCorrect).toBe(false);
    });

    test("une réponse pénalisée retourne un score négatif", () => {
      const giftText = `:: Géographie :: Quelle est la capitale de l'Italie? {=%100%Rome =%-50%Milan}`;
      const res = checkShortAnswer(giftText, "Milan");
      expect(res.score).toBe(-50);
      expect(res.isCorrect).toBe(false);
    });

    test("limite les poids à l'intervalle [-100, 100]", () => {
      const giftText = `:: Limite :: Quelle est la note maximale? {=%100%Cent =%-100%MoinsCent}`;
      expect(checkShortAnswer(giftText, "Cent").score).toBeLessThanOrEqual(100);
      expect(checkShortAnswer(giftText, "MoinsCent").score).toBeGreaterThanOrEqual(-100);
    });
  });

  describe("Structure du résultat de correction", () => {
    test("retourne un objet complet pour une question réaliste", () => {
      const giftText = `:: Capitale :: Quelle est la capitale du Canada? {=Ottawa#Parfait!=\%75%Otawa#Presque!####Bonne révision des capitales!}`;
      const res = checkShortAnswer(giftText, "Ottawa");

      expect(res).toMatchObject({
        score: 100,
        isCorrect: true,
        studentText: "Ottawa",
        feedback: "Parfait!",
        globalFeedback: "Bonne révision des capitales!",
        questionHasChoices: true,
        questionValidationError: null,
        answerValidationError: null,
        totalCorrectOptions: 2,
      });
      expect(res.question.type).toBe("Short");
      expect(res.selected.text.text).toBe("Ottawa");
      expect(res.selected.isCorrect).toBe(true);
      expect(res.correctChoices).toHaveLength(2);
      expect(res.matchedChoice).toBe(res.selected);
    });

    test("retourne matchedChoice null et rétroaction null pour une mauvaise réponse", () => {
      const giftText = `:: Capitale :: Quelle est la capitale du Canada? {=Ottawa#Parfait!}`;
      const res = checkShortAnswer(giftText, "Toronto");

      expect(res.score).toBe(0);
      expect(res.isCorrect).toBe(false);
      expect(res.matchedChoice).toBeNull();
      expect(res.feedback).toBeNull();
      expect(res.studentText).toBe("Toronto");
    });
  });

  describe("Erreurs de question", () => {
    test("lève une erreur si le GIFT n'est pas une question Short", () => {
      const giftQCM = `:: QCM :: Quelle est la bonne réponse? {=Bon ~Faux}`;
      expect(() => checkShortAnswer(giftQCM, "Bon")).toThrow("Not a Short question");
    });
  });
});





describe("MVC — réponses pondérées", () => {
  const giftText = `::Software Design::
What does MVC stand for? {
    =Model View Controller
    =%50%Model-View-Controller
    =%25%Model View Control
}`;

  test("accorde 100 % pour la réponse exacte 'Model View Controller'", () => {
    const res = checkShortAnswer(giftText, "Model View Controller");
    expect(res.score).toBe(100);
    expect(res.isCorrect).toBe(true);
    expect(res.matchedChoice.text.text).toBe("Model View Controller");
  });

  test("accorde 50 % pour la variante avec tirets", () => {
    const res = checkShortAnswer(giftText, "Model-View-Controller");
    expect(res.score).toBe(50);
    expect(res.isCorrect).toBe(true);
    expect(res.matchedChoice.text.text).toBe("Model-View-Controller");
  });

  test("accorde 25 % pour la variante 'Model View Control'", () => {
    const res = checkShortAnswer(giftText, "Model View Control");
    expect(res.score).toBe(25);
    expect(res.isCorrect).toBe(true);
    expect(res.matchedChoice.text.text).toBe("Model View Control");
  });

  test("rejette une réponse non listée", () => {
    const res = checkShortAnswer(giftText, "Model-View-ViewModel");
    expect(res.score).toBe(0);
    expect(res.isCorrect).toBe(false);
    expect(res.matchedChoice).toBeNull();
  });
});
