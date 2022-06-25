import { FormatterOptions } from './options';

const quoteField = (field: string, options: FormatterOptions): string => {
  const { quote } = options;
  return `${quote}${field}${quote}`;
};

export default quoteField;
