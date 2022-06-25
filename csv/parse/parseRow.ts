import getStartToken from './getStartToken';
import type { ParseOptions } from '.';
import parseColumn from './parseColumn';
import { Scanner } from './Scanner';
import shouldSkipColumnParse from './shouldSkipColumnParse';
import isCarriageReturn from './isCarriageReturn';
import isRowDelimiter from './isRowDelimiter';

const parseRow = (
  scanner: Scanner,
  options: ParseOptions
): string[] | null => {
  const { hasMoreData } = scanner;
  const currentScanner = scanner;
  const columns: string[] = [];
  let currentToken = getStartToken(currentScanner, columns, options);
  while (currentToken) {
    if (isRowDelimiter(currentToken.content)) {
      currentScanner.advancePastToken(currentToken);
      // if ends with CR and there is more data, keep unparsed due to possible
      // coming LF in CRLF
      if (
        !currentScanner.hasMoreCharacters &&
        isCarriageReturn(currentToken.content, options) &&
        hasMoreData
      ) {
        return null;
      }
      currentScanner.truncateToCursor();
      return columns;
    }
    if (!shouldSkipColumnParse(currentScanner, currentToken, columns, options)) {
      const item = parseColumn(currentScanner, options);
      if (item === null) {
        return null;
      }
      columns.push(item);
    }
    currentToken = currentScanner.nextNonSpaceToken;
  }
  if (!hasMoreData) {
    currentScanner.truncateToCursor();
    return columns;
  }
  return null;
};

export default parseRow;
