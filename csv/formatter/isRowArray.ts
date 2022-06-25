import { Row, RowArray } from '../../types';
import isRowHashArray from './isRowHashArray';

const isRowArray = (row: Row): row is RowArray => {
  return Array.isArray(row) && !isRowHashArray(row);
};

export default isRowArray;
