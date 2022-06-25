import { createInflateRaw } from 'zlib';
import describeEntry from '../entry-record/describe-entry';
import { EntryRecord } from '../entry-record';

const inflate = async function* (input: AsyncIterable<Buffer>, entry: EntryRecord): AsyncGenerator<Buffer> {
  const {
    isEncrypted
  } = describeEntry(entry);
  const eof = Buffer.alloc(4);
  eof.writeUInt32LE(0x08074b50, 0);
  const fileSizeKnown = !isEncrypted || entry.compressedSize > 0;
  const output = createInflateRaw();
  let written = 0;
  for await (let chunk of input) {
    const size = written + chunk.length;
    const trim = fileSizeKnown ? size - entry.compressedSize : chunk.indexOf(eof);
    let done = false;
    if (trim > 0) {
      chunk = chunk.slice(0, trim - 1);
      done = true;
      // console.log('THIS IS THE LAST INPUT', chunk.length);
    }
    if (chunk.length === 0) {
      break;
    }

    written += chunk.length;

    await new Promise<void>((resolve, reject) =>
      output.write(
        chunk,
        'binary',
        (err) => {
          if (!err) {
            resolve();
          } else {
            console.error(err);
            reject(err);
          }
        }
      )
    );

    const data = await Promise.resolve(output.read());

    if (data !== null) {
      yield data;
    }

    // TODO: process data decriptor (see parse)
    /*
    if (fileSizeKnown) {
      readRecord(reader);
    }
    else {
      readDataDescriptor(reader);
    }
    */
  }

  const last = output.read();

  if (last !== null) {
    return last;
  }
};

export default inflate;
