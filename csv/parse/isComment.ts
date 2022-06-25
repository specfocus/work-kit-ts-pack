import { TokenOptions } from './options';

const isComment = (content: string, { comment, supportsComments }: TokenOptions): boolean =>
  supportsComments && content === comment;

export default isComment;
