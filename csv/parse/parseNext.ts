import { Scanner } from './Scanner';
import type { ParseOptions } from '.';
import isEmptyRow from './isEmptyRow';
import parseRow from './parseRow';

const parseNext = (scanner: Scanner, rows: string[][], options: ParseOptions): boolean  => {
  const nextToken = scanner.nextNonSpaceToken;
  if (!nextToken) {
    return false;
  }
  const row = parseRow(scanner, options);
  if (row === null) {
    return false;
  }
  if (options.ignoreEmpty && isEmptyRow(row)) {
    return true;
  }
  rows.push(row);
  return true;
};

export default parseNext;
