import { SelectExpression } from '../delegates';
import { ILookup } from './i-lookup';
import { IEqualityComparator } from './i-equality-comparator';
import { HashSet } from '../collections/hash-set';
import { Dictionary } from '../collections/dictionary';

export interface IMaterializeSequence<T> {
    toArray(): T[];

    toLookup<TKey>(key: SelectExpression<T, TKey>): ILookup<TKey, T>;

    toLookup<TKey>(key: SelectExpression<T, TKey>, comparer: IEqualityComparator<TKey>): ILookup<TKey, T>;

    toLookup<TKey, TValue>(
        key: SelectExpression<T, TKey>,
        comparer: IEqualityComparator<TKey>,
        value: SelectExpression<T, TValue>,
    ): ILookup<TKey, TValue>;

    toHashSet(): HashSet<T>;

    toHashSet(comparer: IEqualityComparator<T>): HashSet<T>;

    toDictionary<TKey>(key: SelectExpression<T, TKey>): Dictionary<TKey, T>;

    toDictionary<TKey>(key: SelectExpression<T, TKey>, comparer: IEqualityComparator<TKey>): Dictionary<TKey, T>;

    toDictionary<TKey, TValue>(
        key: SelectExpression<T, TKey>,
        comparer: IEqualityComparator<TKey>,
        value: SelectExpression<T, TValue>,
    ): Dictionary<TKey, TValue>;
}
