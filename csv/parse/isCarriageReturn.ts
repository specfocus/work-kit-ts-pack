import { TokenOptions } from './options';

const isCarriageReturn = (content: string, { carriageReturn }: TokenOptions): boolean =>
  content === carriageReturn;

export default isCarriageReturn;
