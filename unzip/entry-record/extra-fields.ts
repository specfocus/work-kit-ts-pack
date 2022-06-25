import BufferReader from '../../binary/BufferReader';

export interface ExtraField {
  compressedSize: number;
  disknum: number;
  offset: number;
  partsize: number;
  signature: number;
  uncompressedSize: number;
}

const readExtraFields = (buffer: Buffer): ExtraField | undefined => {
  let extra: ExtraField | undefined;
  // Find the ZIP64 header, if present.
  while (buffer && buffer.length) {
    const reader = new BufferReader({ buffer: buffer });

    const signature = reader.word16lu();
    const partsize = reader.word16lu();

    if (signature === 0x0001) {
      const uncompressedSize = reader.word64lu();
      const compressedSize = reader.word64lu();
      const offset = reader.word64lu();
      const disknum = reader.word64lu();

      extra = {
        disknum,
        compressedSize,
        offset,
        partsize,
        signature,
        uncompressedSize
      };
      
      break;
    }

    // Advance the buffer to the next part.
    // The total size of this part is the 4 byte header + partsize.
    buffer = buffer.slice(partsize + 4);
  }

  return extra;
};

export default readExtraFields;
