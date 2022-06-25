import { read } from '../../binary';
import describeEntry from '../entry-record/describe-entry';
import type { EntryRecord } from '../entry-record';
import readExtraFields from '../entry-record/extra-fields';
import { Source } from '../source';
import Cipher from '../../binary/cipher';
import inflate from './inflate';
import readFileRecord from './file-record';

export interface ExtractParams {
  passThrough?: boolean;
  password?: string;
}

const unzip = async function* (
  source: Source,
  entry: EntryRecord,
  params: ExtractParams
): AsyncGenerator<Buffer> {
  let offset = entry.offsetToLocalFileHeader;
  const reader = read(source.stream(offset));
  const header = await readFileRecord(reader);

  console.log(JSON.stringify({ header, entry }, null, 2));

  const fileName = await reader.promiseString(header.fileNameLength);
  const extra = readExtraFields(reader.slice(header.extraFieldLength));

  const {
    checkSum,
    isEncrypted,
  } = describeEntry(entry);

  let compressedSize = header.compressedSize;
  let cipher: Cipher | null = null;

  if (isEncrypted) {
    if (!params.password) {
      throw new Error('MISSING_PASSWORD');
    }
    await reader.pull(12);
    const encryptionHeader = reader.slice(12);
    cipher = new Cipher(params.password);
    cipher.decrypt(encryptionHeader);
    if (checkSum !== encryptionHeader[11]) {
      throw new Error('BAD_PASSWORD');
    }
    compressedSize -= 12;
  }

  offset += reader.offset;

  console.log(JSON.stringify({ compressedSize, offset, fileName, extra }, null, 2));

  let src = source.stream(offset, compressedSize);

  if (!params.passThrough && header.compressionMethod) {
    src = inflate(src, entry);
  }

  for await (const chunk of src) {
    if (!params.passThrough && cipher) {
      cipher.decrypt(chunk);
    }
    yield chunk;
  }
};

export default unzip;
