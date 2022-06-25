const BYTES = 8;

const packDoubleBE = (source: number[]): Buffer => {
  const allocSize = BYTES * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeDoubleBE(int, offset);
    offset += BYTES;
  }
  return buffer;
};

export default packDoubleBE;
