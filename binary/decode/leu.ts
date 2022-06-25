// convert byte strings to unsigned little endian numbers
const decodeLEu = (bytes: Buffer): number => {
  let acc = 0;
  for (let i = 0; i < bytes.length; i++) {
    acc += Math.pow(256, i) * bytes[i];
  }
  return acc;
};

export default decodeLEu;

