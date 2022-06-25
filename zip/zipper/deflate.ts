import { createDeflate, createDeflateRaw, createGunzip, createGzip, deflate } from 'zlib';
import { ZlibOptions } from 'zlib';
import zlib_deflate from '../../pako/lib/zlib/deflate';

const options: ZlibOptions = {
  /**
   * @default constants.Z_NO_FLUSH
   */
  // flush?: number | undefined;
  /**
   * @default constants.Z_FINISH
   */
  // finishFlush?: number | undefined;
  /**
   * @default 16*1024
   */
  // chunkSize?: number | undefined;
  // windowBits?: number | undefined;
  // level?: number | undefined; // compression only
  // memLevel?: number | undefined; // compression only
  // strategy?: number | undefined; // compression only
  // dictionary?: NodeJS.ArrayBufferView | ArrayBuffer | undefined; // deflate/inflate only, empty dictionary by default
  //info?: boolean | undefined;
  // maxOutputLength?: number | undefined;
};
const d = createDeflate({});
const dr = createDeflateRaw({});

const pakoDeflate = async function* (source: AsyncIterable<Buffer>, flush_mode: any): AsyncGenerator<Buffer> {
  for await (const data of source) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    let status, _flush_mode;

    if (this.ended) { return false; }

    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

    // Convert data if needed
    if (typeof data === 'string') {
      // If we need to compress text, change encoding to utf8.
      strm.input = strings.string2buf(data);
    } else if (toString.call(data) === '[object ArrayBuffer]') {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }

    strm.next_in = 0;
    strm.avail_in = strm.input.length;

    for (; ;) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }

      // Make sure avail_out > 6 to avoid repeating markers
      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }

      status = zlib_deflate.deflate(strm, _flush_mode);

      // Ended => flush and finish
      if (status === Z_STREAM_END) {
        if (strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
        }
        status = zlib_deflate.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK;
      }

      // Flush if out buffer full
      if (strm.avail_out === 0) {
        this.onData(strm.output);
        continue;
      }

      // Flush if requested and has data
      if (_flush_mode > 0 && strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }

      if (strm.avail_in === 0) break;
    }
  }

  return true;
};
