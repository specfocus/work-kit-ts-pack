import asyncIterator from '../async/iterator';

export interface Cursor {
  index: number;
  offset: number;
}

const unpackString = (buffer: Buffer, index: number[], cursor: Cursor): string[] => {
  const result: string[] = [];
  while (cursor.index < index.length) {
    const length = index[cursor.index];
    const size = buffer.length - cursor.offset;
    if (size < length) {
      break;
    }
    result.push(buffer.toString('utf8', cursor.offset, length));
    cursor.offset += length;
  }
  return result;
};

export const asyncUnpackString = async function* (source: AsyncIterable<Buffer>, index: number[]): AsyncGenerator<string[], void, undefined> {
  const iterator = asyncIterator(source);
  const cursor = { index: 0, offset: 0 };
  let result = await iterator.next();
  let buffer = result.value;
  while (!result.done && cursor.index < index.length) {
    yield unpackString(buffer, index, cursor);
    result = await iterator.next();
    buffer = Buffer.concat([buffer, result.value]);
  }
};

export default unpackString;
