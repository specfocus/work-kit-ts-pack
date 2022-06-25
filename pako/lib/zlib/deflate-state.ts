// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

import type { CompressionLevel } from './compression-level';
import { Z_NO_COMPRESSION } from './compression-level';
import type { CompressionMethod } from './compression-method';
import { Z_DEFLATED } from './compression-method';
import type { Status } from './deflate-status';
import { INIT_STATE } from './deflate-status';
import GZheader from './gzheader';
import type { Stratergy } from './stratergy';
import { Z_DEFAULT_STRATEGY } from './stratergy';
import { TreeDesc } from './deflate-trees';
import zero from './zero';
import ZStream from './zstream';

// tslint:disable: variable-name
// tslint:disable: no-bitwise

export const MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
export const MAX_WBITS = 15;
/* 32K LZ77 window */
export const DEF_MEM_LEVEL = 8;


export const LENGTH_CODES = 29;
/* number of length codes, not counting the special END_BLOCK code */
export const LITERALS = 256;
/* number of literal bytes 0..255 */
export const L_CODES = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
export const D_CODES = 30;
/* number of distance codes */
export const BL_CODES = 19;
/* number of codes used to transfer the bit lengths */
export const HEAP_SIZE = 2 * L_CODES + 1;
/* maximum heap size */
export const MAX_BITS = 15;
/* All codes must not exceed MAX_BITS bits */

export const MIN_MATCH = 3;
export const MAX_MATCH = 258;
export const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

export const PRESET_DICT = 0x20;

export const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

export type DeflateStream = ZStream<DeflateState>;

class DeflateState {
  strm: DeflateStream | null = null;            /* pointer back to this zlib stream */
  status: Status = INIT_STATE;            /* as the name implies */
  pending_buf: Uint8Array | null = null;      /* output still pending */
  pending_buf_size = 0;  /* size of pending_buf */
  pending_out = 0;       /* next pending byte to output to the stream */
  pending = 0;           /* nb of bytes in the pending buffer */
  wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  gzhead: GZheader | null = null;         /* gzip header information to write */
  gzindex = 0;           /* where in extra, name, or comment */
  method: CompressionMethod = Z_DEFLATED; /* can only be DEFLATED */
  last_flush = -1;   /* value of flush param for previous deflate call */

  w_size = 0;  /* LZ77 window size (32K by default) */
  w_bits = 0;  /* log2(w_size)  (8..16) */
  w_mask = 0;  /* w_size - 1 */

  window: Uint8Array | null = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  prev: Uint16Array | null = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  head: Uint16Array | null = null;   /* Heads of the hash chains or NIL. */

  ins_h = 0;       /* hash index of string to be inserted */
  hash_size = 0;   /* number of elements in hash table */
  hash_bits = 0;   /* log2(hash_size) */
  hash_mask = 0;   /* hash_size-1 */

  hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  match_length = 0;      /* length of best match */
  prev_match = 0;        /* previous match */
  match_available: 0 | 1 = 0;   /* set if previous match exists */
  strstart = 0;          /* start of string to insert */
  match_start = 0;       /* start of matching string */
  lookahead = 0;         /* number of valid bytes ahead in window */

  prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  // this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  level: CompressionLevel = Z_NO_COMPRESSION;     /* compression level (1..9) */
  strategy: Stratergy = Z_DEFAULT_STRATEGY;  /* favor or force Huffman coding*/

  good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  nice_match = 0; /* Stop searching when current match exceeds this */

  /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
  dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
  bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);

  l_desc: TreeDesc | null = null;         /* desc. for literal tree */
  d_desc: TreeDesc | null = null;         /* desc. for distance tree */
  bl_desc: TreeDesc | null = null;         /* desc. for bit length tree */

  // ush bl_count[MAX_BITS+1];
  bl_count = new Uint16Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  // int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  heap = new Uint16Array(2 * L_CODES + 1);  /* heap used to build the Huffman trees */

  heap_len = 0;               /* number of elements in the heap */
  heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  depth = new Uint16Array(2 * L_CODES + 1); // uch depth[2*L_CODES+1];


  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  l_buf = 0;          /* buffer index for literals or lengths */

  lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  last_lit = 0;      /* running index in l_buf */

  d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  opt_len = 0;       /* bit length of current block with optimal trees */
  static_len = 0;    /* bit length of current block with static trees */
  matches = 0;       /* number of string matches in current block */
  insert = 0;        /* bytes at end of window left to insert */


  bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  // this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */

  constructor() {
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    zero(this.heap);
    zero(this.depth);
  }
}

export default DeflateState;
