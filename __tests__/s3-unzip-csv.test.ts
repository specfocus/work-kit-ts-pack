import { GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput, HeadObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import asyncParse from '../csv/parse';
import ParserOptions from '../csv/parse/options';
import describeEntry from '../unzip/entry-record/describe-entry';
import extract from '../unzip/extract';
import fetchCentralDirectory from '../unzip/central-directory';

async function* pull(request: Promise<GetObjectCommandOutput>): AsyncGenerator<Buffer> {
  const output = await request;
  const stream: NodeJS.ReadableStream = output.Body;
  for await (const chunk of stream) {
    yield typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
  }
}

const unpack = async (client: S3Client, params: Pick<GetObjectCommandInput, 'Bucket' | 'Key'>/*, options: Options*/): Promise<any> => {
  const source = {
    size: () => client.send(
      new HeadObjectCommand({
        Bucket: params.Bucket,
        Key: params.Key
      })
    ).then(
      output => output.ContentLength || 0
    ),
    stream: (offset: number, length?: number): AsyncIterable<Buffer> => {
      const input: GetObjectCommandInput = {
        ...params
      };
      if (offset || length) {
        input.Range = 'bytes=' + offset + '-' + (length ? offset + length - 1 : '');
      }
      return pull(client.send(
        new GetObjectCommand(input)
      ));
    }
  };
  const cd = await fetchCentralDirectory(source);

  const result: [number, string][] = [];

  for (const entry of cd.entries) {
    const { isFile } = describeEntry(entry);
    if (isFile) {
      let rowCount = 0;
      console.log(entry.fileName);
      try {
        for await (const row of asyncParse(await extract(source, entry, {}), new ParserOptions())) {
          rowCount++;
          console.log(JSON.stringify(row));
        }
      } catch(e) {
        console.log('ERROR', e);
      }
      result.push([rowCount, entry.fileName]);
    }
  }

  console.log(result.map(arr => arr.join(' - ')).join('\n'));

  /*
  24 - huawei/202204/0c5d12d5428025bd0f6fc0169c503f40/C_0c5d12d5428025bd0f6fc0169c503f40_20220419064635.csv
  7 - huawei/202204/0c5d12d5428025bd0f6fc0169c503f40/0c5d12d5428025bd0f6fc0169c503f40/M_0c5d12d5428025bd0f6fc0169c503f40_20220419064635.csv
  24 - huawei/202204/0c5d12d5428025bd0f6fc0169c503f40/0c5d12d5428025bd0f6fc0169c503f40/A_0c5d12d5428025bd0f6fc0169c503f40_20220419064635.csv
  35 - huawei/202203/0c5d12d5428025bd0f6fc0169c503f40/C_0c5d12d5428025bd0f6fc0169c503f40_20220419064635.csv
  */

  return cd;
};

const config: S3ClientConfig = {
  region: 'us-west-1',
  // endpoint: 'http://s3.us-west-1.amazonaws.com',
  credentials: {
    accessKeyId: 'AKIAR5IKMS4ZKGBW7SOC',
    secretAccessKey: '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'
  }
};

const file: GetObjectCommandInput = {
  Bucket: 'kyndrylo',
  Key: 'huawei-2months.zip'
};


describe('AWS fetch', () => {
  it('should fetch file', async () => {
    const command = new GetObjectCommand(file);

    const client = new S3Client(config);
    const output = await client.send(command);
    const chunks = [];
    for await (const chunk of output.Body) {
      chunks.push(chunk);
    }
    expect(chunks.length).toBeGreaterThan(0);
  });
  it('should unzip', async () => {
    const getObject = new GetObjectCommand(file);
    const headObject = new HeadObjectCommand(file);
    const client = new S3Client(config);
    // const getWriter = ({ path }: { path: string }) => Writer({ path });
    const directory = await unpack(client, file, /*{ getWriter }*/);
    expect(directory).toBeTruthy();
    // expect(directory.files.length).toBeGreaterThan(1);
    /*
    for (const file: any of directory.files) {
      console.log(file.path, file.fileNameLength, file.fileCommentLength, file.extraFieldLength);
    }*/
  })
});