import { IEqualityComparator } from '../../interfaces/i-equality-comparator';
import { Entry } from '../../models/entry';

export class HashStorage<TKey, TValue> {
    private comparator: IEqualityComparator<TKey> = null;
    private store: Array<Entry<TKey, TValue>[]> = null;

    private _count: number;

    private _zeroBunches = 0;

    public get zeroBunches(): number {
        return this._zeroBunches;
    }

    public get hashSize(): number {
        return this.store.length;
    }

    public get count(): number {
        return this._count;
    }

    public get pressure(): number {
        return 1 - this.zeroBunches / this.hashSize;
    }

    public constructor(comparator: IEqualityComparator<TKey>, length: number) {
        this.comparator = comparator;

        this._count = 0;

        this.store = new Array(length);
        this._zeroBunches = length;
    }

    public set(entry: Entry<TKey, TValue>): void {
        const index = this.getIndexForKey(entry.key);

        const item = this.search(index, entry.key);

        if (item) {
            item.value = entry.value;
        } else {
            this.pushToBunch(index, entry);
            this._count++;
        }
    }

    public get(key: TKey): TValue {
        const index = this.getIndexForKey(key);

        return this.search(index, key)?.value;
    }

    public remove(key: TKey): void {
        const index = this.getIndexForKey(key);

        this.removeFromBunch(index, key);
    }

    public entries(): Entry<TKey, TValue>[] {
        return this.store.reduce((acc, item) => acc.concat(item), []);
    }

    private getIndexForKey(key: TKey): number {
        const index = this.comparator.getHashCode(key) % this.hashSize;

        return index;
    }

    private search(bunchIndex: number, key: TKey): Entry<TKey, TValue> {
        const bunch = this.store[bunchIndex];

        return bunch?.find(item => this.comparator.equals(item.key, key));
    }

    private searchIndex(bunchIndex: number, key: TKey): number {
        const bunch = this.getBunchOrCreate(bunchIndex);

        return bunch.findIndex(item => this.comparator.compare(item.key, key) <= 0 && this.comparator.equals(item.key, key));
    }

    private pushToBunch(bunchIndex: number, entry: Entry<TKey, TValue>): void {
        const bunch = this.getBunchOrCreate(bunchIndex);

        this.checkDecrementZero(bunch);

        bunch.push(entry);
    }

    private removeFromBunch(bunchIndex: number, key: TKey): void {
        const bunch = this.getBunchOrCreate(bunchIndex);

        const idx = this.searchIndex(bunchIndex, key);

        if (idx !== -1) {
            bunch.splice(idx, 1);
            this._count--;
            this.checkIncrementZero(bunch);
        }
    }

    private getBunchOrCreate(bunchIndex: number): Entry<TKey, TValue>[] {
        const bunch = this.store[bunchIndex];

        if (!bunch) {
            this.store[bunchIndex] = [];
        }

        return this.store[bunchIndex];
    }

    private checkIncrementZero(bunch: Entry<TKey, TValue>[]): void {
        if (!bunch.length) {
            this._zeroBunches++;
        }
    }

    private checkDecrementZero(bunch: Entry<TKey, TValue>[]): void {
        if (!bunch.length) {
            this._zeroBunches--;
        }
    }
}
