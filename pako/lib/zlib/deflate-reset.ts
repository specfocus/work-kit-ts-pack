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

import { Z_UNKNOWN } from './data-type';
import { lm_init } from './deflate-configuration';
import { DeflateStream } from './deflate-state';
import { BUSY_STATE, INIT_STATE } from './deflate-status';
import err from './err';
import { Z_NO_FLUSH } from './flush-mode';
import { Z_OK, Z_STREAM_ERROR } from './return-code';
import { _tr_init } from './deflate-trees';

// tslint:disable: no-bitwise
// tslint:disable: variable-name

export const deflateResetKeep = (strm: DeflateStream) => {

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
    :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH;
  _tr_init(s);
  return Z_OK;
};


export const deflateReset = (strm: DeflateStream) => {
  const ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state!);
  }
  return ret;
};
