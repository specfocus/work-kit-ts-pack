import packUintBE from './packUintBE';
import packUintLE from './packUintLE';
import packIntBE from './packIntBE';
import packIntLE from './packIntLE';

export type IntegerArray = number[];

type ByteLength = 1 | 2 | 3 | 4 | 5 | 6;
interface BigIntegerOptions {
  bytes: ByteLength;
  endian: 'big' | 'little';
  signed?: boolean;
}

export const packInteger = (source: IntegerArray, { bytes, endian, signed }: BigIntegerOptions): Buffer => {
  if (endian === 'big') {
    return signed ? packIntBE(source, bytes) : packUintBE(source, bytes);
  }
  return signed ? packIntLE(source, bytes) : packUintLE(source, bytes);
}

export default packInteger;
