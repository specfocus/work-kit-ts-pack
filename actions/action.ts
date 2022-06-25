import { ACTION_TYPES as BASE_ACTION_TYPES, type Action as SuperAction } from '@specfocus/main-focus/actions/action';
import { BYTES, type BytesAction } from './bytes';
import { PARSE, type ParseAction } from './parse';

export const ACTION_TYPES = [
  ...BASE_ACTION_TYPES,
  BYTES,
  PARSE
] as const;

export type ActionType = typeof ACTION_TYPES[number];

export type Action =
  | SuperAction
  | BytesAction
  | ParseAction;