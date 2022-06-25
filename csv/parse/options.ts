import escapeRegExp from 'lodash.escaperegexp';
import isNil from 'lodash.isnil';
import { ScannerOptions } from './Scanner';

export interface SkipOptions {
  skipLines: number;
  skipRows: number;
}

export interface TokenOptions {
  carriageReturn: string;
  comment: string | null;
  delimiter: string | null;
  escapeChar: string | null;
  quote: string | null;
  supportsComments: boolean;
}

export interface ParseOptions extends SkipOptions, Omit<ScannerOptions, 'hasMoreData'>, TokenOptions {
  encoding: BufferEncoding;
  escape: string | null;
  ignoreEmpty?: boolean;
}

class ParserOptionsFactory implements ParseOptions {
  public readonly carriageReturn: string = '\r';
  public readonly comment: string | null = null;
  public readonly delimiter: string = ',';
  public readonly encoding: BufferEncoding = 'utf8';
  public readonly escape: string | null = null;
  public readonly escapeChar: string | null;
  public readonly escapedDelimiter: string;
  public readonly ignoreEmpty: boolean = false;
  public readonly quote: string | null = '"';
  public readonly skipLines: number = 0;
  public readonly skipRows: number = 0;
  public readonly supportsComments: boolean = false;

  public constructor(opts?: Partial<ParseOptions>) {
    Object.assign(this, opts || {});
    if (this.delimiter.length > 1) {
      throw new Error('delimiter option must be one character long');
    }
    this.escapeChar = this.escape ?? this.quote;
    this.escapedDelimiter = escapeRegExp(this.delimiter);
    this.supportsComments = !isNil(this.comment);
  }
}

export default ParserOptionsFactory;