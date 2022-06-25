import { read } from '../../binary';
import readEntryRecord from '../entry-record';
import type { EntryRecord } from '../entry-record';
import type { Source } from '../source';
import type { CrxHeader } from '../crx-header';
import { fetchCrxHeader } from '../crx-header';
import type { CentralDirectoryRecord } from './record';
import fetchRecord from './record';

export interface CentralDirectory extends CentralDirectoryRecord {
  crx: CrxHeader | null;
  entries: EntryRecord[];
}

const fetchCentralDirectory = async (source: Source, tailSize = 80): Promise<CentralDirectory> => {
  const crx = await fetchCrxHeader(source);
  const record = await fetchRecord(source, crx, tailSize);
  const entries: EntryRecord[] = [];
  const reader = read(source.stream(record.offsetToStartOfCentralDirectory));

  for (let i = 0; i < record.numberOfRecords; i++) {
    const entry = await readEntryRecord(reader);
    entries.push(entry);
  }

  return {
    ...record,
    crx,
    entries
  };
}

export default fetchCentralDirectory;
