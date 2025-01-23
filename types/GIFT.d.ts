import type { ParsedGIFTQuestion, Question } from './index.d.ts'; // Adjust the import based on your actual interface file

declare module 'GIFT' {
  export function parse(input: string): ParsedGIFTQuestion[];
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

export interface PegjsParseError extends Error {
  message: string;
  location: PegjsParseErrorLocation;
}
