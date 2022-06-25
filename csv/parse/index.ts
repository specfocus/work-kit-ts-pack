import { Row } from '../../types';
import { Scanner } from './Scanner';
import { ParseOptions } from './options';
import parseWithComments from './parseWithComments';
import parseWithoutComments from './parseWithoutComments';
import removeBOM from './removeBOM';

export type { ParseOptions } from './options';

export interface ParseResult {
  line: string;
  rows: string[][];
}

const asyncParse = async function* (
  asyncIterable: AsyncIterable<Buffer | string>,
  options: ParseOptions
): AsyncGenerator<Row, void, undefined> {
  const parse = options.supportsComments ? parseWithComments : parseWithoutComments;
  let result: ParseResult = { line: '', rows: [] };
  let scanner: Scanner;
  const opts = {
    escapedDelimiter: options.escapedDelimiter,
    hasMoreData: true,
  }
  for await (const chunk of asyncIterable) {
    let line = typeof chunk === 'string'
      ? chunk
      : chunk.toString(options.encoding);
    if (result.line?.length) {
      console.log('remaining', result.line);
      line = result.line.concat(line);
    }
    scanner = new Scanner({
      line: removeBOM(line),
    }, opts);
    result = parse(
      scanner,
      options
    );
    for (const row of result.rows) {
      yield row;
    }
  }
  if (result.line?.length) {
    console.log('remaining', result.line);
  }
  opts.hasMoreData = false;
  scanner = new Scanner({
    line: removeBOM(result.line),
  }, opts);
  result = parse(
    scanner,
    options
  );
  for (const row of result.rows) {
    yield row;
  }
};

export default asyncParse;
