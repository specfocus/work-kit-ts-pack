export const packString = (source: string[], encoding: BufferEncoding = 'utf8'): [Buffer, number[]] => {
  const index = source.map(str => str.length);
  const allocSize = source.reduce((acc, s) => acc + s.length, 0);
  const buffer = Buffer.alloc(allocSize);
  let offset = 0;
  for (const str of source) {
    buffer.writeUint16LE(str.length, offset);
    offset += buffer.write(str, offset, encoding);
  }
  return [buffer, index];
};

export default packString;
