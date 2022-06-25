import { BufferReader, read } from '../../../binary';
import type { Source } from '../../source';
import type { CrxHeader } from '../../crx-header';
import type { EndOfCentralDirectoryRecord } from './end-record';
import readEndOfCentralDirectoryRecord, { ZIP } from './end-record';
import readZip64Location from './zip64-directory-location';
import readZip64DirectoryRecord, { ZIP64 } from './zip64-directory-record';

export interface CentralDirectoryRecord extends Omit<EndOfCentralDirectoryRecord, 'type'> {
  crx: CrxHeader | null;
  type: typeof ZIP | typeof ZIP64;
}

const NIL16 = 0xffff;
const NIL32 = 0xffffffff;
const SIGNATURE = Buffer.alloc(4);
SIGNATURE.writeUInt32LE(0x06054b50, 0);

const fetchCentralDirectoryRecord = async (source: Source, crx: CrxHeader | null, tailSize = 80): Promise<CentralDirectoryRecord> => {
  const sourceSize = await source.size();
  let reader: BufferReader;

  reader = read(source.stream(sourceSize - tailSize));
  const index = await reader.match(SIGNATURE);

  if (index === -1) {
    throw Error('Not found');
  }
  reader.skip(index - reader.offset);

  const endOfCentralDirectoryRecord = await readEndOfCentralDirectoryRecord(reader);

  // Is this zip file using zip64 format? Use same check as Go:
  // https://github.com/golang/go/blob/master/src/archive/zip/reader.go#L503
  if (
    endOfCentralDirectoryRecord.numberOfRecords !== NIL16 &&
    endOfCentralDirectoryRecord.offsetToStartOfCentralDirectory !== NIL32
  ) {
    const startOffset = crx?.size || 0;
    endOfCentralDirectoryRecord.offsetToStartOfCentralDirectory += startOffset;
    return {
      ...endOfCentralDirectoryRecord,
      crx
    }
  }

  // For zip64 files, need to find zip64 central directory locator header to extract
  // relative offset for zip64 central directory record.
  // Offset to zip64 CDL is 20 bytes before normal CDR
  const zip64CDLSize = 20;
  const zip64CDLOffset = sourceSize - (tailSize - index + zip64CDLSize);

  reader = read(source.stream(zip64CDLOffset));
  reader.pull(zip64CDLSize);

  const d64loc = await readZip64Location(reader);
  reader = read(source.stream(d64loc.offsetToStartOfCentralDirectory));
  reader.pull(56);
  const zip64Directory = await readZip64DirectoryRecord(reader);

  return {
    crx,
    ...endOfCentralDirectoryRecord,
    ...zip64Directory
  }
};

export default fetchCentralDirectoryRecord;
