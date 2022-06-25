import BufferReader from '../../../binary/BufferReader';

export const ZIP = 'zip';

export interface EndOfCentralDirectoryRecord {
  comment: string;
  diskNumber: number;
  diskStart: number;
  numberOfRecords: number;
  numberOfRecordsOnDisk: number;
  offsetToStartOfCentralDirectory: number;
  signature: number;
  sizeOfCentralDirectory: number;
  type: typeof ZIP;
}

const readEndOfCentralDirectoryRecord = async (reader: BufferReader): Promise<EndOfCentralDirectoryRecord> => {
  await reader.pull(22, true);

  const signature = reader.word32lu();
  const diskNumber = reader.word16lu();
  const diskStart = reader.word16lu();
  const numberOfRecordsOnDisk = reader.word16lu();
  const numberOfRecords = reader.word16lu();
  const sizeOfCentralDirectory = reader.word32lu();
  let offsetToStartOfCentralDirectory = reader.word32lu();
  const commentLength = reader.word16lu();

  const comment = await reader.promiseString(commentLength);

  const record: EndOfCentralDirectoryRecord = {
    comment,
    diskNumber,
    diskStart,
    numberOfRecords,
    numberOfRecordsOnDisk,
    offsetToStartOfCentralDirectory,
    signature,
    sizeOfCentralDirectory,
    type: ZIP
  };

  console.log(
    'End Of Central Directory Record',
    JSON.stringify(record, null, 2),
    JSON.stringify({ commentLength }, null, 2)
  );

  return record;
};

export default readEndOfCentralDirectoryRecord;
