import type { ParseOptions } from '.';
import { MaybeToken, Scanner } from './Scanner';
import isDelimiter from './isDelimiter';

const getStartToken = (
  scanner: Scanner,
  columns: string[],
  options: ParseOptions
): MaybeToken => {
  const currentToken = scanner.nextNonSpaceToken;
  if (currentToken !== null && isDelimiter(currentToken.content, options)) {
    columns.push('');
    return scanner.nextNonSpaceToken;
  }
  return currentToken;
};

export default getStartToken;
