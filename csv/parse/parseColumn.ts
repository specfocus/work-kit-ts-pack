import { ParseOptions } from './options';
import parseNonQuoted from './parseNonQuoted';
import parseQuoted from './parseQuoted';
import { Scanner } from './Scanner';
import isQuote from './isQuote';

const parseColumn = (scanner: Scanner, options: ParseOptions): string | null => {
  const { nextNonSpaceToken } = scanner;
  if (nextNonSpaceToken !== null && isQuote(nextNonSpaceToken.content, options)) {
    scanner.advanceToToken(nextNonSpaceToken);
    return parseQuoted(scanner, options);
  }
  return parseNonQuoted(scanner, options);
};

export default parseColumn;