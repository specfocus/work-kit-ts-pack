import BufferReader from '../../../binary/BufferReader';

export interface Zip64Header {
  diskNumber: number;
  numberOfDisks: number;
  offsetToStartOfCentralDirectory: number;
  signature: number;
}

// Zip64 File Format Notes: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
const readZip64Header = async (reader: BufferReader): Promise<Zip64Header> => {
  await reader.pull(4);

  const signature = reader.word32lu();

  if (signature != 0x07064b50) {
    throw new Error('invalid zip64 end of central dir locator signature (0x07064b50): 0x' + signature.toString(16));
  }

  await reader.pull(16);

  const diskNumber = reader.word32lu();
  const offsetToStartOfCentralDirectory = reader.word64lu();
  const numberOfDisks = reader.word32lu();

  const root = {
    diskNumber,
    numberOfDisks,
    offsetToStartOfCentralDirectory,
    signature,
  };

  console.log(
    'Zip64 Root',
    JSON.stringify(root, null, 2)
  );

  return root;
};

export default readZip64Header;
