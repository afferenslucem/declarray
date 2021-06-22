import { Dictionary, INSERT_UNIQUE_KEY } from './dictionary';
import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { ISequence } from '../interfaces/i-sequence';

export class HashSet<T> {
    public static from<T>(sequence: ISequence<T>, comparer?: IEqualityComparator<T>): HashSet<T> {
        const array = sequence.toArray();
        const set = new HashSet<T>(comparer, array.length);

        for (let i = array.length - 1; i >= 0; i--) {
            set.storage.set(array[i], array[i]);
        }

        return set;
    }

    private storage: Dictionary<T, T>;

    public constructor(comparer?: IEqualityComparator<T>, initialLength?: number) {
        this.storage = new Dictionary<T, T>(comparer, initialLength);
    }

    public add(item: T): void {
        this.storage[INSERT_UNIQUE_KEY](item, item);
    }

    public remove(item: T): void {
        this.storage.remove(item);
    }

    public contains(item: T): boolean {
        return this.storage.containsKey(item);
    }

    public clear(): void {
        return this.storage.clear();
    }

    public get entries(): Array<T> {
        return this.storage.keys;
    }

    public get length(): number {
        return this.storage.length;
    }
}
