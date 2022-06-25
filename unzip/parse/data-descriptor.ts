import BufferReader from '../../binary/BufferReader';

export interface DataDescriptor {
  compressedSize: number;
  crc32: number;
  dataDescriptorSignature: number;
  uncompressedSize: number;
}

const readDataDescriptor = async (reader: BufferReader): Promise<DataDescriptor> => {
  await reader.pull(16, true);
  const dataDescriptorSignature = reader.word32lu();
  const crc32 = reader.word32lu();
  const compressedSize = reader.word32lu();
  const uncompressedSize = reader.word32lu();

  const descriptor = {
    compressedSize,
    crc32,
    dataDescriptorSignature,
    uncompressedSize
  };

  return descriptor;
};

export default readDataDescriptor;
