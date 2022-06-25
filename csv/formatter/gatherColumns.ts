import { Row, RowArray } from '../../types';
import isRowArray from './isRowArray';
import isRowHashArray from './isRowHashArray';
import { FormatterOptions } from './options';

// todo change this method to unknown[]
const gatherColumns = (row: Row, options: FormatterOptions): RowArray => {
  if (options.headers === null) {
    throw new Error('Headers is currently null');
  }
  if (!Array.isArray(row)) {
    return options.headers.map((header): string => row[header] as string);
  }
  if (isRowHashArray(row)) {
    return options.headers.map((header, i): string => {
      const col = (row[i] as unknown) as string;
      if (col) {
        return col[1];
      }
      return '';
    });
  }
  // if its a one dimensional array and headers were not provided
  // then just return the row
  if (isRowArray(row) && !options.shouldWriteHeaders) {
    return row;
  }
  return options.headers.map((header, i): string => String(row[i]));
};

export default gatherColumns;
