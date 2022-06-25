const BYTES = 8;

const packBigInt64BE = (source: bigint[]): Buffer => {
  const allocSize = BYTES * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeBigInt64BE(int, offset);
    offset += BYTES;
  }
  return buffer;
};

export default packBigInt64BE;
