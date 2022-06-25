import asyncIterator from '../async/iterator';
import BufferReader from './BufferReader';

export { BufferReader };

export const read = (asyncIterable: AsyncIterable<Buffer>): BufferReader =>
  new BufferReader({ iterator: asyncIterator(asyncIterable) });
