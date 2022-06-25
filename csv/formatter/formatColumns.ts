import { RowArray } from '../../types';
import { formatField } from './formatField';
import { FormatterContext } from './formatRow';
import { FormatterOptions } from './options';

const formatColumns = function* (
  ctx: FormatterContext,
  columns: RowArray,
  isHeadersRow: boolean,
  options: FormatterOptions
): Generator<string, void, undefined> {
  let fieldIndex = 0;
  for (const field of columns) {
    if (fieldIndex) {
      yield options.delimiter;
    }
    yield formatField(ctx, field, fieldIndex, isHeadersRow, options);
    fieldIndex++;
  }
};

export default formatColumns;
