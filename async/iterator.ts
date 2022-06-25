const asyncIterator = <T>(
  asyncIterable: AsyncIterable<T>
): AsyncIterator<T, T, undefined> => {
  const { [Symbol.asyncIterator]: generator } = asyncIterable;
  return generator.call(asyncIterable);
}

export default asyncIterator;