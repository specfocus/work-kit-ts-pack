import { Scanner } from './Scanner';
import checkForMalformedColumn from './checkForMalformedColumn';
import gatherDataBetweenQuotes from './gatherDataBetweenQuotes';
import { ParseOptions } from './options';

const parseQuoted = (scanner: Scanner, options: ParseOptions): string | null => {
  if (!scanner.hasMoreCharacters) {
    return null;
  }
  const originalCursor = scanner.cursor;
  const { foundClosingQuote, col } = gatherDataBetweenQuotes(scanner, options);
  if (!foundClosingQuote) {
    // reset the cursor to the original
    scanner.advanceTo(originalCursor);
    // if we didnt find a closing quote but we potentially have more data then skip the parsing
    // and return the original scanner.
    if (!scanner.hasMoreData) {
      throw new Error(
        `Parse Error: missing closing: '${options.quote || ''
        }' in line: at '${scanner.lineFromCursor.replace(/[\r\n]/g, "\\n'")}'`,
      );
    }
    return null;
  }
  checkForMalformedColumn(scanner, options);
  return col;
};

export default parseQuoted;
