export interface ColumnFormatterOptions {
  trim?: boolean;
  ltrim?: boolean;
  rtrim?: boolean;
}

export class ColumnFormatter {
  public readonly format: (col: string) => string;

  public constructor(parserOptions: ColumnFormatterOptions) {
    if (parserOptions.trim) {
      this.format = (col: string): string => col.trim();
    } else if (parserOptions.ltrim) {
      this.format = (col: string): string => col.trimStart();
    } else if (parserOptions.rtrim) {
      this.format = (col: string): string => col.trimEnd();
    } else {
      this.format = (col: string): string => col;
    }
  }
}
