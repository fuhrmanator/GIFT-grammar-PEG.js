export type QuestionType = "TF" | "MC" | "Numerical" | "Short" | "Description" | "Category";

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

export interface Category {
  type: "Category";
  title: string;
}

// Define the types for numerical answers
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
export type Question = TrueFalseQuestion | MultipleChoiceQuestion | NumericalQuestion | ShortAnswerQuestion | DescriptionQuestion | Category;

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
