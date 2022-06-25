export interface Source {
  stream(offset: number, length?: number): AsyncIterable<Buffer>;
  size(): Promise<number>;
}
