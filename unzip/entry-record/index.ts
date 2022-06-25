import BufferReader from '../../binary/BufferReader';
import readExtraFields from './extra-fields';

const NIL32 = 0xffffffff;

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

const readEntryRecord = async (reader: BufferReader): Promise<EntryRecord> => {
  await reader.pull(42, true);

  const signature = reader.word32lu();
  const versionMadeBy = reader.word16lu();
  const versionsNeededToExtract = reader.word16lu();
  const flags = reader.word16lu();
  const compressionMethod = reader.word16lu();
  const lastModifiedTime = reader.word16lu();
  const lastModifiedDate = reader.word16lu();
  const crc32 = reader.word32lu();
  let compressedSize = reader.word32lu();
  let uncompressedSize = reader.word32lu();
  const fileNameLength = reader.word16lu();
  const extraFieldLength = reader.word16lu();
  const fileCommentLength = reader.word16lu();
  const diskNumber = reader.word16lu();
  const internalFileAttributes = reader.word16lu();
  const externalFileAttributes = reader.word32lu();
  let offsetToLocalFileHeader = reader.word32lu();

  const fileName = await reader.promiseString(fileNameLength, true);

  await reader.pull(extraFieldLength, true);
  const extra = readExtraFields(reader.slice(extraFieldLength));

  if (extra) {
    if (compressedSize === NIL32) {
      compressedSize = extra.compressedSize;
    }

    if (uncompressedSize === NIL32) {
      uncompressedSize = extra.uncompressedSize;
    }

    if (offsetToLocalFileHeader === NIL32) {
      offsetToLocalFileHeader = extra.offset;
    }
  }

  const fileComment = await reader.promiseString(fileCommentLength);

  const header = {
    crc32,
    compressedSize,
    compressionMethod,
    diskNumber,
    externalFileAttributes,
    internalFileAttributes,
    flags,
    fileName,
    fileComment,
    lastModifiedTime,
    lastModifiedDate,
    offsetToLocalFileHeader,
    signature,
    uncompressedSize,
    versionMadeBy,
    versionsNeededToExtract
  };

  console.log(
    'Central Directory Entry Header',
    JSON.stringify(header, null, 2),
    JSON.stringify({
      extraFieldLength,
      fileCommentLength,
      fileNameLength
    }, null, 2),
  );

  return header;
};

export default readEntryRecord;
