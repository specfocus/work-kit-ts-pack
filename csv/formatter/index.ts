import { Row, RowArray } from '../../types';
import { FormatterOptions, FormatterOptionsArgs } from './options';
import { formatRow } from './formatRow';
import escapeRegExp from 'lodash.escaperegexp';

export { FormatterOptions };

export const format2 = function* (
  rows: Iterable<RowArray>,
  options_?: FormatterOptionsArgs,
): Generator {
  const options = new FormatterOptions(options_);
  const REPLACE_REGEXP = new RegExp(options.quote, 'g');
  const escapePattern = `[${options.delimiter}${escapeRegExp(options.rowDelimiter)}|\r|\n]`;
  const ESCAPE_REGEXP = new RegExp(escapePattern);

  const ctx = {
    hasWrittenHeaders: false,
    rowCount: 0,
    REPLACE_REGEXP,
    ESCAPE_REGEXP
  };
  let rowIndex = 0;
  for (const row of rows) {
    if (rowIndex > 0) {
      yield options.rowDelimiter;
    }
    for (const chunk of formatRow(ctx, row, options)) {
      yield chunk;
    }
    rowIndex++;
    ctx.rowCount += 1;
  }
};

