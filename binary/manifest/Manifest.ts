type FileExt = 'bin' | 'txt' | 'csv' | 'json';

export interface Manifest {
  collection: string;
  period?: number;
  version: number; // timestamp unique version
  patches?: number; // patches version
  columns: Column[];
  dumps: Dump[];
}

interface BaseColumn {
  field: string;
  order?: 'asc' | 'desc';
}

type Endian = 'big' | 'little';

type BinaryType = 'binary';

interface BinaryColumn extends BaseColumn {
  type: BinaryType;
  ext: 'bin';
}

type BooleanType = 'boolean';

interface BooleanColumn extends BaseColumn {
  type: BooleanType;
  ext: 'bin';
}

type FloatingPointType = 'float' | 'double';

interface FloatingPointColumn extends BaseColumn {
  type: FloatingPointType;
  endian: Endian;
  ext: 'bin';
}

type IntType = 'int8' | 'int16' | 'int24' | 'int32' | 'int40' | 'int48' | 'int64'

interface IntegerColumn extends BaseColumn {
  type: IntType;
  endian: Endian;
  ext: 'bin';
}

type StringType = 'string' | 'json' | 'decimal';

interface StringColumn extends BaseColumn {
  type: StringType;
  ext: 'txt';
}

type UintTypes = 'uint8' | 'uint16' | 'uint24' | 'uint32' | 'uint40' | 'uint48' | 'uint64';

const BYTE_LENGTH = {
  boolean: 1, // ~ int8 0, 1, -1 for undefined
  double: 8,
  float: 4,
  int8: 1,
  int16: 2,
  int24: 3,
  int32: 4,
  int40: 5,
  int48: 6,
  int64: 8,
  uint8: 1,
  uint16: 2,
  uint24: 3,
  uint32: 4,
  uint40: 5,
  uint48: 6,
  uint64: 8,
}

interface WordColumn extends BaseColumn {
  type: UintTypes;
  endian: Endian;
  ext: 'bin';
}

export type Column = BinaryColumn | BooleanColumn | FloatingPointColumn | IntegerColumn | StringColumn | WordColumn;

interface BsonDump {
  ext: 'json';
}

interface CsvDump {
  ext: 'csv';
  headers: string[] | Record<string, string>;
}

interface JsonDump {
  ext: 'json';
  fields: string[] | Record<string, string>;
}

type Dump = BsonDump | JsonDump | CsvDump;
