type ByteLength = 1 | 2 | 3 | 4 | 5 | 6;

const packIntBE = (source: number[], byteLength: ByteLength): Buffer => {
  const allocSize = byteLength * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeIntBE(int, offset, byteLength);
    offset += byteLength;
  }
  return buffer;
};

export default packIntBE;
