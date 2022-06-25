const zero = (buf: Buffer | Uint8Array | Uint16Array | number[]) => {
  let len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
};

export default zero;
