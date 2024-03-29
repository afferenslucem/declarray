import { ISequence } from '../../interfaces/i-sequence';
import { IPromiseMaterializeSequence } from '../../interfaces/i-promise-materialize-sequence';
import { SelectExpression } from '../../delegates';
import { IEqualityComparator } from '../../interfaces/i-equality-comparator';
import { ILookup } from '../../interfaces/i-lookup';
import { HashSet } from '../../collections/hash-set';
import { Dictionary } from '../../collections/dictionary';

export class PromisifySequence<T> implements IPromiseMaterializeSequence<T> {
    private inner: ISequence<T>;

    public constructor(inner: ISequence<T>) {
        this.inner = inner;
    }

    public toArray(): Promise<T[]> {
        return Promise.resolve().then(() => this.toArrayMacrotask());
    }

    public toLookup<TKey, TValue>(
        arg1: SelectExpression<T, TKey>,
        arg2?: IEqualityComparator<TKey> | SelectExpression<T, TValue>,
        arg3?: SelectExpression<T, TValue>,
    ): Promise<ILookup<TKey, TValue>> {
        return Promise.resolve().then(() => this.toLookupMacrotask(arg1, arg2, arg3));
    }

    public toHashSet(comparator?: IEqualityComparator<T>): Promise<HashSet<T>> {
        return Promise.resolve().then(() => this.toHashSetMacrotask(comparator));
    }

    public toDictionary<TKey, TValue>(
        arg1: SelectExpression<T, TKey>,
        arg2?: IEqualityComparator<TKey> | SelectExpression<T, TValue>,
        arg3?: SelectExpression<T, TValue>,
    ): Promise<Dictionary<TKey, TValue>> {
        return Promise.resolve().then(() => this.toDictionaryMacrotask(arg1, arg2, arg3));
    }

    private toArrayMacrotask(): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            setTimeout(() => {
                try {
                    const result = this.inner.toArray();
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    private toLookupMacrotask<TKey, TValue>(
        arg1: SelectExpression<T, TKey>,
        arg2?: IEqualityComparator<TKey> | SelectExpression<T, TValue>,
        arg3?: SelectExpression<T, TValue>,
    ): Promise<ILookup<TKey, TValue>> {
        return new Promise<ILookup<TKey, TValue>>((resolve, reject) => {
            setTimeout(() => {
                try {
                    // @ts-ignore
                    const result = this.inner.toLookup(arg1, arg2, arg3);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    private toHashSetMacrotask(comparator?: IEqualityComparator<T>): Promise<HashSet<T>> {
        return new Promise<HashSet<T>>((resolve, reject) => {
            setTimeout(() => {
                try {
                    const result = this.inner.toHashSet(comparator);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    private toDictionaryMacrotask<TKey, TValue>(
        arg1: SelectExpression<T, TKey>,
        arg2?: IEqualityComparator<TKey> | SelectExpression<T, TValue>,
        arg3?: SelectExpression<T, TValue>,
    ): Promise<Dictionary<TKey, TValue>> {
        return new Promise<Dictionary<TKey, TValue>>((resolve, reject) => {
            setTimeout(() => {
                try {
                    // @ts-ignore
                    const result = this.inner.toDictionary(arg1, arg2, arg3);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
