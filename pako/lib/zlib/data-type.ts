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

/* Possible values of the data_type field (though see inflate()) */
export const Z_BINARY = 0;
export const Z_TEXT = 1;
export const Z_ASCII = 1; // = Z_TEXT (deprecated)
export const Z_UNKNOWN = 2;
export const Z_DATA_TYPES = [Z_BINARY, Z_TEXT, Z_UNKNOWN] as const;
export type DataType = typeof Z_DATA_TYPES[number];
