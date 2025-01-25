"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSimpleNumericalAnswer = isSimpleNumericalAnswer;
exports.isRangeNumericalAnswer = isRangeNumericalAnswer;
exports.isHighLowNumericalAnswer = isHighLowNumericalAnswer;
exports.isMultipleNumericalAnswer = isMultipleNumericalAnswer;
exports.isPegjsParseError = isPegjsParseError;
function isSimpleNumericalAnswer(answer) {
    return answer.type === "simple";
}
function isRangeNumericalAnswer(answer) {
    return answer.type === "range" && typeof answer.range === "number";
}
function isHighLowNumericalAnswer(answer) {
    return answer.type === "high-low";
}
function isMultipleNumericalAnswer(answer) {
    return 'isCorrect' in answer && 'answer' in answer;
}
function isPegjsParseError(error) {
    return error && error.message && error.location && typeof error.location.start === 'object' && typeof error.location.end === 'object';
}
