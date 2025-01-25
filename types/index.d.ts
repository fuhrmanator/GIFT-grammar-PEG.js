export type BaseQuestion = {
  id?: string;
  title?: string;
  tags?: string[];
  formattedStem: TextFormat;
  hasEmbeddedAnswers: boolean;
  formattedGlobalFeedback?: TextFormat;
}

export type QuestionType = "TF" | "MC" | "Numerical" | "Short" | "Description" | "Essay" | "Category" | "Matching";

export interface TextFormat {
  text: string;
  format: string; // e.g., "html", "markdown"
}

export interface NumericalFormat {
  value: number;
  format: string; // e.g., "decimal", "fraction"
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "TF";
  isTrue: boolean;
  trueFormattedFeedback?: TextFormat;
  falseFormattedFeedback?: TextFormat;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "MC";
  choices: TextChoice[];
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: "Short";
  choices: UnformattedTextChoice[];
}

export interface Description extends BaseQuestion {
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

// Numerical

export interface NumericalQuestion extends BaseQuestion {
  type: "Numerical";
  choices: NumericalAnswer[];
}

export type NumericalAnswer = SimpleNumericalAnswer | RangeNumericalAnswer | HighLowNumericalAnswer | MultipleNumericalAnswer;

export interface MultipleNumericalAnswer {
  isCorrect: boolean;
  weight?: number;
  answer: SimpleNumericalAnswer | RangeNumericalAnswer | HighLowNumericalAnswer;
  formattedFeedback?: TextFormat;
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

export type ParsedGIFTQuestion = Question | Description | Category;

// Union type for all question types
export type Question = TrueFalseQuestion | MultipleChoiceQuestion | NumericalQuestion | ShortAnswerQuestion | Description | EssayQuestion | MatchingQuestion | Category;

export interface TextChoice {
  isCorrect: boolean;
  weight?: number;
  formattedText: TextFormat;
  formattedFeedback?: TextFormat;
}

export interface UnformattedTextChoice {
  isCorrect: boolean;
  weight?: number;
  text: string;
  formattedFeedback?: TextFormat;
}
