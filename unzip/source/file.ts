import fs from 'graceful-fs';

const file = (filename: string) => {
  const source = {
    stream: async function* (offset: number, length: number): AsyncGenerator<Buffer, void, undefined> {
      const stream = fs.createReadStream(filename, { start: offset, end: length && offset + length });
      for await (const chunk of stream) {
        yield chunk;
      };
    },
    size: (): Promise<number> => {
      return new Promise(
        (resolve, reject) => {
          fs.stat(filename, (err, d) => {
            if (err)
              reject(err);
            else
              resolve(d.size);
          });
        }
      );
    }
  };
  return source;
};

export default file;
