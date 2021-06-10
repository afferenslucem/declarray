import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { DefaultComparator } from '../utils/default-comparator';
import { HashStorage } from './hash-map/hash-storage';

const REHASH_INDEX = 10;
const CRITICAL_BUNCH_LENGTH = 3;
const REHASH_DOWN_THRESHOLD = 0.85;
const MIN_HASH_LENGTH = 100;
const MAX_HASH_LENGTH = 10000;

export class Dictionary<TKey, TValue> {
    private comparator: IEqualityComparator<TKey> = null;
    private hashStorage: HashStorage<TKey, TValue> = null;

    public get entries(): Array<[TKey, TValue]> {
        return this.hashStorage.entries().map(item => [item.key, item.value]);
    }

    public get keys(): TKey[] {
        return this.hashStorage.entries().map(item => item.key);
    }

    public get values(): TValue[] {
        return this.hashStorage.entries().map(item => item.value);
    }

    public get length(): number {
        return this.hashStorage.count;
    }

    public constructor(comparator?: IEqualityComparator<TKey>, initialLength?: number) {
        this.comparator = comparator || (new DefaultComparator() as any);

        const length = Dictionary.chooseLength(initialLength);

        this.innerClear(length);
    }

    private static chooseLength(initialLength?: number): number {
        if (!initialLength) return MIN_HASH_LENGTH;

        return initialLength > MAX_HASH_LENGTH ? MAX_HASH_LENGTH : initialLength;
    }

    public set(key: TKey, value: TValue): void {
        this.hashStorage.set({ key, value });

        if (this.hashStorage.longestBunch >= CRITICAL_BUNCH_LENGTH) {
            this.rehashUp();
        }
    }

    public get(key: TKey): TValue {
        return this.hashStorage.get(key);
    }

    public remove(key: TKey): void {
        this.hashStorage.remove(key);

        if (this.hashStorage.zeroBunches >= REHASH_DOWN_THRESHOLD && this.hashStorage.hashSize > MIN_HASH_LENGTH) {
            this.rehashDown();
        }
    }

    public containsKey(key: TKey): boolean {
        return this.get(key) != null;
    }

    private innerClear(initialLength: number): void {
        this.hashStorage = new HashStorage<TKey, TValue>(this.comparator, initialLength);
    }

    public clear(): void {
        this.innerClear(MIN_HASH_LENGTH);
    }

    private rehashUp(): void {
        this.rehash(this.hashStorage.hashSize * REHASH_INDEX);
    }

    private rehashDown(): void {
        this.rehash(this.hashStorage.hashSize / REHASH_INDEX);
    }

    private rehash(length: number) {
        const storage = new HashStorage<TKey, TValue>(this.comparator, length);

        const items = this.hashStorage.entries();

        for (let i = 0; i < items.length; i++) {
            storage.set(items[i]);
        }

        this.hashStorage = storage;
    }
}
