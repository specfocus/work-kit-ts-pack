import assert from 'assert';
import BufferWriter from '../../binary/BufferWriter';

const FILE_RECORD_SIZE = 30;
const FILE_RECORD_SIGNATURE = 30;

export interface FileRecord {
  compressedSize: number;
  compressionMethod: number;
  crc32: number;
  extraFieldLength: number;
  fileNameLength: number;
  flags: number;
  lastModifiedDate: number;
  lastModifiedTime: number;
  signature: number;
  versionsNeededToExtract: number;
  uncompressedSize: number;
}

const allocFileRecord = (record: FileRecord): Buffer => {
  const size = FILE_RECORD_SIZE;
  return Buffer.alloc(size);
}


const writeFileRecord = (record: FileRecord): Buffer => {
  const writer = new BufferWriter(allocFileRecord(record));

  writer.writeUint32LE(FILE_RECORD_SIGNATURE);
  writer.writeUint16LE(record.versionsNeededToExtract);
  writer.writeUint16LE(record.flags);
  writer.writeUint16LE(record.compressionMethod);
  writer.writeUint16LE(record.lastModifiedTime);
  writer.writeUint16LE(record.lastModifiedDate);
  writer.writeUint32LE(record.crc32);
  writer.writeUint32LE(record.compressedSize);
  writer.writeUint32LE(record.uncompressedSize);
  writer.writeUint16LE(record.fileNameLength);
  writer.writeUint16LE(record.extraFieldLength);

  assert(writer.offset === writer.buffer.length);

  return writer.buffer;
};

export default writeFileRecord;
