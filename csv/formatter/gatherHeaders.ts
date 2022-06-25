import type { Row, RowArray } from '../../types';
import isRowHashArray from './isRowHashArray';

// get headers from a row item
const gatherHeaders = (row: Row<string>): RowArray<string> => {
  const getHash = ([hash]: [string, string]): string => hash;
  if (isRowHashArray(row)) {
    // lets assume a multi-dimesional array with item 0 being the header
    return row.map(getHash);
  }
  else if (Array.isArray(row)) {
    return row as RowArray<string>;
  }
  return Object.keys(row);
};

export default gatherHeaders;
