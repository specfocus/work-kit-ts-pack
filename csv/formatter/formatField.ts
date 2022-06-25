
import isNil from 'lodash.isnil';
import { Row, Value } from '../../types';
import { FormatterOptions } from './options';
import quoteField from './quoteField';
import shouldQuote from './shouldQuote';

export interface FieldContext {
  REPLACE_REGEXP: RegExp;
  ESCAPE_REGEXP: RegExp;
}

export const formatField = (
  ctx: FieldContext,
  field: Value,
  fieldIndex: number,
  isHeader: boolean,
  options: FormatterOptions
): string => {
  const preparedField = `${isNil(field) ? '' : field}`.replace(/\0/g, '');
  if (options.quote !== '') {
    const shouldEscape = preparedField.indexOf(options.quote) !== -1;
    if (shouldEscape) {
      return quoteField(preparedField.replace(ctx.REPLACE_REGEXP, options.escapedQuote), options);
    }
  }
  const hasEscapeCharacters = preparedField.search(ctx.ESCAPE_REGEXP) !== -1;
  if (hasEscapeCharacters || shouldQuote(fieldIndex, isHeader, options)) {
    return quoteField(preparedField, options);
  }
  return preparedField;
};
