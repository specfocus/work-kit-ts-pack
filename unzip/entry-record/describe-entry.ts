import type { EntryRecord } from '.';
import makeDateTime from './date-time';

export interface CentralDirectoryEntryFlags {
  checkSum: number;
  isDirectory: boolean;
  /** Password encrypted */
  isEncrypted: boolean;
  isFile: boolean;
  isUnicode: boolean;
  lastModified: Date;
};

const ENCRYPTED = 0x01;
const UNICODE = 0x800;
const TIME_SEEDED = 0x8;

const describeEntry = (file: EntryRecord): CentralDirectoryEntryFlags => {
  const isDirectory = file.uncompressedSize === 0 && /[\/\\]$/.test(file.fileName);
  const isEncrypted = (file.flags & ENCRYPTED) === ENCRYPTED;
  const lastModified = makeDateTime(file.lastModifiedDate, file.lastModifiedTime);
  return ({
    checkSum: (file.flags & TIME_SEEDED) === TIME_SEEDED ? (file.lastModifiedTime >> 8) & 0xff : (file.crc32 >> 24) & 0xff,
    isDirectory,
    isEncrypted,
    isFile: !isDirectory,
    isUnicode: (file.flags & UNICODE) === UNICODE,
    lastModified
  });
};

export default describeEntry;
