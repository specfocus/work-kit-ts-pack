const BYTES = 4;

const packFloatLE = (source: number[]): Buffer => {
  const allocSize = BYTES * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeFloatLE(int, offset);
    offset += BYTES;
  }
  return buffer;
};

export default packFloatLE;
