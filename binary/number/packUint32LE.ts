const BYTES = 4;

const packUint32LE = (source: number[]): Buffer => {
  const allocSize = BYTES * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeUint32LE(int, offset);
    offset += BYTES;
  }
  return buffer;
};

export default packUint32LE;
