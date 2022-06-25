import { BufferReader, read } from '../binary';
import type { Source } from './source';

export interface CrxHeader {
  publicKey: Buffer;
  signature: Buffer;
  version: number;
  size: number;
}

const readCrxHeader = async (reader: BufferReader): Promise<CrxHeader | null> => {
  await reader.pull(4);
  const signature0: number = reader.slice(4).readUInt32LE(0);

  if (signature0 !== 0x34327243) {
    console.log(
      'CRX Header',
      '0x' + signature0.toString(16).padStart(8, '0'),
      'not 0x34327243',
    );
    return null;
  }

  await reader.pull(12, true);
  const version = reader.word32lu();
  const pubKeyLength = reader.word32lu();
  const signatureLength = reader.word32lu();

  await reader.pull(pubKeyLength + signatureLength);
  const publicKey = reader.slice(pubKeyLength);
  const signature = reader.slice(signatureLength);
  const crxHeader = {
    publicKey,
    signature,
    version,
    size: 16 + pubKeyLength + signatureLength
  };

  console.log(
    'CRX Header',
    JSON.stringify(crxHeader),
    {
      pubKeyLength,
      signatureLength
    }
  );

  return crxHeader;
};

export const fetchCrxHeader = async (source: Source): Promise<CrxHeader | null> => {
  const reader = read(source.stream(0, 22));
  return readCrxHeader(reader);
};

export default readCrxHeader;
