const BYTES = 8;

const packBigUint64LE = (source: bigint[]): Buffer => {
  const allocSize = BYTES * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeBigUint64LE(int, offset);
    offset += BYTES;
  }
  return buffer;
};

export default packBigUint64LE;
