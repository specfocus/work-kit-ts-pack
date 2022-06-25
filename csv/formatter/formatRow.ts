import { RowArray } from '../../types';
import checkHeaders from './checkHeaders';
import formatColumns from './formatColumns';
import { FieldContext } from './formatField';
import gatherColumns from './gatherColumns';
import { FormatterOptions } from './options';

export interface FormatterContext extends FieldContext {
  hasWrittenHeaders: boolean;
  rowCount: number;
}

export const formatRow = function* (
  ctx: FormatterContext,
  row: RowArray,
  options: FormatterOptions
): Generator<string, void, undefined> {
  const { shouldFormatColumns, headers } = checkHeaders(ctx, row, options);
  if (options.shouldWriteHeaders && headers && !ctx.hasWrittenHeaders) {
    for (const chunk of formatColumns(ctx, headers, true, options)) {
      yield chunk;
    }
    ctx.hasWrittenHeaders = true;
  }
  if (shouldFormatColumns) {
    const columns = gatherColumns(row, options);
    for (const chunk of formatColumns(ctx, columns, false, options)) {
      yield chunk;
    }
  }
};

export default formatRow;
