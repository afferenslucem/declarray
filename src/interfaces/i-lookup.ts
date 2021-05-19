export interface ILookup<TKey, TValue> {
    entries: Array<[TKey, TValue[]]>;
    length: number;

    get(key: TKey): TValue[];

    containsKey(key: TKey): boolean;
}
