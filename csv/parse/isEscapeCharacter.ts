import { TokenOptions } from './options';

const isEscapeCharacter = (content: string, { escapeChar }: TokenOptions): boolean =>
  content === escapeChar;

export default isEscapeCharacter;
