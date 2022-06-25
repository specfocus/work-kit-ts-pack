import { RowArray } from '../../types';
import type { ParseOptions } from '.';
import type { Token } from './Scanner';
import { Scanner } from './Scanner';
import isDelimiter from './isDelimiter';
import isRowDelimiter from './isRowDelimiter';

const shouldSkipColumnParse = (
  scanner: Scanner,
  currentToken: Token,
  columns: RowArray,
  options: ParseOptions
): boolean => {
  if (isDelimiter(currentToken.content, options)) {
    scanner.advancePastToken(currentToken);
    // if the delimiter is at the end of a line
    const nextToken = scanner.nextCharacterToken;
    if (!scanner.hasMoreCharacters || (nextToken !== null && isRowDelimiter(nextToken.content))) {
      columns.push('');
      return true;
    }
    if (nextToken !== null && isDelimiter(nextToken.content, options)) {
      columns.push('');
      return true;
    }
  }
  return false;
};

export default shouldSkipColumnParse;
