import BufferReader from '../../binary/BufferReader';
import type { CrxHeader } from '../crx-header';
import readCrxHeader from '../crx-header';
import type { EndOfCentralDirectoryRecord } from '../central-directory/record/end-record';
import readEndOfCentralDirectoryRecord from '../central-directory/record/end-record';
import type { EntryRecord } from '../entry-record';
import readEntryRecord from '../entry-record';
import type { FileRecord } from '../extract/file-record';
import readFileRecord from '../extract/file-record';

type ZipRecord = CrxHeader | EntryRecord | EndOfCentralDirectoryRecord | FileRecord;

const readRecord = async (reader: BufferReader, ctx: any): Promise<ZipRecord | null> => {
  await reader.pull(4);
  if (reader.buffer.length === 0) {
    return null;
  }
  const signature = reader.buffer.readUInt32LE(0);
  if (signature === 875721283) {
    return readCrxHeader(reader);
  }
  if (signature === 67324752) {
    return readFileRecord(reader);
  }
  if (signature === 33639248) {
    ctx.reachedCD = true;
    return readEntryRecord(reader);
  }
  if (signature === 101010256) {
    return readEndOfCentralDirectoryRecord(reader);
  }

  if (ctx.reachedCD) {
    // readEndOfCentralDirectoryRecord expects the EOCD
    // signature to be consumed so set includeEof=true
    const includeEof = true;
    /*
    //@ts-ignore
    return reader.pull(endDirectorySignature, includeEof).then(
      () => readEndOfCentralDirectoryRecord(reader)
    );
    */
  }
  ctx.error = new Error('invalid signature: 0x' + signature.toString(16));
  return null;
};

export default readRecord;
