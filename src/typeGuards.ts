import type { PegjsParseError } from "gift-pegjs";
import { NumericalAnswer, SimpleNumericalAnswer, RangeNumericalAnswer, HighLowNumericalAnswer, MultipleNumericalAnswer } from "../types/index";

export function isSimpleNumericalAnswer(answer: NumericalAnswer): answer is SimpleNumericalAnswer {
  return (answer as SimpleNumericalAnswer).type === "simple";
}

export function isRangeNumericalAnswer(answer: NumericalAnswer): answer is RangeNumericalAnswer {
  return (answer as RangeNumericalAnswer).type === "range" && typeof (answer as RangeNumericalAnswer).range === "number";
}

export function isHighLowNumericalAnswer(answer: NumericalAnswer): answer is HighLowNumericalAnswer {
  return (answer as HighLowNumericalAnswer).type === "high-low";
}

export function isMultipleNumericalAnswer(answer: NumericalAnswer): answer is MultipleNumericalAnswer {
  return 'isCorrect' in answer && 'answer' in answer;
}

export function isPegjsParseError(error: any): error is PegjsParseError {
  return error && error.message && error.location && typeof error.location.start === 'object' && typeof error.location.end === 'object';
}
