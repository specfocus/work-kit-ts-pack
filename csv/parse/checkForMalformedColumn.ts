import { ParseOptions } from './options';
import { Scanner } from './Scanner';
import isDelimiter from './isDelimiter';
import isRowDelimiter from './isRowDelimiter';

const checkForMalformedColumn = (scanner: Scanner, options: ParseOptions): void => {
  const { nextNonSpaceToken } = scanner;
  if (nextNonSpaceToken) {
    const isNextTokenADelimiter = isDelimiter(nextNonSpaceToken.content, options);
    const isNextTokenARowDelimiter = isRowDelimiter(nextNonSpaceToken.content);
    if (!(isNextTokenADelimiter || isNextTokenARowDelimiter)) {
      // if the final quote was NOT followed by a column (,) or row(\n) delimiter then its a bad column
      // tldr: only part of the column was quoted
      const linePreview = scanner.lineFromCursor.substr(0, 10).replace(/[\r\n]/g, "\\n'");
      throw new Error(
        `Parse Error: expected: '${options.escapedDelimiter}' OR new line got: '${nextNonSpaceToken.content}'. at '${linePreview}'`,
      );
    }
    scanner.advanceToToken(nextNonSpaceToken);
  } else if (!scanner.hasMoreData) {
    scanner.advancePastLine();
  }
};

export default checkForMalformedColumn;
