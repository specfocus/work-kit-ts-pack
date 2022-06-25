export interface Request extends NodeJS.ReadableStream {
  abort: () => void;
}

const url = (request: (o: any) => Request, params: any, options: any) => {
  if (typeof params === 'string')
    params = { url: params };
  if (!params.url) {
    throw 'URL missing';
  }
  params.headers = params.headers || {};

  const source = {
    stream: async function* (offset: number, length?: number): AsyncGenerator<Buffer, void, undefined>  {
      const options = Object.create(params);
      options.headers = Object.create(params.headers);
      options.headers.range = 'bytes=' + offset + '-' + (length ? length : '');
      for await (const chunk of request(options)) {
        yield typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
      }
    },
    size: (): Promise<number> => new Promise<number>(
      (resolve, reject) => {
        const req = request(params);
        req.on('response', (d: any) => {
          req.abort();
          if (!d.headers['content-length'])
            reject(new Error('Missing content length header'));
          else
            resolve(d.headers['content-length']);
        }).on('error', reject);
      }
    )
  };

  return source;
};

export default url;
