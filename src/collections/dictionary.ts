import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { DefaultComparator } from '../utils/default-comparator';
import { Entry } from '../models/entry';

declare type Bunch<TKey, TValue> = Array<Entry<TKey, TValue>>;

export class Dictionary<TKey, TValue> {
    private comparator: IEqualityComparator<TKey> = null;
    private hashStorage: Map<number, Bunch<TKey, TValue>> = null;

    private itemsCount = 0;

    public get entries(): Array<[TKey, TValue]> {
        return Array.from(this.hashStorage.entries())
            .reduce((acc, entry) => acc.concat(entry?.[1] || []), [])
            .map(item => [item.key, item.value]);
    }

    public get keys(): TKey[] {
        return this.entries.map(item => item[0]);
    }

    public get values(): TValue[] {
        return this.entries.map(item => item[1]);
    }

    public get length(): number {
        return this.itemsCount;
    }

    public constructor(comparator?: IEqualityComparator<TKey>, initialLength?: number) {
        this.comparator = comparator || (new DefaultComparator() as any);
        this.hashStorage = new Map<number, Bunch<TKey, TValue>>();
    }

    public set(key: TKey, value: TValue): void {
        const hash = this.comparator.getHashCode(key);
        const bunch = this.hashStorage.get(hash);

        const entry = {
            key,
            value,
        };

        if (bunch) {
            this.tryInsertToBunch(bunch, entry);
        } else {
            const created = this.createBunch(entry);
            this.hashStorage.set(hash, created);
        }
    }

    public setIfKeyNotExists(key: TKey, value: TValue): void {
        const hash = this.comparator.getHashCode(key);
        const bunch = this.hashStorage.get(hash);

        const entry = {
            key,
            value,
        };

        if (bunch) {
            this.tryInsertUniqueToBunch(bunch, entry);
        } else {
            const created = this.createBunch(entry);
            this.hashStorage.set(hash, created);
        }
    }

    private tryInsertToBunch(bunch: Bunch<TKey, TValue>, entry: Entry<TKey, TValue>): void {
        const item = this.findAtBunch(bunch, entry.key);

        if (item) {
            item.value = entry.value;
            return;
        }

        this.saveToBunch(bunch, entry);
    }

    private tryInsertUniqueToBunch(bunch: Bunch<TKey, TValue>, entry: Entry<TKey, TValue>): void {
        const item = this.findAtBunch(bunch, entry.key);

        if (item) {
            return;
        }

        this.saveToBunch(bunch, entry);
    }

    private createBunch(entry: Entry<TKey, TValue>): Bunch<TKey, TValue> {
        const bunch = [entry];
        this.itemsCount++;

        return bunch;
    }

    public get(key: TKey): TValue {
        const hash = this.comparator.getHashCode(key);
        const bunch = this.hashStorage.get(hash);

        if (!bunch) {
            return undefined;
        }

        let i = 0;

        while (i < bunch.length && this.comparator.compare(bunch[i].key, key) <= 0) {
            if (this.comparator.equals(bunch[i].key, key)) {
                return bunch[i].value;
            }
            i++;
        }

        return undefined;
    }

    public remove(key: TKey): void {
        const hash = this.comparator.getHashCode(key);
        const bunch = this.hashStorage.get(hash);

        if (!bunch) {
            return;
        }

        const target = this.findRemoveIndex(bunch, key);

        if (target !== -1) {
            bunch.splice(target, 1);
            this.itemsCount--;
        }
    }

    public containsKey(key: TKey): boolean {
        return this.get(key) != null;
    }

    public clear(): void {
        this.hashStorage.clear();
        this.itemsCount = 0;
    }

    private saveToBunch(bunch: Bunch<TKey, TValue>, entry: Entry<TKey, TValue>): void {
        const target = this.findInsertIndex(bunch, entry.key);

        if (target === -1) {
            bunch.push(entry);
        } else {
            bunch.splice(target, 0, entry);
            this.itemsCount++;
        }
    }

    private findAtBunch(bunch: Bunch<TKey, TValue>, key: TKey): Entry<TKey, TValue> {
        for (let i = 0, len = bunch.length; i < len; i++) {
            if (this.comparator.compare(bunch[i].key, key) < 0) {
                break;
            }

            if (this.comparator.equals(key, bunch[i].key)) {
                return bunch[i];
            }
        }
        return undefined;
    }

    private findInsertIndex(bunch: Bunch<TKey, TValue>, key: TKey): number {
        for (let i = 0, len = bunch.length; i < len; i++) {
            if (this.comparator.compare(bunch[i].key, key) < 0) {
                return i;
            }
        }
        return -1;
    }

    private findRemoveIndex(bunch: Bunch<TKey, TValue>, key: TKey): number {
        for (let i = 0, len = bunch.length; i < len; i++) {
            if (this.comparator.compare(bunch[i].key, key) < 0) {
                break;
            }

            if (this.comparator.equals(key, bunch[i].key)) {
                return i;
            }
        }

        return -1;
    }
}
