import { Dictionary } from './dictionary';
import { IEqualityComparator } from '../interfaces/i-equality-comparator';

export class HashSet<T> {
    private storage: Dictionary<T, T>;

    public constructor(comparer?: IEqualityComparator<T>) {
        this.storage = new Dictionary<T, T>(comparer);
    }

    public add(item: T): void {
        if (!this.storage.containsKey(item)) {
            this.storage.set(item, item);
        }
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
