import { ParsedGIFTQuestion } from './index';

declare module 'gift-pegjs' {
  export function parse(input: string): ParsedGIFTQuestion[];

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

export * from './index';
