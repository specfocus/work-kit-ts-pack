import packBigUint64BE from './packBigUint64BE';
import packBigUint64LE from './packBigUint64LE';
import packBigInt64BE from './packBigInt64BE';
import packBigInt64LE from './packBigInt64LE';

export type BigIntegerArray = bigint[];

export type Write = (value: bigint, offset: number) => void;

interface BigIntegerOptions {
  endian: 'big' | 'little';
  signed?: boolean;
}

export const packBigInteger = (source: BigIntegerArray, { endian, signed }: BigIntegerOptions): Buffer => {
  if (endian === 'big') {
    return signed ? packBigInt64BE(source) : packBigUint64BE(source);
  }
  return signed ? packBigInt64LE(source) : packBigUint64LE(source);
}

export default packBigInteger;
