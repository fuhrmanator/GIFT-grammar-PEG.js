export type QuestionType = "TF" | "MC" | "Numerical" | "Short" | "Description" | "Essay" | "Category" | "Matching";

export interface TextFormat {
  text: string;
  format: string; // e.g., "html", "markdown"
}

export interface NumericalFormat {
  value: number;
  format: string; // e.g., "decimal", "fraction"
}

export interface BaseQuestion {
  id?: string | null;
  tags?: string[] | null;
  type: QuestionType;
  title: string | null;
  formattedStem: TextFormat;
  hasEmbeddedAnswers: boolean;
  formattedGlobalFeedback?: TextFormat | null;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "TF";
  isTrue: boolean;
  trueFormattedFeedback?: TextFormat | null;
  falseFormattedFeedback?: TextFormat | null;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "MC";
  choices: TextChoice[];
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: "Short";
  choices: UnformattedTextChoice[];
}

export interface DescriptionQuestion extends BaseQuestion {
  type: "Description";
}

export interface EssayQuestion extends BaseQuestion {
  type: "Essay";
}

export interface MatchingQuestion extends BaseQuestion {
  type: "Matching";
  matchPairs: MatchingPair[];
}

export interface Category {
  type: "Category";
  title: string;
}

export interface MatchingPair {
  formattedSubquestion: TextFormat;
  subanswer: string;
}

export interface SimpleNumericalAnswer {
  type: "simple";
  number: number;
}

export interface RangeNumericalAnswer {
  type: "range";
  number: number;
  range: number;
}

export interface HighLowNumericalAnswer {
  type: "high-low";
  numberHigh: number;
  numberLow: number;
}

export interface MultipleNumericalAnswer {
  isCorrect: boolean;
  weight: number | null;
  text: SimpleNumericalAnswer | RangeNumericalAnswer | HighLowNumericalAnswer;
  formattedFeedback: TextFormat | null;
}

// Union type for numerical answers
export type NumericalAnswer = SimpleNumericalAnswer | RangeNumericalAnswer | HighLowNumericalAnswer | MultipleNumericalAnswer;

export interface NumericalQuestion extends BaseQuestion {
  type: "Numerical";
  choices: NumericalAnswer[];
}

// Union type for all question types
export type Question = TrueFalseQuestion | MultipleChoiceQuestion | NumericalQuestion | ShortAnswerQuestion | DescriptionQuestion | EssayQuestion | MatchingQuestion | Category;

export interface TextChoice {
  isCorrect: boolean;
  weight: number | null;
  formattedText: TextFormat;
  formattedFeedback: TextFormat | null;
}

export interface UnformattedTextChoice {
  isCorrect: boolean;
  weight: number | null;
  text: string;
  formattedFeedback: TextFormat | null;
}
