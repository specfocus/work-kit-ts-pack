import decodeLEu from './leu';

// convert byte strings to signed little endian numbers
const decodeLEs = (bytes: Buffer): number => {
  let val: number = decodeLEu(bytes);
  // tslint:disable-next-line: no-bitwise
  if ((bytes[bytes.length - 1] & 0x80) === 0x80) {
      val -= Math.pow(256, bytes.length);
  }
  return val;
};

export default decodeLEs;
