import bigInt from 'big-integer';

export type BigInteger = bigInt.BigInteger;
export type BigNumber = bigInt.BigNumber;
export type AsyncBufferIterator = AsyncIterator<Buffer, Buffer, undefined>;

class Cipher {
  private static table: bigint[];

  private static crc = (ch: BigNumber, crc: BigInteger): BigInteger => {
    const val = typeof ch === 'string' ? ch.charCodeAt(0) : ch;
    const key = crc.xor(val).and(0xff).valueOf();
    return (crc.shiftRight(8).and(0xffffff)).xor(Cipher.table[key]);
  };

  private static generateTable = () => {
    const poly = 0xEDB88320;
    const table = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? poly ^ (c >>> 1) : c = c >>> 1;
      }
      table[n] = BigInt(c >>> 0);
    }
    Cipher.table = table;
  };

  private key0: BigInteger = bigInt(305419896);
  private key1: BigInteger = bigInt(591751049);
  private key2: BigInteger = bigInt(591751049);

  constructor(seed: string = '') {
    if (!Cipher.table) {
      Cipher.generateTable();
    }
    String(seed).split('').forEach(d => this.update(d));
  }

  decrypt = (chunk: Buffer, offset = 0, length: number | undefined = undefined): void => {
    const eof = length ? offset + length : chunk.length;
    for (let i = offset; i < eof; i++) {
      chunk[i] = this.decryptByte(chunk[i]);
    }
  }

  decryptByte = (c: number) => {
    const k = bigInt(this.key2).or(2);
    c = c ^ bigInt(k).multiply(bigInt(k.valueOf() ^ 1)).shiftRight(8).and(255).valueOf();
    this.update(c);
    return c;
  };

  update = (h: number | string): void => {
    this.key0 = Cipher.crc(h, this.key0);
    this.key1 = this.key0.and(255).and(4294967295).add(this.key1);
    this.key1 = this.key1.multiply(134775813).add(1).and(4294967295);
    this.key2 = Cipher.crc(this.key1.shiftRight(24).and(255).valueOf(), this.key2);
  };
}

export default Cipher;
