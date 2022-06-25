import BufferReader from '../../binary/BufferReader';

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

const readFileRecord = async (reader: BufferReader): Promise<FileRecord> => {
  await reader.pull(30);

  const signature = reader.word32lu();
  const versionsNeededToExtract = reader.word16lu();
  const flags = reader.word16lu();
  const compressionMethod = reader.word16lu();
  const lastModifiedTime = reader.word16lu();
  const lastModifiedDate = reader.word16lu();
  const crc32 = reader.word32lu();
  const compressedSize = reader.word32lu();
  const uncompressedSize = reader.word32lu();
  const fileNameLength = reader.word16lu();
  const extraFieldLength = reader.word16lu();

  const record: FileRecord = {
    compressedSize,
    compressionMethod,
    crc32,
    extraFieldLength,
    fileNameLength,
    flags,
    lastModifiedDate,
    lastModifiedTime,
    signature,
    versionsNeededToExtract,
    uncompressedSize
  };

  return record;
};

export default readFileRecord;
