const isRowDelimiter = (content: string): boolean =>
  content === '\r' || content === '\n' || content === '\r\n';

export default isRowDelimiter;
