/** No support a null values in CSV, identical to empty (undefined) values */ 
export declare type Value<optional extends boolean = true> =
    | boolean
    | number
    | string
    | (optional extends true ? undefined : never);

export type RowHashArray<V = any> = [string, V][];

export type ValueArray<V extends Value = Value> = V[];

export type Column<V extends Value = Value> = ValueArray<V>;

export type RowMap<V = Value> = Record<string, V>;

export type RowArray<V = Value> = V[];

export type Row<V = Value> = RowMap<V> | RowArray<V> | RowHashArray;

export type HeaderArray = (string | undefined | null)[];
