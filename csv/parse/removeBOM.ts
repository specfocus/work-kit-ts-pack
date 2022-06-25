const removeBOM = (line: string): string => {
  // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
  // conversion translates it to FEFF (UTF-16 BOM)
  if (line && line.charCodeAt(0) === 0xfeff) {
    return line.slice(1);
  }
  return line;
};

export default removeBOM;
