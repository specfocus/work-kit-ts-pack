import { ParseOptions } from './options';

const ROW_DELIMITER = /((?:\r\n)|\n|\r)/;

export type MaybeToken = Token | null;

export interface Token {
  content: string;
  startCursor: number;
  endCursor: number;
}

export interface ScannerState {
  line: string;
  cursor?: number;
}

export interface ScannerOptions {
  hasMoreData: boolean;
  escapedDelimiter: string;
}

export class Scanner implements ScannerState {
  // NEXT_TOKEN_REGEXP
  private readonly nextTokenSearcher: RegExp;
  public cursor = 0;
  public line: string;
  public lineLength: number;
  public readonly hasMoreData: boolean;
  
  public constructor(
    {
      cursor,
      line
    }: ScannerState,
    options: ScannerOptions
  ) {
    this.nextTokenSearcher = new RegExp(`([^\\s]|\\r\\n|\\n|\\r|${options.escapedDelimiter})`);
    this.line = line;
    this.lineLength = this.line.length;
    this.hasMoreData = options.hasMoreData;
    this.cursor = cursor || 0;
  }

  public get hasMoreCharacters(): boolean {
    return this.lineLength > this.cursor;
  }

  public get lineFromCursor(): string {
    return this.line.substring(this.cursor);
  }

  public get nextCharacterToken(): MaybeToken {
    const { cursor, lineLength } = this;
    if (lineLength <= cursor) {
      return null;
    }
    return {
      content: this.line[cursor],
      startCursor: cursor,
      endCursor: cursor,
    };
  }

  public get nextNonSpaceToken(): MaybeToken {
    const { lineFromCursor, nextTokenSearcher } = this;
    if (lineFromCursor.search(nextTokenSearcher) === -1) {
      return null;
    }
    const match = nextTokenSearcher.exec(lineFromCursor);
    if (match == null) {
      return null;
    }
    const content = match[1];
    const startCursor = this.cursor + (match.index || 0);
    return {
      content,
      startCursor,
      endCursor: startCursor + content.length - 1,
    };
  }

  public advancePastLine(): Scanner | null {
    const match = ROW_DELIMITER.exec(this.lineFromCursor);
    if (!match) {
      if (this.hasMoreData) {
        return null;
      }
      this.cursor = this.lineLength;
      return this;
    }
    this.cursor += (match.index || 0) + match[0].length;
    return this;
  }

  public advancePastToken(token: Token): Scanner {
    this.cursor = token.endCursor + 1;
    return this;
  }

  public advanceTo(cursor: number): Scanner {
    this.cursor = cursor;
    return this;
  }

  public advanceToToken(token: Token): Scanner {
    this.cursor = token.startCursor;
    return this;
  }

  public truncateToCursor(): Scanner {
    this.line = this.lineFromCursor;
    this.lineLength = this.line.length;
    this.cursor = 0;
    return this;
  }
}