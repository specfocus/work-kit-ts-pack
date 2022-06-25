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

export const BS_NEED_MORE = 1; /* block not completed, need more input or more output */
export const BS_BLOCK_DONE = 2; /* block flush performed */
export const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
export const BS_FINISH_DONE = 4; /* finish done, accept no more input or output */
export const BLOCK_STATES = [
  BS_NEED_MORE,
  BS_BLOCK_DONE,
  BS_FINISH_STARTED,
  BS_FINISH_DONE
] as const;
export type BlockState = typeof BLOCK_STATES[number];
