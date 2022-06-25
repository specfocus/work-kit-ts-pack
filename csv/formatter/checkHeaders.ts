import isEqual from '@specfocus/spec-focus/objects/deepEqual';
import { Row, RowArray } from '../../types';
import { FormatterContext } from './formatRow';
import gatherHeaders from './gatherHeaders';
import { FormatterOptions } from './options';

// check if we need to write header return true if we should also write a row
// could be false if headers is true and the header row(first item) is passed in
const checkHeaders = <I extends Row, O extends Row>(
  ctx: FormatterContext,
  row: Row,
  options: FormatterOptions
): { headers?: RowArray<string> | null; shouldFormatColumns: boolean; } => {
  const { headers } = options;
  if (headers) {
    // either the headers were provided by the user or we have already gathered them.
    return { shouldFormatColumns: true, headers };
  }
  options.headers = gatherHeaders(row as string[]);
  if (!options.shouldWriteHeaders) {
    // if we are not supposed to write the headers then
    // always format the columns
    return { shouldFormatColumns: true, headers: null };
  }
  // if the row is equal to headers dont format
  return { shouldFormatColumns: !isEqual(headers, row), headers };
};

export default checkHeaders;
