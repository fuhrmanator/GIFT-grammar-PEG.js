import { Question, TrueFalseQuestion, MultipleChoiceQuestion, NumericalQuestion, ShortAnswerQuestion, DescriptionQuestion, EssayQuestion, MatchingQuestion, Category, TextFormat, TextChoice, UnformattedTextChoice, NumericalAnswer, SimpleNumericalAnswer, HighLowNumericalAnswer, RangeNumericalAnswer, MultipleNumericalAnswer, isMultipleNumericalAnswer, isSimpleNumericalAnswer, isRangeNumericalAnswer, isHighLowNumericalAnswer } from '../index';

declare module 'gift-pegjs' {
  export function parse(input: string): Question[];
  export interface PegjsParseError {
    message: string;
    location: PegjsParseErrorLocation;
  }

  export interface PegjsParseErrorLocation {
    start: {
      offset: number;
      line: number;
      column: number;
    };
    end: {
      offset: number;
      line: number;
      column: number;
    };
  }
}

export { 
  Question, 
  TrueFalseQuestion, 
  MultipleChoiceQuestion, 
  NumericalQuestion, 
  ShortAnswerQuestion, 
  DescriptionQuestion, 
  EssayQuestion, 
  MatchingQuestion, 
  Category,
  TextFormat,
  TextChoice,
  UnformattedTextChoice,
  NumericalAnswer,
  SimpleNumericalAnswer, HighLowNumericalAnswer, RangeNumericalAnswer, MultipleNumericalAnswer,
  isMultipleNumericalAnswer, isSimpleNumericalAnswer, isRangeNumericalAnswer, isHighLowNumericalAnswer
};
