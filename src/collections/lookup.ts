import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { Dictionary } from './dictionary';
import { SelectExpression } from '../delegates';
import { ILookup } from '../interfaces/i-lookup';

export class Lookup<TSource, TKey, TValue = TSource> implements ILookup<TKey, TValue> {
    private storage: Dictionary<TKey, TValue[]> = null;

    public constructor(
        items: TSource[],
        keySelector: SelectExpression<TSource, TKey>,
        comparator: IEqualityComparator<TKey>,
        valueSelector?: SelectExpression<TSource, TValue>,
    ) {
        this.storage = new Dictionary<TKey, TValue[]>(comparator);
        this.fillCollection(items, keySelector, valueSelector);
    }

    public get entries(): Array<[TKey, TValue[]]> {
        return this.storage.entries;
    }

    public get length(): number {
        return this.storage.length;
    }

    private static fakeSelector<T>(item: T): T {
        return item;
    }

    public get(key: TKey): TValue[] {
        return this.storage.get(key);
    }

    public containsKey(key: TKey): boolean {
        return this.get(key) != null;
    }

    private fillCollection(
        items: TSource[],
        keySelector: SelectExpression<TSource, TKey>,
        valueSelector?: SelectExpression<TSource, TValue>,
    ): void {
        valueSelector = valueSelector || (Lookup.fakeSelector as SelectExpression<TSource, TValue>);

        for (let i = 0, len = items.length; i < len; i++) {
            const key = keySelector(items[i]);
            const value = valueSelector(items[i]);

            const arr = this.storage.get(key) || [];

            arr.push(value);
            this.storage.set(key, arr);
        }
    }
}
