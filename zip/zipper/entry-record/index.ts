import assert from 'assert';
import BufferWriter from '../../../binary/BufferWriter';

export const ENTRY_RECORD_SIZE = 42;
export const ENTRY_RECORD_SIGNATURE = 33639248;

export interface EntryRecord {
  crc32: number;
  compressedSize: number;
  compressionMethod: number;
  diskNumber: number;
  externalFileAttributes: number;
  internalFileAttributes: number;
  flags: number;
  fileName: string;
  fileComment: string;
  lastModifiedDate: number;
  lastModifiedTime: number;
  offsetToLocalFileHeader: number;
  uncompressedSize: number;
  versionMadeBy: number;
  versionsNeededToExtract: number;
}

export const allocEntryRecord = ({ fileName, fileComment }: EntryRecord, extraField: Buffer): Buffer => {
  const size = ENTRY_RECORD_SIZE + fileName.length + fileComment.length + extraField.length;
  return Buffer.alloc(size);
}

const writeEntryRecord = (record: EntryRecord, extraField: Buffer): Buffer => {
  const writer = new BufferWriter(allocEntryRecord(record, extraField));

  writer.writeUint32LE(ENTRY_RECORD_SIGNATURE);
  writer.writeUint16LE(record.versionMadeBy);
  writer.writeUint16LE(record.versionsNeededToExtract);
  writer.writeUint16LE(record.flags);
  writer.writeUint16LE(record.compressionMethod);
  writer.writeUint16LE(record.lastModifiedDate);
  writer.writeUint16LE(record.lastModifiedTime);
  writer.writeUint32LE(record.crc32);
  writer.writeUint32LE(record.compressedSize);
  writer.writeUint32LE(record.uncompressedSize);
  writer.writeUint16LE(record.fileName.length);
  writer.writeUint16LE(extraField.length);
  writer.writeUint16LE(record.fileComment.length);
  writer.writeUint16LE(record.diskNumber);
  writer.writeUint16LE(record.internalFileAttributes);
  writer.writeUint32LE(record.externalFileAttributes);
  writer.writeUint32LE(record.offsetToLocalFileHeader);

  assert(writer.offset === writer.buffer.length);

  return writer.buffer;
}

export default writeEntryRecord;
