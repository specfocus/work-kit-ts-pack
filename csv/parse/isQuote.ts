import { TokenOptions } from './options';

const isQuote = (content: string, { quote }: TokenOptions): boolean =>
  content === quote;

export default isQuote;
