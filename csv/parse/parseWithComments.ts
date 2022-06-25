import { ParseOptions } from './options';
import parseNext from './parseNext';
import { Scanner } from './Scanner';
import isComment from './isComment';

export interface ParseResult {
  line: string;
  rows: string[][];
}

const parseWithComments = (scanner: Scanner, options: ParseOptions): ParseResult => {
  const rows: string[][] = [];
  for (let nextToken = scanner.nextCharacterToken; nextToken !== null; nextToken = scanner.nextCharacterToken) {
    if (isComment(nextToken.content, options)) {
      const cursor = scanner.advancePastLine();
      if (cursor === null) {
        return { line: scanner.lineFromCursor, rows };
      }
      if (!scanner.hasMoreCharacters) {
        return { line: scanner.lineFromCursor, rows };
      }
      scanner.truncateToCursor();
    } else if (!parseNext(scanner, rows, options)) {
      break;
    }
  }
  return { line: scanner.line, rows };
};

export default parseWithComments;
