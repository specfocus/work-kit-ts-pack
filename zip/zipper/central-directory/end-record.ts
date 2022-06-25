import BufferWriter from '../../../binary/BufferWriter';

const END_OF_CENTRAL_DIRECTORY_RECORD_SIZE = 22;
const END_OF_CENTRAL_DIRECTORY_RECORD_SIGNATURE = 101010256;

export const ZIP = 'zip';

export interface EndOfCentralDirectoryRecord {
  commentLength: number;
  diskNumber: number;
  diskStart: number;
  numberOfRecords: number;
  numberOfRecordsOnDisk: number;
  offsetToStartOfCentralDirectory: number;
  signature: number;
  sizeOfCentralDirectory: number;
}

export interface EndOfCentralDirectory extends Omit<EndOfCentralDirectoryRecord, 'commentLength'> {
  comment: string;
  type: typeof ZIP;
}

const allocEndOfCentralDirectoryRecord = (record: EndOfCentralDirectoryRecord): Buffer => {
  const size = END_OF_CENTRAL_DIRECTORY_RECORD_SIZE;
  return Buffer.alloc(size);
}

const readEndOfCentralDirectoryRecord = (record: EndOfCentralDirectoryRecord): Buffer => {
  const writer = new BufferWriter(allocEndOfCentralDirectoryRecord(record));

  writer.writeUint32LE(END_OF_CENTRAL_DIRECTORY_RECORD_SIGNATURE);
  writer.writeUint16LE(record.diskNumber);
  writer.writeUint16LE(record.diskStart);
  writer.writeUint16LE(record.numberOfRecordsOnDisk);
  writer.writeUint16LE(record.numberOfRecords);
  writer.writeUint32LE(record.sizeOfCentralDirectory);
  writer.writeUint32LE(record.offsetToStartOfCentralDirectory);
  writer.writeUint16LE(record.commentLength);

  // const comment = await writer.promiseString(commentLength);

  return writer.buffer;
};

export default readEndOfCentralDirectoryRecord;
