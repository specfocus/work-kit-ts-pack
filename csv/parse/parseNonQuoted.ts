import { ParseOptions } from './options';
import { Scanner } from './Scanner';
import isDelimiter from './isDelimiter';
import isRowDelimiter from './isRowDelimiter';

const parseNonQuoted = (scanner: Scanner, options: ParseOptions): string | null => {
  if (!scanner.hasMoreCharacters) {
    return null;
  }
  const characters = [];
  let nextToken = scanner.nextCharacterToken;
  for (; nextToken; nextToken = scanner.nextCharacterToken) {
    if (isDelimiter(nextToken.content, options) || isRowDelimiter(nextToken.content)) {
      break;
    }
    characters.push(nextToken.content);
    scanner.advancePastToken(nextToken);
  }
  return characters.join('');
};

export default parseNonQuoted;