const buffer = (buffer: Buffer) => {
  const source = {
    stream: async function *(offset: number, length?: number): AsyncGenerator<Buffer, void, undefined> {
      yield buffer.slice(offset, length);
    },
    size: () => Promise.resolve(buffer.length)
  };
  return source;
};

export default buffer;
