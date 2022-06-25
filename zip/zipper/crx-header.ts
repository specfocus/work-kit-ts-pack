import assert from 'assert';
import BufferWriter from '../../binary/BufferWriter';

export const CRX_HEADER_SIZE = 16;
export const CRX_HEADER_SIGNATURE = 0x34327243;

export interface CrxHeader {
  publicKey: Buffer;
  signature: Buffer;
  version: number;
  size: number;
}

const allowCrxHeader = ({ publicKey, signature }: CrxHeader) => {
  const size = CRX_HEADER_SIZE;
  return Buffer.alloc(size);
};

const writeCrxHeader = (header: CrxHeader): Buffer => {
  const writer = new BufferWriter(allowCrxHeader(header));

  writer.writeUint32LE(CRX_HEADER_SIGNATURE);
  writer.writeUint32LE(header.version);
  writer.writeUint32LE(header.publicKey.length);
  writer.writeUint32LE(header.signature.length);

  assert(writer.offset === writer.buffer.length);

  return writer.buffer;
};

export default writeCrxHeader;
