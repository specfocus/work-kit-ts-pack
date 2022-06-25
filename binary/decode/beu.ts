// convert byte strings to unsigned big endian numbers
const decodeBEu = (bytes: Buffer): number => {
  let acc = 0;
  for (let i = 0; i < bytes.length; i++) {
    acc += Math.pow(256, bytes.length - i - 1) * bytes[i];
  }
  return acc;
};

export default decodeBEu;
