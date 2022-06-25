export type StringStream = AsyncIterable<Buffer>;

export type StringArray = string[];

export interface StringBlock {
  count: number;
  order: null;
  encoding: BufferEncoding;
}

export interface StringSortedBlock extends Omit<StringBlock, 'order'> {
  first: string;
  last: string;
  order: 'asc' | 'desc';
}

export interface StringRecord {
  type: 'string';
  total: number;
  blocks: StringBlock[];
}