declare namespace GIFT {
  export function parse(input: string): GIFTQuestion[];

  export interface Location {
    line: number;
    column: number;
    offset: number;
  }

  export interface LocationRange {
    start: Location;
    end: Location;
  }

  export class SyntaxError {
    line: number;
    column: number;
    offset: number;
    location: LocationRange;
    expected: any[];
    found: any;
    name: string;
    message: string;
  }
}

export type GIFTLocation = GIFT.Location;
export type GIFTLocationRange = GIFT.LocationRange;
export type GIFTSyntaxError = GIFT.SyntaxError;

export type QuestionType =
  | "Description"
  | "Category"
  | "MC"
  | "Numerical"
  | "Short"
  | "Essay"
  | "TF"
  | "Matching";

export type Format = "moodle" | "html" | "markdown" | "plain";
export type NumericalType = "simple" | "range" | "high-low";

export interface TextFormat {
  format: Format;
  text: string;
}

export interface NumericalFormat {
  type: NumericalType;
  number?: number;
  range?: number;
  numberHigh?: number;
  numberLow?: number;
}

export interface Choice {
  isCorrect: boolean;
  weight: number | null;
  text: TextFormat | NumericalFormat;
  feedback: Text | null;
}

interface Question {
  type: QuestionType;
  title: string | null;
  stem: TextFormat;
  hasEmbeddedAnswers: boolean;
  globalFeedback: TextFormat | null;
}

export interface Description {
  type: Extract<"Description", QuestionType>;
  title: string | null;
  stem: TextFormat;
  hasEmbeddedAnswers: boolean;
}

export interface Category {
  type: Extract<"Category", QuestionType>;
  title: string;
}

export interface MultipleChoice extends Question {
  type: Extract<"MC", QuestionType>;
  choices: Choice[];
}

export interface ShortAnswer extends Question {
  type: Extract<"Short", QuestionType>;
  choices: Choice[];
}

export interface Numerical extends Question {
  type: Extract<"Numerical", QuestionType>;
  choices: Choice[];
}

export interface Essay extends Question {
  type: Extract<"Essay", QuestionType>;
}

export interface TrueFalse extends Question {
  type: Extract<"TF", QuestionType>;
  isTrue: boolean;
  incorrectFeedback: Text | null;
  correctFeedback: Text | null;
}

export interface Matching extends Question {
  type: Extract<"Matching", QuestionType>;
  matchPairs: Match[];
}

export interface Match {
  subquestion: TextFormat;
  subanswer: string;
}

export type GIFTQuestion =
  | Description
  | Category
  | MultipleChoice
  | ShortAnswer
  | Numerical
  | Essay
  | TrueFalse
  | Matching;
