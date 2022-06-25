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

import deflateFast from './deflate-fast';
import deflateSlow from './deflate-slow';
import DeflateState, { MIN_MATCH } from './deflate-state';
import deflateStored from './deflate-stored';
import zero from './zero';

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
export class Config {
  constructor(
    public good_length: number,
    public max_lazy: number,
    public nice_length: number,
    public max_chain: number,
    public func: (s: DeflateState, flush: any) => 1 | 2 | 3 | 4
  ) {
  }
}

export const configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflateStored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflateFast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflateFast),           /* 2 */
  new Config(4, 6, 32, 32, deflateFast),          /* 3 */

  new Config(4, 4, 16, 16, deflateSlow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflateSlow),         /* 5 */
  new Config(8, 16, 128, 128, deflateSlow),       /* 6 */
  new Config(8, 32, 128, 256, deflateSlow),       /* 7 */
  new Config(32, 128, 258, 1024, deflateSlow),    /* 8 */
  new Config(32, 258, 258, 4096, deflateSlow)     /* 9 max compression */
];


/* Initialize the "longest match" routines for a new zlib stream
 */
export const lm_init = (s: DeflateState) => {

  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head!); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};