import {IComparator} from "../interfaces/i-comparator";
import {DefaultComparator} from "../utils/default-comparator";
import {HashStorage} from "./hash-storage";
import {Entry} from "../models/entry";

const MIN_HASH_LENGTH = 100;
const REHASH_INDEX = 10;
const REHASH_TRYOUTS = 3;



export class Dictionary<TKey, TValue> {
    private comparator: IComparator<TKey> = null;
    private hashStorage: HashStorage<TKey, TValue> = null;

    public constructor(comparator?: IComparator<TKey>) {
        this.comparator = comparator || new DefaultComparator() as any;

        this.hashStorage = new HashStorage<TKey, TValue>(this.comparator)
    }

    public set(key: TKey, value: TValue) {
        this.insert({key, value});

        if (this.hashStorage.filled >= 0.5) {
            this.rehashUp();
        }
    }

    private insert(entry: Entry<TKey, TValue>, trying = 0): void {
        if (trying === REHASH_TRYOUTS) {
            throw new Error(`Could not insert value { key: ${entry.key}, value: ${entry.value} }`);
        }

        const result = this.hashStorage.set(entry);

        if(!result) {
            this.rehashUp();

            this.insert(entry, trying + 1);
        }
    }

    public get(key: TKey): TValue {
        return this.hashStorage.get(key);
    }

    public remove(key: TKey): void {
        return this.hashStorage.remove(key);

        if (this.hashStorage.filled <= 0.1 && this.hashStorage.length > MIN_HASH_LENGTH) {
            this.rehashDown();
        }
    }

    private rehash(length: number) {
        const storage = new HashStorage<TKey, TValue>(this.comparator, length);

        this.hashStorage.array.filter(Boolean).forEach(item => {
            storage.set(item);
        })

        this.hashStorage = storage;
    }

    private rehashUp(): void {
        this.rehash(this.hashStorage.length * REHASH_INDEX);
    }

    private rehashDown(): void {
        this.rehash(this.hashStorage.length / REHASH_INDEX);
    }
}
