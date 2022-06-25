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

export const INIT_STATE = 42;
export const EXTRA_STATE = 69;
export const NAME_STATE = 73;
export const COMMENT_STATE = 91;
export const HCRC_STATE = 103;
export const BUSY_STATE = 113;
export const FINISH_STATE = 666;
export const Z_STATUSES = [
  INIT_STATE,
  EXTRA_STATE,
  NAME_STATE,
  COMMENT_STATE,
  HCRC_STATE,
  BUSY_STATE,
  FINISH_STATE
] as const;
export type Status = typeof Z_STATUSES[number];
