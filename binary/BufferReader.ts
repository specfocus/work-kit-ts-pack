import decodeBEs from './decode/bes';
import decodeBEu from './decode/beu';
import decodeLEs from './decode/les';
import decodeLEu from './decode/leu';

const EOF_MESSAGE = 'eof_unexpected';
const EMPTY: AsyncIterator<Buffer, Buffer, undefined> = {
  next: () => Promise.resolve({ done: true, value: Buffer.from([]) })
};

export type AsyncBufferIterator = AsyncIterator<Buffer, Buffer, undefined>;

export interface BufferReaderOptions {
  buffer?: Buffer;
  offset?: number;
  iterator?: AsyncBufferIterator;
}

/** Simple Buffer reader */
class BufferReader implements AsyncIterable<Buffer> {
  static generator = async function* (this: BufferReader): AsyncGenerator<Buffer, void, undefined> {
    const cached = this._buffer;
    this._buffer = Buffer.from([]);
    this._offset = 0;
    yield cached;

    while (true) {
      const { done, value } = await this._iterator.next();
      if (done) {
        this._eoi = true;
        break;
      }
      yield value;
    }
  }

  protected _buffer: Buffer;
  protected _iterator: AsyncBufferIterator;
  protected _offset: number;
  protected _eoi: boolean;

  constructor({
    buffer,
    offset,
    iterator
  }: BufferReaderOptions) {
    this._buffer = buffer || Buffer.from([]);
    this._offset = offset || 0;
    this._iterator = (iterator || EMPTY) as AsyncBufferIterator;
    this._eoi = !iterator;
  }

  public readonly [Symbol.asyncIterator] = BufferReader.generator.bind(this);

  get buffer(): Buffer {
    return this._buffer;
  }

  get offset(): number {
    return this._offset;
  }

  get eof(): boolean {
    return this._eoi && this._offset >= this._buffer.length;
  }

  public readonly promiseString = async (bytes: number, extrict?: boolean, encoding: BufferEncoding = 'utf8'): Promise<string> => {
    await this.pull(bytes, extrict);
    return this.toString(
      bytes,
      encoding
    );
  }

  public readonly match = async (eof: Buffer, extrict?: boolean): Promise<number> => {
    let start = 0, index = this._buffer.indexOf(eof);
    while (index === -1) {
      const { done, value } = await this._iterator.next();
      console.log({ done, value, length: value?.length });
      if (done) {
        this._eoi = true;
        break;
      }
      start = this._buffer.length;
      this._buffer = Buffer.concat([this._buffer, value]);
      index = this._buffer.indexOf(eof, start);
    }
    return index;
  }

  public readonly pull = async (bytes: number, extrict?: boolean): Promise<boolean> => {
    while (this._buffer.length < bytes) {
      const { done, value } = await this._iterator.next();
      if (done) {
        this._eoi = true;
        break;
      }
      this._buffer = Buffer.concat([this._buffer, value]);
    }

    const success = this._buffer.length >= bytes;

    if (!success && extrict) {
      throw new Error(EOF_MESSAGE);
    }

    return success;
  };

  public readonly readBigInt64BE = (): bigint => {
    const value = this._buffer.readBigInt64BE(this._offset);
    this._offset += 8;
    return value;
  }

  public readonly readBigInt64LE = (): bigint => {
    const value = this._buffer.readBigInt64LE(this._offset);
    this._offset += 8;
    return value;
  }

  public readonly readBigUint64BE = (): bigint => {
    const value = this._buffer.readBigUint64BE(this._offset);
    this._offset += 8;
    return value;
  }

  public readonly readBigUint64LE = (): bigint => {
    const value = this._buffer.readBigUint64LE(this._offset);
    this._offset += 8;
    return value;
  }

  public readonly readInt8 = (): number => {
    const value = this._buffer.readInt8(this._offset);
    this._offset += 1;
    return value;
  }

  public readonly readInt16BE = (): number => {
    const value = this._buffer.readInt16BE(this._offset);
    this._offset += 2;
    return value;
  }

  public readonly readInt16LE = (): number => {
    const value = this._buffer.readInt16LE(this._offset);
    this._offset += 2;
    return value;
  }

  public readonly readInt32BE = (): number => {
    const value = this._buffer.readInt32BE(this._offset);
    this._offset += 4;
    return value;
  }

  public readonly readInt32LE = (): number => {
    const value = this._buffer.readInt32LE(this._offset);
    this._offset += 4;
    return value;
  }

  public readonly readIntBE = (bytes: number): number => {
    const value = this._buffer.readIntBE(this._offset, bytes);
    this._offset += bytes;
    return value;
  }

  public readonly readIntLE = (bytes: number): number => {
    const value = this._buffer.readIntLE(this._offset, bytes);
    this._offset += bytes;
    return value;
  }

  public readonly readUInt8 = (): number => {
    const value = this._buffer.readInt8(this._offset);
    this._offset += 1;
    return value;
  }

  public readonly readUint16BE = (): number => {
    const value = this._buffer.readUint16BE(this._offset);
    this._offset += 2;
    return value;
  }

  public readonly readUint16LE = (): number => {
    const value = this._buffer.readUint16LE(this._offset);
    this._offset += 2;
    return value;
  }

  public readonly readUint32BE = (): number => {
    const value = this._buffer.readUint32BE(this._offset);
    this._offset += 4;
    return value;
  }

  public readonly readUint32LE = (): number => {
    const value = this._buffer.readUint32LE(this._offset);
    this._offset += 4;
    return value;
  }

  public readonly readUIntBE = (bytes: number): number => {
    const value = this._buffer.readUIntBE(this._offset, bytes);
    this._offset += bytes;
    return value;
  }

  public readonly readUIntLE = (bytes: number): number => {
    const value = this._buffer.readUIntLE(this._offset, bytes);
    this._offset += bytes;
    return value;
  }

  public readonly readBEs = (bytes: number): number => {
    const start = this._offset;
    const end = start + bytes;
    this._offset = end;
    return decodeBEs(this._buffer.slice(start, end));
  };

  public readonly readBEu = (bytes: number): number => {
    const start = this._offset;
    const end = start + bytes;
    this._offset = end;
    return decodeBEu(this._buffer.slice(start, end));
  };

  public readonly readLEs = (bytes: number): number => {
    const start = this._offset;
    const end = start + bytes;
    this._offset = end;
    return decodeLEs(this._buffer.slice(start, end));
  };

  public readonly readLEu = (bytes: number): number => {
    const start = this._offset;
    const end = start + bytes;
    this._offset = end;
    return decodeLEu(this._buffer.slice(start, end));
  };

  public readonly slice = (bytes: number): Buffer => {
    const start = this._offset;
    const end = start + bytes;
    this._offset = end;
    return this._buffer.slice(
      start,
      Math.min(end, this._buffer.length)
    );
  };

  public readonly skip = (bytes: number): void => {
    this._offset += bytes;
  };

  public readonly toString = (bytes: number, encoding: BufferEncoding = 'utf8'): string => {
    const start = this._offset;
    const end = start + bytes;
    this._offset = end;
    return this._buffer.toString(
      encoding,
      start,
      Math.min(end, this._buffer.length)
    );
  }

  word8 = () => this.readBEu(1);
  word8u = () => this.readBEu(1);
  word8s = () => this.readBEs(1);

  word8be = () => this.readBEu(1);
  word8bs = () => this.readBEs(1);
  word8bu = () => this.readBEu(1);
  word8le = () => this.readLEu(1);
  word8ls = () => this.readLEs(1);
  word8lu = () => this.readLEu(1);

  word16be = () => this.readBEu(2);
  word16bs = () => this.readBEs(2);
  word16bu = () => this.readBEu(2);
  word16le = () => this.readLEu(2);
  word16ls = () => this.readLEs(2);
  word16lu = () => this.readLEu(2);

  word32be = () => this.readBEu(4);
  word32bs = () => this.readBEs(4);
  word32bu = () => this.readBEu(4);
  word32le = () => this.readLEu(4);
  word32ls = () => this.readLEs(4);
  word32lu = () => this.readLEu(4);

  word64be = () => this.readBEu(8);
  word64bs = () => this.readBEs(8);
  word64bu = () => this.readBEu(8);
  word64le = () => this.readLEu(8);
  word64ls = () => this.readLEs(8);
  word64lu = () => this.readLEu(8);
}

export default BufferReader;
