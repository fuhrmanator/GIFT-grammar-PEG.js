import type { Question } from './index.d.ts'; // Adjust the import based on your actual interface file

declare module 'GIFT' {
  export function parse(input: string): Question[];
}

// Add a dummy type
export type DummyType = {
  dummyProperty: string;
};
