// tslint:disable: no-bitwise
const rank = (f: number): number => ((f) << 1) - ((f) > 4 ? 9 : 0);

export default rank;