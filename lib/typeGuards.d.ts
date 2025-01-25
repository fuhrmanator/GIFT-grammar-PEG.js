import type { PegjsParseError } from "gift-pegjs";
import { NumericalAnswer, SimpleNumericalAnswer, RangeNumericalAnswer, HighLowNumericalAnswer, MultipleNumericalAnswer } from "../types/index";
export declare function isSimpleNumericalAnswer(answer: NumericalAnswer): answer is SimpleNumericalAnswer;
export declare function isRangeNumericalAnswer(answer: NumericalAnswer): answer is RangeNumericalAnswer;
export declare function isHighLowNumericalAnswer(answer: NumericalAnswer): answer is HighLowNumericalAnswer;
export declare function isMultipleNumericalAnswer(answer: NumericalAnswer): answer is MultipleNumericalAnswer;
export declare function isPegjsParseError(error: any): error is PegjsParseError;
