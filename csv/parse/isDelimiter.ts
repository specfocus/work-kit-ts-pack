import { TokenOptions } from './options';

const isDelimiter = (content: string, { delimiter }: TokenOptions): boolean =>
  content === delimiter;

export default isDelimiter;
