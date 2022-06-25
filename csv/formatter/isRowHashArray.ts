import type { Row, RowHashArray } from '../../types';

const isRowHashArray = <V>(row: Row<V>): row is RowHashArray<V> => {
  if (Array.isArray(row)) {
    return Array.isArray(row[0]) && row[0].length === 2;
  }
  return false;
};

export default isRowHashArray;
