import { isBoolean } from '@specfocus/main-focus/types/boolean';
import { FormatterOptions } from './options';

const shouldQuote = (fieldIndex: number, isHeader: boolean, options: FormatterOptions): boolean => {
  const quoteConfig = isHeader ? options.quoteHeaders : options.quoteColumns;
  if (isBoolean(quoteConfig)) {
    return quoteConfig;
  }
  if (Array.isArray(quoteConfig)) {
    return quoteConfig[fieldIndex];
  }
  if (options.headers !== null) {
    return quoteConfig[options.headers[fieldIndex]];
  }
  return false;
};

export default shouldQuote;
