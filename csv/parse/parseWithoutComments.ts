import { Scanner } from './Scanner';
import { ParseOptions } from './options';
import parseNext from './parseNext';

export interface ParseResult {
  line: string;
  rows: string[][];
}

const parseWithoutComments = (scanner: Scanner, options: ParseOptions): ParseResult => {
  const rows: string[][] = [];
  let shouldContinue = true;
  while (shouldContinue) {
    shouldContinue = parseNext(scanner, rows, options);
  }
  return { line: scanner.line, rows };
};

export default parseWithoutComments;
