import { SelectExpression } from '../delegates';
import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { ILookup } from '../interfaces/i-lookup';
import { Lookup } from '../collections/lookup';
import { HashSet } from '../collections/hash-set';
import { ISequence } from '../interfaces/i-sequence';
import { DefaultComparator } from '../utils/default-comparator';
import { Dictionary } from '../collections/dictionary';
import { fakeSelector } from '../utils/selectors';

export class Materializer {
    private static defaultComparator: IEqualityComparator<any> = new DefaultComparator();

    public static toLookup<TItem, TKey, TValue>(
        sequence: ISequence<TItem>,
        arg1: SelectExpression<TItem, TKey>,
        arg2?: IEqualityComparator<TKey> | SelectExpression<TItem, TValue>,
        arg3?: SelectExpression<TItem, TValue>,
    ): ILookup<TKey, TValue> {
        if (typeof arg2 === 'function') {
            return new Lookup<TItem, TKey, TValue>(sequence.toArray(), arg1, Materializer.defaultComparator, arg2);
        } else {
            return new Lookup<TItem, TKey, TValue>(sequence.toArray(), arg1, arg2, arg3);
        }
    }

    public static toHashSet<TItem>(sequence: ISequence<TItem>, comparator?: IEqualityComparator<TItem>): HashSet<TItem> {
        const result = new HashSet<TItem>(comparator || Materializer.defaultComparator);

        const array = sequence.toArray();

        for (let i = 0, len = array.length; i < len; i++) {
            result.add(array[i]);
        }

        return result;
    }

    public static toDictionary<TItem, TKey, TValue>(
        sequence: ISequence<TItem>,
        arg1: SelectExpression<TItem, TKey>,
        arg2?: IEqualityComparator<TKey> | SelectExpression<TItem, TValue>,
        arg3?: SelectExpression<TItem, TValue>,
    ): Dictionary<TKey, TValue> {
        const data = sequence.toArray();

        if (typeof arg2 === 'function') {
            return Materializer.createDictionary(data, Materializer.defaultComparator, arg1, arg2);
        } else {
            return Materializer.createDictionary(data, arg2, arg1, arg3);
        }
    }

    private static createDictionary<TItem, TKey, TValue>(
        array: TItem[],
        comparator: IEqualityComparator<TKey>,
        keySelector: SelectExpression<TItem, TKey>,
        valueSelector: SelectExpression<TItem, TValue> = fakeSelector,
    ): Dictionary<TKey, TValue> {
        const result = new Dictionary<TKey, TValue>(comparator);

        for (let i = 0, len = array.length; i < len; i++) {
            const key = keySelector(array[i]);

            if (!result.containsKey(key)) {
                const value = valueSelector(array[i]);

                result.set(key, value);
            }
        }

        return result;
    }
}
