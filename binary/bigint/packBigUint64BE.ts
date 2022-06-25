const BYTES = 8;

const packBigUint64BE = (source: bigint[]): Buffer => {
  const allocSize = BYTES * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeBigUint64BE(int, offset);
    offset += BYTES;
  }
  return buffer;
};

export default packBigUint64BE;
