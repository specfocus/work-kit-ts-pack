const BYTES = 8;

const packDoubleLE = (source: number[]): Buffer => {
  const allocSize = BYTES * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeDoubleLE(int, offset);
    offset += BYTES;
  }
  return buffer;
};

export default packDoubleLE;
