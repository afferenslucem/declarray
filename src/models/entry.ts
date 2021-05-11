export class Entry<TKey, TValue> {
    key: TKey;
    value: TValue;

    public constructor(key?: TKey, value?: TValue) {
        this.key = key;
        this.value = value;
    }
}
