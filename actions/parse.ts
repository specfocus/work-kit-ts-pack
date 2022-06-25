import { AsyncAction } from './async';

export const PARSE = 'parse';

export type ParseActionType = typeof PARSE;

/**
 * Parse binary to object
 */
export interface ParseAction extends Omit<AsyncAction, 'atom' | 'type' | 'what'> {
  type: ParseActionType;
  what: Uint8Array | AsyncIterable<Uint8Array>;
}
