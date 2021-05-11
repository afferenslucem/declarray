import {IComparator} from "../interfaces/i-comparator";
import {Entry} from "../models/entry";

const PROBE_MAX_LENGTH = 5;

export class HashStorage<TKey, TValue> {
    public readonly comparator: IComparator<TKey> = null;
    public readonly array: Array<Entry<TKey, TValue>> = null;

    private _count: number;


    public get filled(): number {
        return this.count / this.length;
    }

    public get count(): number {
        return this._count;
    }

    public get length(): number {
        return this.array.length;
    }

    public constructor(comparator: IComparator<TKey>, length: number = 100) {
        this.comparator = comparator;
        this.array = new Array(length).fill(null);
        this._count = 0;
    }

    public set(entry: Entry<TKey, TValue>): boolean {
        const index = this.getIndexForKey(entry.key);

        if (index === -1) {
            return false;
        }

        if (this.array[index] == null) {
            this._count++;
        }

        this.array[index] = entry;

        return true;
    }

    public get(key: TKey): TValue {
        const index = this.getIndexForKey(key);

        if (index === -1) {
            return undefined;
        } else if (this.array[index] == null) {
            return this.array[index] as any || undefined;
        } else {
            return this.array[index].value;
        }
    }

    public remove(key: TKey): void {
        const index = this.getIndexForKey(key);

        if (index === -1 || this.array[index] == null) {
            throw new Error(`Key ${key} does not exists`);
        } else {
            this._count--;
            this.array[index] = undefined;
        }
    }

    public getIndexForKey(key: TKey): number {
        const initialIndex = this.comparator.getHashCode(key) % this.length;

        const index = this.probeFromIndex(initialIndex, key);

        return index;
    }

    public probeFromIndex(index: number, key: TKey): number {
        for (let i = 0; i < PROBE_MAX_LENGTH; i++) {
            const checkIndex = (index + Math.pow(2 * i, 2)) % this.length;

            if (this.array[checkIndex] == null) {
                return checkIndex;
            }

            const elKey = this.array[checkIndex].key;

            if (this.comparator.equals(elKey, key)) {
                return checkIndex;
            }
        }

        return -1;
    }
}
