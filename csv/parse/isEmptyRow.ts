const EMPTY_STRING = '';

const isEmptyRow = (row: string[]): boolean =>
  row.join(EMPTY_STRING).replace(/\s+/g, EMPTY_STRING) === EMPTY_STRING;

export default isEmptyRow;
