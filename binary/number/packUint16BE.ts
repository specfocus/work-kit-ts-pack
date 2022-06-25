const BYTES = 2;

const packUint16BE = (source: number[]): Buffer => {
  const allocSize = BYTES * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeUint16BE(int, offset);
    offset += BYTES;
  }
  return buffer;
};

export default packUint16BE;
