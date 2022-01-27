import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { DefaultComparator } from '../utils/default-comparator';
import { Entry } from '../models/entry';

declare type Bunch<TKey, TValue> = Array<Entry<TKey, TValue>>;

export const FIND_AT_BUNCH = Symbol('DICTIONARY_FIND_AT_BUNCH');
export const FIND_INSERT_INDEX = Symbol('DICTIONARY_FIND_INSERT_INDEX');
export const FIND_REMOVE_INDEX = Symbol('DICTIONARY_FIND_REMOVE_INDEX');
export const INSERT_UNIQUE_KEY = Symbol('DICTIONARY_INSERT_UNIQUE_KEY');

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

    public [INSERT_UNIQUE_KEY](key: TKey, value: TValue): void {
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
        const item = this[FIND_AT_BUNCH](bunch, entry.key);

        if (item != null) {
            item.value = entry.value;
            return;
        }

        this.saveToBunch(bunch, entry);
    }

    private tryInsertUniqueToBunch(bunch: Bunch<TKey, TValue>, entry: Entry<TKey, TValue>): void {
        const item = this[FIND_AT_BUNCH](bunch, entry.key);

        if (item != null) {
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

        for (let i = 0, len = bunch.length; i < len; i++) {
            const comparison = this.comparator.compare(bunch[i].key, key);

            if (comparison > 0) break;

            if (this.comparator.equals(bunch[i].key, key)) return bunch[i].value;
        }

        return undefined;
    }

    public remove(key: TKey): void {
        const hash = this.comparator.getHashCode(key);
        const bunch = this.hashStorage.get(hash);

        if (!bunch) {
            return;
        }

        const target = this[FIND_REMOVE_INDEX](bunch, key);

        if (target != null) {
            bunch.splice(target, 1);
            this.itemsCount--;
        }
    }

    public containsKey(key: TKey): boolean {
        const hash = this.comparator.getHashCode(key);
        const bunch = this.hashStorage.get(hash);

        if (!bunch) {
            return false;
        }

        for (let i = 0, len = bunch.length; i < len; i++) {
            const comparison = this.comparator.compare(bunch[i].key, key);

            if (comparison > 0) break;

            if (this.comparator.equals(bunch[i].key, key)) return true;
        }

        return false;
    }

    public clear(): void {
        this.hashStorage.clear();
        this.itemsCount = 0;
    }

    private saveToBunch(bunch: Bunch<TKey, TValue>, entry: Entry<TKey, TValue>): void {
        const target = this[FIND_INSERT_INDEX](bunch, entry.key);

        if (target == null) {
            bunch.push(entry);
        } else {
            bunch.splice(target, 0, entry);
            this.itemsCount++;
        }
    }

    public [FIND_AT_BUNCH](bunch: Bunch<TKey, TValue>, key: TKey): Entry<TKey, TValue> {
        for (let i = 0, len = bunch.length; i < len; i++) {
            const comparing = this.comparator.compare(bunch[i].key, key);

            if (comparing > 0) {
                break;
            } else if (comparing < 0) {
                continue;
            }

            if (this.comparator.equals(key, bunch[i].key)) {
                return bunch[i];
            }
        }
        return undefined;
    }

    public [FIND_INSERT_INDEX](bunch: Bunch<TKey, TValue>, key: TKey): number {
        for (let i = 0, len = bunch.length; i < len; i++) {
            if (this.comparator.compare(bunch[i].key, key) > 0) {
                return i;
            }
        }
        return undefined;
    }

    public [FIND_REMOVE_INDEX](bunch: Bunch<TKey, TValue>, key: TKey): number {
        for (let i = 0, len = bunch.length; i < len; i++) {
            const comparing = this.comparator.compare(bunch[i].key, key);

            if (comparing > 0) {
                break;
            } else if (comparing < 0) {
                continue;
            }

            if (this.comparator.equals(key, bunch[i].key)) {
                return i;
            }
        }

        return undefined;
    }
}
