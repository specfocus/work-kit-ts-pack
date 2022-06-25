import { Thing } from '@specfocus/spec-focus/contracts/thing';
import { AsyncAction } from '@specfocus/main-focus/actions/async';

export const BYTES = 'bytes';

export type BytesActionType = typeof BYTES;

/**
 * Convert oject to bytes
 */
export interface BytesAction extends Omit<AsyncAction, 'atom' | 'type' | 'what'> {
  type: BytesActionType;
  what: Thing;
}
