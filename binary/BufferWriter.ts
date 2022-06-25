class BufferWriter {
  private _offset: number = 0;
  private _buffer: Buffer;

  constructor(buffer: Buffer) {
    this._buffer = buffer;
  }

  get buffer(): Buffer {
    return this._buffer;
  }

  get offset(): number {
    return this._offset;
  }

  public readonly writeBigInt64BE = (value: bigint): number => {
    const size = this._buffer.writeBigInt64BE(value, this._offset);
    this._offset += 8;
    return size;
  }

  public readonly writeBigInt64LE = (value: bigint): number => {
    const size = this._buffer.writeBigInt64LE(value, this._offset);
    this._offset += 8;
    return size;
  }

  public readonly writeBigUint64BE = (value: bigint): number => {
    const size = this._buffer.writeBigUint64BE(value, this._offset);
    this._offset += 8;
    return size;
  }

  public readonly writeBigUint64LE = (value: bigint): number => {
    const size = this._buffer.writeBigUint64LE(value, this._offset);
    this._offset += 8;
    return size;
  }

  public readonly writeInt8 = (value: number): number => {
    const size = this._buffer.writeInt8(value, this._offset);
    this._offset += 1;
    return size;
  }

  public readonly writeInt16BE = (value: number): number => {
    const size = this._buffer.writeInt16BE(value, this._offset);
    this._offset += 2;
    return size;
  }

  public readonly writeInt16LE = (value: number): number => {
    const size = this._buffer.writeInt16LE(value, this._offset);
    this._offset += 2;
    return size;
  }

  public readonly writeInt32BE = (value: number): number => {
    const size = this._buffer.writeInt32BE(value, this._offset);
    this._offset += 4;
    return size;
  }

  public readonly writeInt32LE = (value: number): number => {
    const size = this._buffer.writeInt32LE(value, this._offset);
    this._offset += 4;
    return size;
  }

  public readonly writeIntBE = (value: number, bytes: number): number => {
    const size = this._buffer.writeIntBE(value, this._offset, bytes);
    this._offset += bytes;
    return size;
  }

  public readonly writeIntLE = (value: number, bytes: number): number => {
    const size = this._buffer.writeIntLE(value, this._offset, bytes);
    this._offset += bytes;
    return size;
  }

  public readonly writeUInt8 = (value: number): number => {
    const size = this._buffer.writeInt8(value, this._offset);
    this._offset += 1;
    return size;
  }

  public readonly writeUint16BE = (value: number): number => {
    const size = this._buffer.writeUint16BE(value, this._offset);
    this._offset += 2;
    return size;
  }

  public readonly writeUint16LE = (value: number): number => {
    const size = this._buffer.writeUint16LE(value, this._offset);
    this._offset += 2;
    return size;
  }

  public readonly writeUint32BE = (value: number): number => {
    const size = this._buffer.writeUint32BE(value, this._offset);
    this._offset += 4;
    return size;
  }

  public readonly writeUint32LE = (value: number): number => {
    const size = this._buffer.writeUint32LE(value, this._offset);
    this._offset += 4;
    return size;
  }

  public readonly writeUIntBE = (value: number, bytes: number): number => {
    const size = this._buffer.writeUIntBE(value, this._offset, bytes);
    this._offset += bytes;
    return size;
  }

  public readonly writeUIntLE = (value: number, bytes: number): number => {
    const size = this._buffer.writeUIntLE(value, this._offset, bytes);
    this._offset += bytes;
    return size;
  }

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
}

export default BufferWriter;
