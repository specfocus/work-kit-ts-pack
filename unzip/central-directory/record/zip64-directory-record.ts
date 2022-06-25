import BufferReader from '../../../binary/BufferReader';

export const ZIP64 = 'zip64';

export interface Zip64DirectoryRecord {
  diskNumber: number;
  diskStart: number;
  numberOfRecords: number;
  numberOfRecordsOnDisk: number;
  offsetToStartOfCentralDirectory: number;
  signature: number;
  sizeOfCentralDirectory: number;
  type: typeof ZIP64;
  version: number;
  versionsNeededToExtract: number;
}

// Zip64 File Format Notes: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
const readZip64DirectoryRecord = (reader: BufferReader): Zip64DirectoryRecord => {
  const signature = reader.word32lu();
  const sizeOfCentralDirectory = reader.word64lu();
  const version = reader.word16lu();
  const versionsNeededToExtract = reader.word16lu();
  const diskNumber = reader.word32lu();
  const diskStart = reader.word32lu();
  const numberOfRecordsOnDisk = reader.word64lu();
  const numberOfRecords = reader.word64lu();
  const sizeOfCentralDirectory2 = reader.word64lu();
  const offsetToStartOfCentralDirectory = reader.word64lu();

  if (signature != 0x06064b50) {
    throw new Error('invalid zip64 end of central dir locator signature (0x06064b50): 0x0' + signature.toString(16));
  }

  const record: Zip64DirectoryRecord = {
    diskNumber,
    diskStart,
    numberOfRecords,
    numberOfRecordsOnDisk,
    offsetToStartOfCentralDirectory,
    signature,
    sizeOfCentralDirectory,
    type: ZIP64,
    version,
    versionsNeededToExtract
  };

  console.log(
    'Zip64 Directory Record',
    JSON.stringify(record, null, 2),
    JSON.stringify({ sizeOfCentralDirectory2 }, null, 2),
  );

  return record;
}

export default readZip64DirectoryRecord;
