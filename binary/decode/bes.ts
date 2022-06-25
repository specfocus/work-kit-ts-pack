import decodeBEu from './beu';

// convert byte strings to signed big endian numbers
const decodeBEs = (bytes: Buffer): number => {
  let val = decodeBEu(bytes);
  if ((bytes[0] & 0x80) == 0x80) {
    val -= Math.pow(256, bytes.length);
  }
  return val;
};

export default decodeBEs;
