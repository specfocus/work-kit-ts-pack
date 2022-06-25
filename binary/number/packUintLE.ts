type ByteLength = 1 | 2 | 3 | 4 | 5 | 6;

const packUintLE = (source: number[], byteLength: ByteLength): Buffer => {
  const allocSize = byteLength * source.length;
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const int of source) {
    buffer.writeUintLE(int, offset, byteLength);
    offset += byteLength;
  }
  return buffer;
};

export default packUintLE;
