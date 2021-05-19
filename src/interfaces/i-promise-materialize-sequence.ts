import { SelectExpression } from '../delegates';
import { ILookup } from './i-lookup';
import { IEqualityComparator } from './i-equality-comparator';
import { HashSet } from '../collections/hash-set';
import { Dictionary } from '../collections/dictionary';

export interface IPromiseMaterializeSequence<T> {
    toArray(): Promise<T[]>;

    toLookup<TKey>(key: SelectExpression<T, TKey>): Promise<ILookup<TKey, T>>;

    toLookup<TKey>(key: SelectExpression<T, TKey>, comparer: IEqualityComparator<TKey>): Promise<ILookup<TKey, T>>;

    toLookup<TKey, TValue>(
        key: SelectExpression<T, TKey>,
        comparer: IEqualityComparator<TKey>,
        value: SelectExpression<T, TValue>,
    ): Promise<ILookup<TKey, TValue>>;

    toHashSet(): Promise<HashSet<T>>;

    toHashSet(comparer: IEqualityComparator<T>): Promise<HashSet<T>>;

    toDictionary<TKey>(key: SelectExpression<T, TKey>): Promise<Dictionary<TKey, T>>;

    toDictionary<TKey>(key: SelectExpression<T, TKey>, comparer: IEqualityComparator<TKey>): Promise<Dictionary<TKey, T>>;

    toDictionary<TKey, TValue>(
        key: SelectExpression<T, TKey>,
        comparer: IEqualityComparator<TKey>,
        value: SelectExpression<T, TValue>,
    ): Promise<Dictionary<TKey, TValue>>;
}
